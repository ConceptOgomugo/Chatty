import { cookies } from "next/headers";
import { getDatabase } from "@/lib/mongodb";
import { connection } from "next/server";
import Settings from "@/components/Settings"; // Or keep your component function name

export default async function SettingsPage() {
  await connection();

  const cookieStore = await cookies();
  const userId = cookieStore.get("chatty_session")?.value;

  let initialUser = null;

  if (userId) {
    const db = await getDatabase();
    initialUser = await db.collection("users").findOne({ userId });
  }

  // Pass MongoDB user data down to your client component
  return <Settings initialUser={initialUser} />;
}