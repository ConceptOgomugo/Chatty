import Message from "@/components/Messages";
import Image from "next/image";
import { getDatabase } from "@/lib/mongodb";
import { createChat } from "@/app/actions/chat"; // 1. Import your server action

type ChatPageProps = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
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
          Chatty
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

      {/* Message input */}
      <div className="shrink-0 border-t border-border bg-white p-2">
        <form action={createChat} className="mx-auto max-w-3xl">
          <input type="hidden" name="chatId" value={chatId} />

          <label htmlFor="message" className="sr-only">
            Type your message
          </label>

          <textarea
            id="message"
            name="message"
            rows={2}
            placeholder="Type your message..."
            className="input min-h-14 resize-none"
          />

          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Attach an image"
                className="rounded-md p-2 text-slate-600"
              >
                <Image src="/svg/image.svg" alt="File" width={17} height={17}/>
              </button>

              <button
                type="button"
                aria-label="Attach a file"
                className="rounded-md p-2 text-slate-600"
              >
                <Image src="/svg/file.svg" alt="File" width={17} height={17}/>
              </button>
            </div>

            <button
              type="submit"
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white"
            >
              <span aria-hidden="true">➤</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}