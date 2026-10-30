"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Sidebar({ recentChats }: { recentChats: any[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsCollapsed(!mediaQuery.matches);

    const handleScreenChange = (event: MediaQueryListEvent) => {
      setIsCollapsed(!event.matches);
    };

    mediaQuery.addEventListener("change", handleScreenChange);
    return () => mediaQuery.removeEventListener("change", handleScreenChange);
  }, []);

  return (
    <>
      {/* Mobile Hamburger Trigger Button (Visible only on mobile) */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open Menu"
        className="md:hidden fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:opacity-90 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`z-50 flex h-full shrink-0 flex-col border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-3 transition-transform duration-300 fixed md:relative inset-y-0 left-0 ${
          mobileOpen ? "translate-x-0 w-72 shadow-2xl" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed && !mobileOpen ? "md:w-16" : "md:w-64"}`}
      >
        {/* Top Controls: Collapse (Desktop) & Close (Mobile) */}
        <div className="flex items-center justify-between mb-5">
          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label="Toggle sidebar"
            className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="m15 9-3 3 3 3" />
            </svg>
          </button>

          {/* Mobile Close (X) Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close Menu"
            className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ml-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          title={isCollapsed && !mobileOpen ? "New Chat" : undefined}
          aria-label="New Chat"
          className={`flex h-11 w-full shrink-0 items-center gap-3 overflow-hidden rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:opacity-90 ${
            isCollapsed && !mobileOpen ? "justify-center px-0" : "px-3"
          }`}
        >
          <span className="shrink-0 text-xl leading-none">+</span>
          {(!isCollapsed || mobileOpen) && <span className="whitespace-nowrap">New Chat</span>}
        </Link>

        {/* Recent Chats */}
        {(!isCollapsed || mobileOpen) && (
          <div className="mt-8 min-w-0 overflow-y-auto flex-1">
            <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recent Chats
            </h2>

            <ul className="space-y-1">
              {recentChats.map((chat) => (
                <li key={chat.chatId}>
                  <Link
                    href={`/chat/${chat.chatId}`}
                    onClick={() => setMobileOpen(false)}
                    title={chat.title}
                    className="block truncate rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {chat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </>
  );
}