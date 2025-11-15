"use client";

import { useChat } from "@ai-sdk/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  Textarea,
} from "@heroui/react";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIFeaturesTesting() {
  // State for conversational text generation
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [errorSuggestion, setErrorSuggestion] = useState("");

  // Chat using AI SDK's useChat hook
  const { messages, error } = useChat({
    // api: "/api/ai/chat",
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // Handle conversational text generation
  const handleGenerate = async () => {
    if (!generatePrompt.trim()) return;

    // Add user message to conversation
    const userMessage: Message = {
      role: "user",
      content: generatePrompt,
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, userMessage]);
    setGeneratePrompt("");
    setIsGenerating(true);
    setGenerateError("");
    setErrorSuggestion("");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: generatePrompt }),
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response to conversation
        const aiMessage: Message = {
          role: "assistant",
          content: data.data.text,
          timestamp: new Date(),
        };
        setConversation(prev => [...prev, aiMessage]);
      } else {
        setGenerateError(data.message || "Failed to generate text");
        setErrorSuggestion(data.suggestion || "");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setGenerateError("An error occurred while generating text");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setGeneratePrompt("");
    setGenerateError("");
    setErrorSuggestion("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          AI Features Testing
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test AI-powered text generation and chat features using Google Gemini
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Generation Section */}
        <Card className="h-fit">
          <CardHeader className="flex gap-3 items-center justify-between">
            <div className="flex gap-3 items-center">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">AI Conversation</p>
                <p className="text-sm text-gray-500">
                  Chat with AI - your conversation history is saved
                </p>
              </div>
            </div>
            {conversation.length > 0 && (
              <Button
                color="danger"
                variant="flat"
                size="sm"
                onPress={clearConversation}
                isDisabled={isGenerating}
                startContent={<Trash2 className="w-4 h-4" />}
              >
                Clear All
              </Button>
            )}
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            {/* Conversation History */}
            <div className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <Sparkles className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Start a conversation with AI!</p>
                  <p className="text-xs mt-1">Your chat history will be saved here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </p>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">
                        <Spinner size="sm" />
                        <p className="text-xs text-gray-500 mt-2">AI is thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {generateError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg space-y-2">
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold">
                  {generateError}
                </p>
                {errorSuggestion && (
                  <p className="text-red-500 dark:text-red-300 text-xs">
                    {errorSuggestion}
                  </p>
                )}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              className="flex gap-2"
            >
              <Textarea
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                placeholder="Type your message to AI..."
                minRows={2}
                maxRows={4}
                disabled={isGenerating}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
              <Button
                type="submit"
                color="primary"
                isLoading={isGenerating}
                isDisabled={!generatePrompt.trim() || isGenerating}
                startContent={!isGenerating && <Send className="w-4 h-4" />}
              >
                Send
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-10">
        <CardBody>
          <h3 className="text-lg font-semibold mb-3">About These Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Text Generation
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>
                  Uses{" "}
                  <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">
                    generateText
                  </code>{" "}
                  from AI SDK
                </li>
                <li>Single request/response pattern</li>
                <li>Best for one-time text generation</li>
                <li>
                  API:{" "}
                  <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">
                    /api/ai/generate
                  </code>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                AI Chat (Streaming)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>
                  Uses{" "}
                  <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">
                    streamText
                  </code>{" "}
                  from AI SDK
                </li>
                <li>Real-time streaming responses</li>
                <li>Maintains conversation context</li>
                <li>
                  API:{" "}
                  <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">
                    /api/ai/chat
                  </code>
                </li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
