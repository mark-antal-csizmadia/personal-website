import type { MCPClient } from "@ai-sdk/mcp";

const THIN_SYSTEM_PROMPT =
  "You are an expert at using the Openhedge MCP server to find relevant hedges for small-business risk described by the user. Always use the Openhedge MCP server's tools. Strictly reply in English, not in any other language.";

function promptContentText(content: unknown) {
  if (!content || typeof content !== "object") {
    return "";
  }

  if ("type" in content && content.type === "text" && "text" in content) {
    return typeof content.text === "string" ? content.text : "";
  }

  if (
    "type" in content &&
    content.type === "resource" &&
    "resource" in content &&
    content.resource &&
    typeof content.resource === "object" &&
    "text" in content.resource &&
    typeof content.resource.text === "string"
  ) {
    return content.resource.text;
  }

  return "";
}

async function listAllPrompts(client: MCPClient) {
  const prompts: Awaited<
    ReturnType<MCPClient["experimental_listPrompts"]>
  >["prompts"] = [];
  let cursor: string | undefined;

  do {
    const page = await client.experimental_listPrompts({
      params: cursor ? { cursor } : undefined,
    });
    prompts.push(...page.prompts);
    cursor = page.nextCursor;
  } while (cursor);

  return prompts;
}

async function listAllResources(client: MCPClient) {
  const resources: Awaited<
    ReturnType<MCPClient["listResources"]>
  >["resources"] = [];
  let cursor: string | undefined;

  do {
    const page = await client.listResources({
      params: cursor ? { cursor } : undefined,
    });
    resources.push(...page.resources);
    cursor = page.nextCursor;
  } while (cursor);

  return resources;
}

async function promptContext(client: MCPClient, lastUserText: string) {
  const chunks: string[] = [];

  try {
    const prompts = await listAllPrompts(client);

    for (const prompt of prompts) {
      const required = (prompt.arguments ?? []).filter(
        (argument) => argument.required,
      );

      if (required.length > 0 && !lastUserText) {
        continue;
      }

      const args =
        required.length > 0
          ? Object.fromEntries(
              required.map((argument) => [argument.name, lastUserText]),
            )
          : undefined;

      try {
        const result = await client.experimental_getPrompt({
          name: prompt.name,
          arguments: args,
        });
        const texts = [
          result.description,
          ...result.messages.map((message) => promptContentText(message.content)),
        ].filter((text): text is string => Boolean(text?.trim()));

        if (texts.length > 0) {
          chunks.push(`MCP prompt "${prompt.name}":\n${texts.join("\n")}`);
        }
      } catch {
        // Skip prompts the server will not instantiate for this request.
      }
    }
  } catch {
    // Server may not advertise prompts.
  }

  return chunks;
}

async function resourceContext(client: MCPClient) {
  const chunks: string[] = [];

  try {
    const resources = await listAllResources(client);

    for (const resource of resources) {
      try {
        const result = await client.readResource({ uri: resource.uri });
        const text = result.contents
          .map((content) => ("text" in content ? content.text : ""))
          .filter(Boolean)
          .join("\n")
          .trim();

        if (text) {
          chunks.push(`MCP resource ${resource.uri}:\n${text}`);
        }
      } catch {
        // Skip unreadable resources.
      }
    }
  } catch {
    // Server may not advertise resources.
  }

  return chunks;
}

export async function buildSystemPrompt(client: MCPClient, lastUserText: string) {
  const chunks = [THIN_SYSTEM_PROMPT];
  const instructions = client.initializeResult.instructions?.trim();

  if (instructions) {
    chunks.push(instructions);
  }

  chunks.push(...(await promptContext(client, lastUserText)));
  chunks.push(...(await resourceContext(client)));

  return chunks.join("\n\n");
}
