"use server";

import { getDatabase } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function Avatar(avatarUrl: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("chatty_session")?.value;

    if (!userId) {
      console.error("Update Avatar Error: No session cookie found");
      return { success: false, error: "Unauthorized" };
    }

    const db = await getDatabase();
    const result = await db.collection("users").updateOne(
      { userId },
      { $set: { avatarUrl } }
    );

    if (result.matchedCount === 0) {
      console.error("Update Avatar Error: User not found in database for ID:", userId);
      return { success: false, error: "User not found" };
    }

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Database update failed inside updateAvatar:", error);
    return { success: false, error: "Database error" };
  }
}