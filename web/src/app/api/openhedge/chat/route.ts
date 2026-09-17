import { createMCPClient, type MCPClient } from "@ai-sdk/mcp";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  APICallError,
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

import {
  chatErrorResponse,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "@/lib/openhedge/errors";
import { buildSystemPrompt } from "@/lib/openhedge/mcp-context";
import { allowRequest, clientIp } from "@/lib/openhedge/rate-limit";
import { openrouterModel, generationTimeout } from "@/lib/openhedge/model";

export const maxDuration = 180;

const DEFAULT_MCP_URL = "https://mcp.openhedge.app/mcp";
const MAX_MESSAGES = 20;

function lastUserText(messages: UIMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "user") {
      continue;
    }

    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n")
      .trim();

    if (text) {
      return text;
    }
  }

  return "";
}

function isTimeoutError(error: unknown) {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return /timeout of \d+ms exceeded/i.test(message);
}

function isOpenRouterQuotaError(error: unknown) {
  return (
    APICallError.isInstance(error) &&
    (error.statusCode === 401 ||
      error.statusCode === 402 ||
      error.statusCode === 403 ||
      error.statusCode === 429)
  );
}

function openRouterErrorResponse(error: unknown) {
  if (isTimeoutError(error)) {
    return chatErrorResponse(ERROR_CODES.timeout, 504);
  }

  if (isOpenRouterQuotaError(error)) {
    return chatErrorResponse(ERROR_CODES.openrouterQuota, 429);
  }

  return chatErrorResponse(ERROR_CODES.openrouterModel, 502);
}

function openRouterErrorMessage(error: unknown) {
  if (isTimeoutError(error)) {
    return ERROR_MESSAGES[ERROR_CODES.timeout];
  }

  if (isOpenRouterQuotaError(error)) {
    return ERROR_MESSAGES[ERROR_CODES.openrouterQuota];
  }

  return ERROR_MESSAGES[ERROR_CODES.openrouterModel];
}

export async function POST(request: Request) {
  if (!allowRequest(clientIp(request))) {
    return chatErrorResponse(ERROR_CODES.rateLimited, 429);
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return chatErrorResponse(ERROR_CODES.openrouterModel, 502);
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_request", message: "Could not read the chat request." },
      { status: 400 },
    );
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.slice(-MAX_MESSAGES)
    : [];

  const mcpUrl = process.env.OPENHEDGE_MCP_URL ?? DEFAULT_MCP_URL;
  const modelId = openrouterModel();
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  let mcpClient: MCPClient;

  try {
    mcpClient = await createMCPClient({
      transport: {
        type: "http",
        url: mcpUrl,
      },
    });
  } catch {
    return chatErrorResponse(ERROR_CODES.mcpUnavailable, 502);
  }

  let tools: Awaited<ReturnType<MCPClient["tools"]>>;
  let system: string;

  try {
    [tools, system] = await Promise.all([
      mcpClient.tools(),
      buildSystemPrompt(mcpClient, lastUserText(messages)),
    ]);
  } catch {
    await mcpClient.close();
    return chatErrorResponse(ERROR_CODES.mcpUnavailable, 502);
  }

  try {
    const result = streamText({
      model: openrouter(modelId),
      system,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(12),
      timeout: generationTimeout(),
      onEnd: async () => {
        await mcpClient.close();
      },
    });

    return result.toUIMessageStreamResponse({
      onError: openRouterErrorMessage,
    });
  } catch (error) {
    await mcpClient.close();
    return openRouterErrorResponse(error);
  }
}
