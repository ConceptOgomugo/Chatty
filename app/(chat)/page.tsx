import Image from "next/image";
import FunctionCard from "@/components/FunctionCard";
import { createChat } from "@/app/actions/chat";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";

const cards = [
  {
    source: "/svg/computer.svg",
    title: "Computer Basics",
    description: "Learn fundamentals and key concepts",
    alt: "Computer",
  },
  {
    source: "/svg/code.svg",
    title: "Programming",
    description: "Get help with coding and logic",
    alt: "Programming",
  },
  {
    source: "/svg/web.svg",
    title: "Web Development",
    description: "HTML, CSS, JavaScript, and more",
    alt: "Web development",
  },
  {
    source: "/svg/database.svg",
    title: "Data and Databases",
    description: "Understand databases, SQL, and more",
    alt: "Database",
  },
];

export default async function Home() {
const cookieStore = await cookies();
const userId = cookieStore.get("chatty_session")?.value;
  const session = cookieStore.get("chatty_session");

  let username = "User";

  if (userId) {
    const db = await getDatabase();
    const user = await db.collection("users").findOne({userId});
    if (user?.username) {
      username = user.username
    }
  }

  // 2. If no session exists, redirect them straight to the login page
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1">
      <main className="min-w-0 mx-auto w-full max-w-6xl">
        {/* Welcome Section */}
        <section className=" px-6 pb-5 pt-4 md:px-10 md:pt-5">
          <p className="mb-1 text-sm text-slate-500">Welcome back,</p>

          <h1 className="page-title mb-1.5">{username}</h1>

          <p className=" leading-relaxed text-slate-600 text-sm">
            Ask anything about Computer Studies.
            <br />
            I&apos;m here to help you learn and solve problems.
          </p>
        </section>

        {/* Chat Input */}
        <section className="px-6 md:px-10">
          <form
            action={createChat}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-shadow focus-within:shadow-md"
          >
            <input
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none"
              type="text"
              name="message"
              placeholder="Ask a question about Computer Studies..."
              aria-label="Your question"
            />

            <button
              className="btn btn-primary h-11 w-11 shrink-0 rounded-lg p-0"
              type="submit"
              aria-label="Send message"
            >
              <Image
                className="invert brightness-200"
                src="/svg/send.svg"
                alt=""
                width={22}
                height={22}
              />
            </button>
          </form>
        </section>

        {/* Computer Studies Topics */}
        <section className="px-6 pb-16 pt-7 md:px-10">
          <div className="mb-5">
            <h4 className=" mb-2">Topics Chatty Helps With</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => (
              <FunctionCard key={item.title} {...item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
