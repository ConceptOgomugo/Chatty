import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="w-full border-b border-border bg-slate-950">
          <nav className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="CS Chatty logo"
                  width="60"
                  height="60"
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
        {children}
      </body>
    </html>
  );
}
