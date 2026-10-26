"use server";

import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";
import { after } from "next/server";

// Helper function to force a timeout if Gemini hangs
async function fetchWithTimeout(promise: Promise<any>, ms: number) {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("AI request timed out")), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

export async function createChat(formData: FormData) {
  const messageContent = formData.get("message")?.toString().trim();
  const existingChatId = formData.get("chatId")?.toString();

  if (!messageContent) return;

  const db = await getDatabase();
  const now = new Date();
  
  const timestamp = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const userMsgObj = {
    id: crypto.randomUUID(),
    role: "user" as const,
    content: messageContent,
    timestamp,
  };

  const placeholderAiId = crypto.randomUUID();
  const placeholderAiMsg = {
    id: placeholderAiId,
    role: "assistant" as const,
    content: "Thinking...",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  const targetChatId = existingChatId || crypto.randomUUID();
  const isNewChat = !existingChatId;

  // 1. SAVE USER MESSAGE + "THINKING..." PLACEHOLDER INSTANTLY
  if (isNewChat) {
    const title = messageContent.length > 30 
      ? messageContent.slice(0, 30) + "..." 
      : messageContent;

    await db.collection("conversations").insertOne({
      chatId: targetChatId,
      title,
      createdAt: now,
      messages: [userMsgObj, placeholderAiMsg],
    });
  } else {
    const existingChat = await db.collection("conversations").findOne({ chatId: existingChatId });
    const updatePayload: any = {
      $push: { messages: { $each: [userMsgObj, placeholderAiMsg] } },
    };

    if (existingChat && existingChat.title === "New Chat") {
      updatePayload.$set = {
        title: messageContent.length > 30 
          ? messageContent.slice(0, 30) + "..." 
          : messageContent,
      };
    }

    await db.collection("conversations").updateOne(
      { chatId: existingChatId },
      updatePayload
    );

    revalidatePath(`/chat/${existingChatId}`);
  }

  // 2. RUN GEMINI IN BACKGROUND WITH A 12-SECOND TIMEOUT PROTECTION
  const activeChatId = targetChatId;
  after(async () => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("API key is missing.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Wrap the AI call in a 12-second timeout so it never hangs forever
      const aiResponse = await fetchWithTimeout(
        ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: messageContent,
        }),
        120000 // 12 seconds max
      );

      const aiResponseText = (aiResponse as any)?.text || "I couldn't generate a response.";

      const bgDb = await getDatabase();
      await bgDb.collection("conversations").updateOne(
        { chatId: activeChatId, "messages.id": placeholderAiId },
        { $set: { "messages.$.content": aiResponseText } } as any
      );

      revalidatePath(`/chat/${activeChatId}`);
    } catch (error: any) {
      console.error("Background AI Generation Error or Timeout:", error);
      
      const errorMsg = error.message === "AI request timed out"
        ? "The AI server took too long to respond (timeout). Google's free-tier servers might be overloaded right now. Please try sending your message again."
        : "The AI service is currently busy or experiencing high demand. Please try again in a moment.";

      const bgDb = await getDatabase();
      await bgDb.collection("conversations").updateOne(
        { chatId: activeChatId, "messages.id": placeholderAiId },
        { $set: { "messages.$.content": errorMsg } } as any
      );

      revalidatePath(`/chat/${activeChatId}`);
    }
  });

  // 3. REDIRECT IMMEDIATELY TO THE CHAT PAGE
  if (isNewChat) {
    redirect(`/chat/${targetChatId}`);
  }
}