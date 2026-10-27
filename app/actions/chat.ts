"use server";

import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createChat(formData: FormData) {
  const messageContent = formData.get("message")?.toString().trim();
  const existingChatId = formData.get("chatId")?.toString();

  if (!messageContent) return;

  const cookieStore = await cookies();
  const userId = cookieStore.get("chatty_session")?.value;

  if (!userId) {
    redirect("/login");
  }

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

  const targetChatId = existingChatId || crypto.randomUUID();
  const isNewChat = !existingChatId;

  if (isNewChat) {
    const title =
      messageContent.length > 30
        ? messageContent.slice(0, 30) + "..."
        : messageContent;

    await db.collection("conversations").insertOne({
      chatId: targetChatId,
      userId,
      title,
      createdAt: now,
      messages: [userMsgObj, aiMsgObj],
    });

    revalidatePath("/", "layout");
  } else {
    const existingChat = await db
      .collection("conversations")
      .findOne({ chatId: existingChatId, userId });

    if (!existingChat) return;

    const updatePayload: any = {
      $push: { messages: { $each: [userMsgObj, aiMsgObj] } },
    };

    if (existingChat.title === "New Chat") {
      updatePayload.$set = {
        title:
          messageContent.length > 30
            ? messageContent.slice(0, 30) + "..."
            : messageContent,
      };
    }

    await db.collection("conversations").updateOne(
      { chatId: existingChatId, userId },
      updatePayload
    );

    revalidatePath(`/chat/${existingChatId}`);
  }

  if (isNewChat) {
    redirect(`/chat/${targetChatId}`);
  }
}