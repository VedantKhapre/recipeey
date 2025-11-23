"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAllChats } from "@/lib/chat-storage";

export function DeleteAllChatsButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteAll = () => {
    deleteAllChats();
    setOpen(false);
    // Redirect to dashboard after deleting all chats
    router.push("/dashboard");
    // Force a page refresh to update the sidebar
    window.location.reload();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete All Chats</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete All Chats?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete all your chat history? This action
            cannot be undone and will permanently remove all your conversations.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAll}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
