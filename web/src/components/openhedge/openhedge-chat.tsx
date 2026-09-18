"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  getToolName,
  isDynamicToolUIPart,
  isToolUIPart,
  type ChatStatus,
  type UIMessage,
} from "ai";
import { useEffect, useMemo, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { SquarePenIcon, TriangleAlertIcon } from "lucide-react";
import { hedgeExamples } from "@/lib/openhedge/examples";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  parseChatErrorMessage,
} from "@/lib/openhedge/errors";

async function chatFetch(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(
      parseChatErrorMessage(
        payload,
        ERROR_MESSAGES[ERROR_CODES.openrouterModel],
      ),
    );
  }

  return response;
}

function previewText(value: unknown) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function toolPreview(part: Parameters<typeof isToolUIPart>[0]) {
  if (!isToolUIPart(part)) {
    return "Tool call";
  }

  if (part.errorText) {
    return part.errorText;
  }

  const output = previewText(part.output);
  if (output) {
    return output;
  }

  const input = previewText(part.input);
  if (input) {
    return input;
  }

  if (part.state === "input-streaming" || part.state === "input-available") {
    return "Running…";
  }

  return "Click to show full input and result";
}

function busyLabel(status: ChatStatus, messages: UIMessage[]) {
  if (status === "submitted") {
    return "Starting the Openhedge agent…";
  }

  const last = messages.at(-1);
  const toolsStarted =
    last?.role === "assistant" &&
    last.parts.some(
      (part) => part.type === "dynamic-tool" || part.type.startsWith("tool-"),
    );

  if (toolsStarted) {
    return "Calling Openhedge tools…";
  }

  return "Waiting for the model…";
}

function ToolCallPart({
  part,
}: {
  part: Parameters<typeof isToolUIPart>[0];
}) {
  if (!isToolUIPart(part)) {
    return null;
  }

  const preview = toolPreview(part);

  return (
    <Tool defaultOpen={false} className="mb-0">
      {isDynamicToolUIPart(part) ? (
        <ToolHeader
          type="dynamic-tool"
          state={part.state}
          toolName={part.toolName}
        />
      ) : (
        <ToolHeader type={part.type} state={part.state} />
      )}
      <p className="line-clamp-2 px-4 pb-4 font-mono text-sm leading-relaxed text-muted-foreground group-data-open:hidden">
        {preview}
      </p>
      <ToolContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Full {getToolName(part)} call
        </p>
        <ToolInput input={part.input} />
        <ToolOutput output={part.output} errorText={part.errorText} />
      </ToolContent>
    </Tool>
  );
}

const PRESENT_HEDGE_TOOL = "present_hedge";

function lastToolPart(messages: UIMessage[]) {
  for (let messageIndex = messages.length - 1; messageIndex >= 0; messageIndex -= 1) {
    const message = messages[messageIndex];
    if (!message) {
      continue;
    }

    for (let partIndex = message.parts.length - 1; partIndex >= 0; partIndex -= 1) {
      const part = message.parts[partIndex];
      if (isToolUIPart(part)) {
        return part;
      }
    }
  }

  return undefined;
}

function presentHedgeCompleted(messages: UIMessage[]) {
  const part = lastToolPart(messages);
  if (!part) {
    return false;
  }

  return (
    getToolName(part) === PRESENT_HEDGE_TOOL &&
    part.state === "output-available" &&
    !part.errorText
  );
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

const PLACEHOLDER_INTERVAL_MS = 4000;
const FOLLOW_UP_PLACEHOLDER = "Ask a follow-up…";

export function OpenhedgeChat() {
  const [input, setInput] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/openhedge/chat",
        fetch: chatFetch,
      }),
    [],
  );
  const { messages, sendMessage, status, error, stop, setMessages, clearError } =
    useChat({
      transport,
    });
  const busy = status === "submitted" || status === "streaming";
  const canReset = busy || messages.length > 0 || Boolean(error);
  const isEmptyChat = messages.length === 0 && !error;
  const showIncompleteFlowWarning =
    !busy &&
    messages.some((message) => message.role === "assistant") &&
    !presentHedgeCompleted(messages);

  useEffect(() => {
    if (!busy) {
      setElapsedMs(0);
      return;
    }

    const startedAt = Date.now();
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 250);

    return () => window.clearInterval(id);
  }, [busy]);

  useEffect(() => {
    if (!isEmptyChat || input.trim() || busy) {
      return;
    }

    const id = window.setInterval(() => {
      setPlaceholderIndex((index) => (index + 1) % hedgeExamples.length);
    }, PLACEHOLDER_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [busy, input, isEmptyChat]);

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || busy) {
      return;
    }
    sendMessage({ text });
    setInput("");
  };

  const handleNewChat = () => {
    stop();
    setMessages([]);
    clearError();
    setInput("");
    setPlaceholderIndex(0);
  };

  const handleExample = (prompt: string) => {
    if (busy) {
      return;
    }
    sendMessage({ text: prompt });
    setInput("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Conversation className="min-h-0">
        <ConversationContent className="gap-4">
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Find a relevant hedge"
              description="Describe a small-business risk, or pick an example. Tool calls from the Openhedge MCP server show up in the thread."
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent className="w-full gap-6">
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <MessageResponse key={`${message.id}-text-${index}`}>
                          {part.text}
                        </MessageResponse>
                      );
                    }

                    if (isToolUIPart(part)) {
                      return (
                        <ToolCallPart
                          key={`${message.id}-tool-${index}`}
                          part={part}
                        />
                      );
                    }

                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {error ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          ) : null}
          {showIncompleteFlowWarning ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-sm"
            >
              <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p>
                Sorry — this flow might not have completed successfully. The
                last tool call should be{" "}
                <span className="font-mono">{PRESENT_HEDGE_TOOL}</span> and
                finish without errors. Please try again.
              </p>
            </div>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {busy ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 border-t bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
        >
          <Spinner className="size-4 shrink-0" />
          <span className="min-w-0 flex-1">{busyLabel(status, messages)}</span>
          <span className="shrink-0 font-mono text-xs tabular-nums">
            {formatElapsed(elapsedMs)}
          </span>
        </div>
      ) : null}
      <div className="grid gap-3 border-t p-3">
        {isEmptyChat ? (
          <div className="grid gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              Try an example
            </p>
            <Suggestions className="max-w-full">
              {hedgeExamples.map((example) => (
                <Suggestion
                  key={example.title}
                  suggestion={example.prompt}
                  onClick={handleExample}
                  disabled={busy}
                >
                  {example.title}
                </Suggestion>
              ))}
            </Suggestions>
          </div>
        ) : null}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            placeholder={
              isEmptyChat
                ? hedgeExamples[placeholderIndex].prompt
                : FOLLOW_UP_PLACEHOLDER
            }
            aria-label={
              isEmptyChat
                ? "Describe a business risk to hedge"
                : "Ask a follow-up"
            }
            disabled={busy}
          />
          <PromptInputFooter className="justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              disabled={!canReset}
            >
              <SquarePenIcon />
              New chat
            </Button>
            <PromptInputSubmit
              status={status}
              disabled={busy ? false : !input.trim()}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
