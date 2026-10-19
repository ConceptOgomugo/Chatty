import Message from "@/components/Messages";

export default function ChatPage() {
  const messages = [
    {
      id: "1",
      role: "user" as const,
      content: "Can you explain how to solve a quadratic equation?",
      timestamp: "10:24 AM",
    },
    {
      id: "2",
      role: "assistant" as const,
      content:
        "Sure! A quadratic equation is a second-degree equation in the form ax² + bx + c = 0. You can solve it using the quadratic formula:\n\nx = (-b ± √(b² - 4ac)) / 2a\n\nWould you like me to show you an example with real numbers?",
      timestamp: "10:24 AM",
    },
  ];

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Conversation header */}
      <header className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <h1 className="text-base font-semibold">New Chat</h1>
      </header>

      {/* Messages area */}
      <section className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((message) => (
          <Message
            key={message.id}
            {... message}
          />
        ))}
      </section>

      {/* Message input */}
      <div className="shrink-0 border-t border-border bg-white p-2">
        <form className="mx-auto max-w-3xl">
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
                {/* Image attachment icon will go here */}
                <span aria-hidden="true">▧</span>
              </button>

              <button
                type="button"
                aria-label="Attach a file"
                className="rounded-md p-2 text-slate-600"
              >
                {/* File attachment icon will go here */}
                <span aria-hidden="true">📎</span>
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