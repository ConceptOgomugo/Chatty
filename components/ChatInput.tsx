"use client";

import { useFormStatus } from "react-dom";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Send message"
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-50"
    >
      {pending ? (
        <span className="animate-spin text-xs">⏳</span>
      ) : (
        <span aria-hidden="true">➤</span>
      )}
    </button>
  );
}

export default function ChatInput({ chatId }: { chatId: string }) {
  return (
    <div className="shrink-0 border-t border-border bg-white p-2">
      <form action={async (formData) => {
        // Optional: clear textarea if needed, or let server action handle redirect
        const textarea = document.getElementById("message") as HTMLTextAreaElement;
        if (textarea) textarea.value = "";
        
        // Call your server action logic via form action
        const { createChat } = await import("@/app/actions/chat");
        return createChat(formData);
      }} className="mx-auto max-w-3xl">
        <input type="hidden" name="chatId" value={chatId} />

        <label htmlFor="message" className="sr-only">
          Type your message
        </label>

        <textarea
          id="message"
          name="message"
          rows={2}
          placeholder="Type your message..."
          className="input min-h-14 resize-none w-full p-2 border rounded-md"
          required
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
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

          <SubmitButton />
        </div>
      </form>
    </div>
  );
}