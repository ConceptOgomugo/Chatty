export const instant = false;
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { connection } from "next/server";
import { cookies } from "next/headers";
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
  await connection();

  const cookieStore = await cookies();
  const userId = cookieStore.get("chatty_session")?.value;

  const db = await getDatabase();
  const rawChats = userId
    ? await db
        .collection("conversations")
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray()
    : [];

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
        <header>
          <nav className="flex h-16 items-center justify-between border-b border-slate-800 bg-gray-900 px-4 md:px-6 text-white shadow-md">
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

            <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/settings"
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

        <div className="flex min-h-0 flex-1 relative overflow-hidden">
          <Sidebar recentChats={recentChats} />
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}