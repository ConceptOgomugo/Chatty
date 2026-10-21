"use server";

import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";

export async function createChat(formData: FormData) {
  const messageContent = formData.get("message")?.toString().trim();

  if (!messageContent) {
    return; // Don't submit empty messages
  }

  const chatId = crypto.randomUUID();
  const now = new Date();
  
  // Format the timestamp nicely to match your existing UI pattern
  const timestamp = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const db = await getDatabase();
    
    // Save the conversation and its initial message
    await db.collection("conversations").insertOne({
      chatId,
      title: messageContent.slice(0, 30) + (messageContent.length > 30 ? "..." : ""),
      createdAt: now,
      messages: [
        {
          id: crypto.randomUUID(),
          role: "user",
          content: messageContent,
          timestamp,
        },
      ],
    });
  } catch (error) {
    console.error("Failed to save conversation:", error);
    throw new Error("Could not create chat");
  }

  // Redirect to the dynamic chat route
  redirect(`/chat/${chatId}`);
}