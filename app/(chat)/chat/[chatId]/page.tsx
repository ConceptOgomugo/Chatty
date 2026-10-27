import Message from "@/components/Messages";
import ChatInput from "@/components/ChatInput";
import { getDatabase } from "@/lib/mongodb";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const instant = false;

type ChatPageProps = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  await connection();

  const { chatId } = await params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("chatty_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const db = await getDatabase();
  const conversation = await db.collection("conversations").findOne({ chatId, userId });

  if (!conversation) {
    redirect("/");
  }

  const messages = conversation?.messages || [];

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <h1 className="text-base font-semibold">
          {conversation?.title || "Chatty"}
        </h1>
      </header>

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

      <ChatInput chatId={chatId} />
    </main>
  );
}