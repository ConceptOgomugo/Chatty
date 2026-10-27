export const instant = false;

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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

  return (
    <html 
      lang="en" 
      className={`${poppins.variable} h-full antialiased`} 
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}