"use client";

import { useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Sparkles, X, AlertCircle, RotateCcw } from "lucide-react";
import { Text } from "@/components/ui/Text";

interface AISummaryButtonProps {
  title: string;
  excerpt: string;
  content: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export default function AISummaryButton({
  title,
  excerpt,
  content,
}: AISummaryButtonProps) {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showBubble, setShowBubble] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<string>(
    "Ask AI what this article talks about"
  );
  const [retryCount, setRetryCount] = useState(0);

  const handleAIRequest = async (retryAttempt = 0) => {
    setIsLoading(true);
    setError("");
    setSummary("");
    setRetryCount(retryAttempt);

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          title,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.data.summary);
        setShowBubble(true);
        setTooltipContent("AI has answered");
        setRetryCount(0);
      } else {
        // Check if it's an overload error and we can retry
        if (
          data.error?.includes("overloaded") &&
          retryAttempt < MAX_RETRIES
        ) {
          setError(
            `AI service is busy. Retrying (${retryAttempt + 1}/${MAX_RETRIES})...`
          );
          setTimeout(() => {
            handleAIRequest(retryAttempt + 1);
          }, RETRY_DELAY);
        } else {
          setError(data.message || "Failed to get AI summary");
          setRetryCount(0);
        }
      }
    } catch (err) {
      console.error("AI request error:", err);

      if (retryAttempt < MAX_RETRIES) {
        setError(
          `Connection error. Retrying (${retryAttempt + 1}/${MAX_RETRIES})...`
        );
        setTimeout(() => {
          handleAIRequest(retryAttempt + 1);
        }, RETRY_DELAY);
      } else {
        setError("Failed to connect to AI service. Please try again later.");
        setRetryCount(0);
      }
    } finally {
      if (retryAttempt === 0 || retryAttempt === MAX_RETRIES) {
        setIsLoading(false);
      }
    }
  };

  const handleCloseBubble = () => {
    setShowBubble(false);
    setSummary("");
    setError("");
    setTooltipContent("Ask AI what this article talks about");
  };

  return (
    <div className="relative">
      {/* AI Summary Button with Tooltip */}
      <Tooltip
        content={tooltipContent}
        color="secondary"
        showArrow={true}
        className="text-sm"
      >
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950 transition-colors"
          onPress={() => handleAIRequest()}
          isLoading={isLoading}
          isDisabled={isLoading || showBubble}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </Tooltip>

      {/* Chat Bubble */}
      {showBubble && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">AI Summary</h3>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-white hover:bg-purple-700"
                onPress={handleCloseBubble}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {error ? (
                <div className={`rounded-lg p-4 border flex gap-3 ${
                  error.includes("Retrying")
                    ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                    : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                }`}>
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    error.includes("Retrying")
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`} />
                  <div className="flex-1">
                    <Text className={`text-sm ${
                      error.includes("Retrying")
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {error}
                    </Text>
                  </div>
                </div>
              ) : summary ? (
                <>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {title}
                    </h4>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Here&apos;s what this article is about:
                    </Text>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {summary}
                    </Text>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <Text className="text-xs text-gray-500 dark:text-gray-400 italic">
                      💡 This summary was generated by AI and may not capture all
                      nuances of the article.
                    </Text>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Loading AI summary...
                  </Text>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 flex justify-end gap-2">
              {error && !error.includes("Retrying") && (
                <Button
                  size="sm"
                  variant="flat"
                  color="warning"
                  onPress={() => handleAIRequest(0)}
                  isLoading={isLoading}
                  startContent={!isLoading && <RotateCcw className="h-4 w-4" />}
                >
                  {isLoading ? "Retrying..." : "Try Again"}
                </Button>
              )}
              <Button
                size="sm"
                variant="flat"
                onPress={handleCloseBubble}
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
