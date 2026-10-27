"use server";

import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

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

  const targetChatId = existingChatId || crypto.randomUUID();
  const isNewChat = !existingChatId;

  // 1. FETCH AI REPLY SYNCHRONOUSLY USING GROQ (Model untouched)
  let aiResponseText = "I couldn't generate a response.";
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing in environment variables.");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "You are CS Chatty, a helpful and direct Computer Studies tutor for students.",
            },
            {
              role: "user",
              content: messageContent,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${data.error?.message || response.statusText}`
      );
    }

    aiResponseText =
      data.choices?.[0]?.message?.content ||
      "I couldn't generate a response.";
  } catch (error: any) {
    console.error("Groq Generation Error:", error);
    aiResponseText = `Error: ${error.message || "Failed to generate AI response."}`;
  }

  const aiMsgObj = {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    content: aiResponseText,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // 2. SAVE BOTH MESSAGES TO MONGODB AT ONCE
  if (isNewChat) {
    const title =
      messageContent.length > 30
        ? messageContent.slice(0, 30) + "..."
        : messageContent;

    await db.collection("conversations").insertOne({
      chatId: targetChatId,
      title,
      createdAt: now,
      messages: [userMsgObj, aiMsgObj],
    });

    revalidatePath("/", "layout");
  } else {
    const existingChat = await db
      .collection("conversations")
      .findOne({ chatId: existingChatId });

    const updatePayload: any = {
      $push: { messages: { $each: [userMsgObj, aiMsgObj] } },
    };

    if (existingChat && existingChat.title === "New Chat") {
      updatePayload.$set = {
        title:
          messageContent.length > 30
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

  // 3. REDIRECT TO THE CHAT PAGE WITH THE REPLY ALREADY THERE
  if (isNewChat) {
    redirect(`/chat/${targetChatId}`);
  }
}