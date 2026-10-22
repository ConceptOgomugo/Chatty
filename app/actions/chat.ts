"use server";

import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function createChat(formData: FormData) {
  const messageContent = formData.get("message")?.toString().trim();
  const existingChatId = formData.get("chatId")?.toString();

  const db = await getDatabase();
  const now = new Date();
  
  const timestamp = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  let targetChatId = existingChatId;

  try {
    if (existingChatId) {
      if (messageContent) {
        // Fetch the existing chat to check its title
        const existingChat = await db.collection("conversations").findOne({ chatId: existingChatId });

        const updatePayload: any = {
          $push: {
            messages: {
              id: crypto.randomUUID(),
              role: "user" as const,
              content: messageContent,
              timestamp,
            },
          },
        };

        // If the title is still "New Chat", update it with this first message!
        if (existingChat && existingChat.title === "New Chat") {
          updatePayload.$set = {
            title: messageContent.length > 30 
              ? messageContent.slice(0, 30) + "..." 
              : messageContent,
          };
        }

        // Push the message (and update title if needed)
        await db.collection("conversations").updateOne(
          { chatId: existingChatId },
          updatePayload
        );

        revalidatePath(`/chat/${existingChatId}`);
      }
    } else {
      // Scenario: Creating a brand new chat from home
      const newChatId = crypto.randomUUID();
      targetChatId = newChatId;
      
      const messages = messageContent ? [
        {
          id: crypto.randomUUID(),
          role: "user" as const,
          content: messageContent,
          timestamp,
        }
      ] : [];

      const title = messageContent 
        ? (messageContent.length > 30 ? messageContent.slice(0, 30) + "..." : messageContent) 
        : "New Chat";

      await db.collection("conversations").insertOne({
        chatId: newChatId,
        title,
        createdAt: now,
        messages,
      });
    }
  } catch (error) {
    console.error("Failed to process chat action:", error);
    throw new Error("Could not process chat action");
  }

  if (!existingChatId && targetChatId) {
    redirect(`/chat/${targetChatId}`);
  }
}