"use server";

import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";

export async function createChat(formData: FormData) {
  const messageContent = formData.get("message")?.toString().trim();

  const chatId = crypto.randomUUID();
  const now = new Date();
  
  const timestamp = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const db = await getDatabase();
    
    const messages = messageContent ? [
      {
        id: crypto.randomUUID(),
        role: "user" as const,
        content: messageContent,
        timestamp,
      }
    ] : [];

    // Save to MongoDB
    await db.collection("conversations").insertOne({
      chatId,
      title: messageContent 
        ? (messageContent.slice(0, 30) + (messageContent.length > 30 ? "..." : "")) 
        : "New Chat",
      createdAt: now,
      messages,
    });
  } catch (error) {
    console.error("Failed to create chat:", error);
    throw new Error("Could not create chat");
  }

  redirect(`/chat/${chatId}`);
}