"use client";

import { useRouter } from "next/navigation";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { saveChat } from "@/lib/chat-storage";

export function NewChatButton() {
  const router = useRouter();

  const handleNewChat = () => {
    const newChatId = nanoid();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveChat(newChat);
    router.push(`/dashboard/chat/${newChatId}`);
  };

  return (
    <Button
      onClick={handleNewChat}
      className="w-full justify-start gap-2 h-10"
      variant="ghost"
    >
      <PenSquare className="h-4 w-4" />
      <span>New Chat</span>
    </Button>
  );
}
