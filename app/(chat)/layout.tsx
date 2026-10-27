export const instant = false;

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { connection } from "next/server"; // <-- 1. Import connection
import "@/app/globals.css";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getDatabase } from "@/lib/mongodb";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Computer Studies Chatbot",
    template: "%s | Computer Studies Chatbot",
  },
  description:
    "Explore computer studies, understand technical concepts, and get answers to your computer studies questions.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection(); // <-- 2. Opts the layout into dynamic request-time rendering

  const db = await getDatabase();
  const rawChats = await db
    .collection("conversations")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  // Convert MongoDB ObjectId to plain string for the Client Component
  const recentChats = rawChats.map((chat) => ({
    ...chat,
    _id: chat._id.toString(),
  }));

  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <header>
        <nav className="flex h-16 items-center justify-between border-b border-slate-800 bg-gray-900 px-6 text-white shadow-md">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="Chatty Logo"
                width={34}
                height={34}
                className="invert brightness-200 transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-bold tracking-wide">Chatty</span>
            </Link>
          </div>

          {/* Navigation Links & Settings */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Settings"
            >
              <Image
                src="/svg/settings.png"
                alt="Settings"
                width={20}
                height={20}
                className="opacity-80 hover:opacity-100 invert"
              />
            </Link>
          </div>
        </nav>
      </header>

      <body className="flex h-full flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1">
          <Sidebar recentChats={recentChats} />

          {children}
        </div>
      </body>
    </html>
  );
}
