export const instant = false;

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { connection } from "next/server"; // <-- 1. Import connection
import "./globals.css";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
      <body className="flex h-full flex-col overflow-hidden">
        <header className="w-full border-b border-border bg-slate-950">
          <nav className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="CS Chatty logo"
                  width={60}
                  height={60}
                  className="invert brightness-200"
                />
              </Link>

              <p className="font-semibold text-white text-xl">CS Chatty</p>
            </div>

            <ul className="flex items-center gap-6">
              <li>
                <Link href="/" className="hover:opacity-70 text-white">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/settings" aria-label="Settings">
                  <Image
                    src="/svg/settings.png"
                    alt="Settings"
                    width={25}
                    height={25}
                  />
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className="flex min-h-0 flex-1">
          <Sidebar recentChats={recentChats} />

          <main className="flex min-w-0 flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}