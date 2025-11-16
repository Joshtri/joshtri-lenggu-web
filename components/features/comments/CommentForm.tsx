"use client";

import { useState } from "react";
import { Button, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Send, LogIn } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCreateComment } from "@/services/commentsService";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}

export default function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [content, setContent] = useState("");
  const { mutate: createComment, isPending } = useCreateComment();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    // Check if user is authenticated
    if (!isSignedIn || !userId) {
      onOpen();
      return;
    }

    createComment(
      {
        content: content.trim(),
        postId,
        parentId,
        authorId: userId,
      },
      {
        onSuccess: () => {
          setContent("");
          onSuccess?.();
        },
      }
    );
  };

  if (!isSignedIn) {
    return (
      <>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50 text-center">
          <LogIn className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {parentId ? "Sign in to reply to this comment" : "Sign in to leave a comment"}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              color="primary"
              onPress={() => router.push("/auth/login")}
              startContent={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
            <Button
              variant="bordered"
              onPress={() => router.push("/auth/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Login Modal as backup */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Sign In Required</ModalHeader>
                <ModalBody>
                  <p>You need to sign in to post a comment.</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="default"
                    variant="light"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      onClose();
                      router.push("/auth/login");
                    }}
                  >
                    Sign In
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Commenting as{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName || user?.username || "User"}
          </span>
          {user?.emailAddresses?.[0]?.emailAddress && (
            <>
              {" "}
              <span className="text-gray-500 dark:text-gray-400">
                ({user.emailAddresses[0].emailAddress})
              </span>
            </>
          )}
        </p>
      </div>
      <div className="relative">
        <Textarea
          placeholder={parentId ? "Write a reply..." : "Write a comment..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          minRows={3}
          maxRows={8}
          classNames={{
            input: "text-gray-900 dark:text-gray-100 pr-20",
            inputWrapper: "border-2 border-dashed border-gray-300 dark:border-gray-700",
          }}
        />
        <div className="absolute bottom-3 right-3">
          <Button
            type="submit"
            color="primary"
            size="sm"
            isLoading={isPending}
            isDisabled={!content.trim() || isPending}
            isIconOnly
            title="Send"
          >
            {!isPending && <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </form>
  );
}
