export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const CHATS_STORAGE_KEY = "recipeey_chats";

export function getChats(): Chat[] {
  if (typeof window === "undefined") return [];

  try {
    const chats = localStorage.getItem(CHATS_STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
  } catch (error) {
    console.error("Error loading chats:", error);
    return [];
  }
}

export function saveChat(chat: Chat): void {
  if (typeof window === "undefined") return;

  try {
    const chats = getChats();
    const existingIndex = chats.findIndex((c) => c.id === chat.id);

    if (existingIndex >= 0) {
      chats[existingIndex] = { ...chat, updatedAt: new Date().toISOString() };
    } else {
      chats.unshift(chat);
    }

    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving chat:", error);
  }
}

export function deleteChat(chatId: string): void {
  if (typeof window === "undefined") return;

  try {
    const chats = getChats();
    const filteredChats = chats.filter((c) => c.id !== chatId);
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(filteredChats));
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
}

export function deleteAllChats(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CHATS_STORAGE_KEY);
  } catch (error) {
    console.error("Error deleting all chats:", error);
  }
}

export function getChatById(chatId: string): Chat | undefined {
  const chats = getChats();
  return chats.find((c) => c.id === chatId);
}
