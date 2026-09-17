export const ERROR_CODES = {
  rateLimited: "rate_limited",
  openrouterQuota: "openrouter_quota",
  openrouterModel: "openrouter_model",
  mcpUnavailable: "mcp_unavailable",
  timeout: "timeout",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES = {
  [ERROR_CODES.rateLimited]:
    "This demo is rate-limited so it does not burn through Márk's OpenRouter credits. Come back a bit later.",
  [ERROR_CODES.openrouterQuota]:
    "Sorry — Márk's OpenRouter API key is maxed. This demo costs money to run. Come back a bit later.",
  [ERROR_CODES.openrouterModel]:
    "Sorry — either the OpenRouter model failed or Márk's OpenRouter API key is maxed. This costs money to run. Come back a bit later.",
  [ERROR_CODES.mcpUnavailable]:
    "The Openhedge MCP server is unavailable right now. Try again in a bit.",
  [ERROR_CODES.timeout]:
    "A step took too long, so this demo stopped. Try again in a bit.",
} as const;

export type ChatErrorBody = {
  error: ErrorCode;
  message: string;
};

export function chatErrorResponse(
  error: ErrorCode,
  status: number,
): Response {
  const body: ChatErrorBody = {
    error,
    message: ERROR_MESSAGES[error],
  };
  return Response.json(body, { status });
}

export function parseChatErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message;
  }
  return fallback;
}
