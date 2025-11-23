"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai/conversion";
import { Loader } from "@/components/ai/loader";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai/prompt-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MODELS, DEFAULT_MODEL } from "@/lib/models";
import { MicIcon, PaperclipIcon, RotateCcwIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { type FormEventHandler, useCallback, useState } from "react";
import { useUser } from "@clerk/nextjs";

type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

interface ChatInterfaceProps {
  className?: string;
  showHeader?: boolean;
}

export function ChatInterface({
  className,
  showHeader = true,
}: ChatInterfaceProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nanoid(),
      content:
        "Hello! I'm your AI assistant powered by Google Gemini. I can help you with coding questions, explain concepts, and provide guidance on web development topics. What would you like to know?",
      role: "assistant",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      if (!inputValue.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: nanoid(),
        content: inputValue.trim(),
        role: "user",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      const assistantMessageId = nanoid();
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        content: "",
        role: "assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            model: selectedModel,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: accumulatedContent }
                : msg,
            ),
          );
        }
      } catch (error) {
        console.error("Error in chat:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: "Sorry, I encountered an error. Please try again.",
                }
              : msg,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, messages, selectedModel],
  );

  const handleReset = useCallback(() => {
    setMessages([
      {
        id: nanoid(),
        content:
          "Hello! I'm your AI assistant powered by Google Gemini. I can help you with coding questions, explain concepts, and provide guidance on web development topics. What would you like to know?",
        role: "assistant",
      },
    ]);
    setInputValue("");
    setIsLoading(false);
  }, []);

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-lg",
        className,
      )}
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="font-medium text-sm">AI Assistant</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-muted-foreground text-xs">
              {MODELS.find((m) => m.id === selectedModel)?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2"
          >
            <RotateCcwIcon className="size-4" />
            <span className="ml-1">Reset</span>
          </Button>
        </div>
      )}

      {/* Conversation Area */}
      <Conversation className="flex-1">
        <ConversationContent className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <Message from={message.role}>
                <MessageContent>
                  {isLoading &&
                  message.role === "assistant" &&
                  message.content === "" ? (
                    <div className="flex items-center gap-2">
                      <Loader size={14} />
                      <span className="text-muted-foreground text-sm">
                        Thinking...
                      </span>
                    </div>
                  ) : (
                    message.content
                  )}
                </MessageContent>
                <MessageAvatar
                  src={
                    message.role === "user"
                      ? user?.imageUrl || "https://github.com/shadcn.png"
                      : "https://github.com/vercel.png"
                  }
                  name={
                    message.role === "user" ? user?.fullName || "User" : "AI"
                  }
                />
              </Message>
            </div>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input Area */}
      <div className="border-t p-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about development, coding, or technology..."
            disabled={isLoading}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton disabled={isLoading}>
                <PaperclipIcon size={16} />
              </PromptInputButton>
              <PromptInputButton disabled={isLoading}>
                <MicIcon size={16} />
                <span>Voice</span>
              </PromptInputButton>
              <PromptInputModelSelect
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={isLoading}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {MODELS.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={!inputValue.trim() || isLoading}
              status={isLoading ? "streaming" : "ready"}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
