type MessageProps = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export default function Message({
  role,
  content,
  timestamp,
}: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200">
          <span className="text-sm font-semibold text-slate-700">AI</span>
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-xl p-4 ${
          isUser
            ? "bg-primary text-white"
            : "bg-slate-100 text-slate-800"
        }`}
      >
        <p className="mb-2 whitespace-pre-wrap break-words text-sm">
          {content}
        </p>

        <time className="block text-xs opacity-70">{timestamp}</time>
      </div>
    </div>
  );
}