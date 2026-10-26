"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Sidebar({ recentChats }: { recentChats: any[] }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    setIsCollapsed(!mediaQuery.matches);

    const handleScreenChange = (event: MediaQueryListEvent) => {
      setIsCollapsed(!event.matches);
    };

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-slate-200 bg-white p-3 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Collapse / Expand Button */}
      <button
        type="button"
        onClick={() => setIsCollapsed((previous) => !previous)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isCollapsed}
        className="mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
          <path d="m15 9-3 3 3 3" />
        </svg>
      </button>

      {/* New Chat */}
      <Link
        href="/"
        title={isCollapsed ? "New Chat" : undefined}
        aria-label="New Chat"
        className={`flex h-11 w-full shrink-0 items-center gap-3 overflow-hidden rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-slate-700 ${
          isCollapsed ? "justify-center px-0" : "px-3"
        }`}
      >
        <span className="shrink-0 text-xl leading-none">+</span>
        {!isCollapsed && <span className="whitespace-nowrap">New Chat</span>}
      </Link>

      {/* Recent Chats */}
      {!isCollapsed && (
        <div className="mt-8 min-w-0">
          <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recent Chats
          </h2>

          <ul className="space-y-1">
            {recentChats.map((chat) => (
              <li key={chat.chatId}>
                <Link
                  href={`/chat/${chat.chatId}`}
                  title={chat.title}
                  className="block truncate rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {chat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
