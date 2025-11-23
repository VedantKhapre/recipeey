"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getChats, deleteChat, type Chat } from "@/lib/chat-storage";

export function ChatHistory() {
  const [chats, setChats] = useState<Chat[]>(getChats());
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const loadChats = () => {
    const loadedChats = getChats();
    setChats(loadedChats);
  };

  useEffect(() => {
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "recipeey_chats") {
        loadChats();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for changes every 2 seconds to catch same-tab updates
    const interval = setInterval(loadChats, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    loadChats();
    setChatToDelete(null);

    // If we're currently viewing the deleted chat, redirect to a new chat
    if (pathname?.includes(chatId)) {
      router.push("/dashboard");
    }
  };

  if (chats.length === 0) {
    return null;
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Chat History</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.id} className="group/item">
                <SidebarMenuButton
                  asChild
                  isActive={pathname?.includes(chat.id)}
                >
                  <a
                    href={`/dashboard/chat/${chat.id}`}
                    className="flex items-center justify-between pr-1"
                  >
                    <span className="truncate flex-1">{chat.title}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setChatToDelete(chat.id);
                      }}
                      className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-accent rounded transition-opacity"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog
        open={chatToDelete !== null}
        onOpenChange={() => setChatToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => chatToDelete && handleDeleteChat(chatToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
