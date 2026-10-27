import Message from "@/components/Messages";
import ChatInput from "@/components/ChatInput"; // <-- Import the new component
import { getDatabase } from "@/lib/mongodb";
import { connection } from "next/server";

export const instant = false;

type ChatPageProps = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  await connection(); // Opts dynamic route into request-time rendering

  const { chatId } = await params;

  // Fetch the conversation and its messages from MongoDB
  const db = await getDatabase();
  const conversation = await db.collection("conversations").findOne({ chatId });

  // Extract messages from the database record, or default to an empty array
  const messages = conversation?.messages || [];

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Conversation header */}
      <header className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <h1 className="text-base font-semibold">
          {conversation?.title || "Chatty"}
        </h1>
      </header>

      {/* Messages area */}
      <section className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((msg: any) => (
          <Message
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
      </section>

      {/* Render the client-side chat input with built-in spam protection */}
      <ChatInput chatId={chatId} />
    </main>
  );
}