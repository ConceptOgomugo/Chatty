'use server'

import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString().trim();
  const username = formData.get("username")?.toString().trim().toUpperCase();

  if (!email || !password || !username) {
    return { error: "All fields are required" };
  }

  const db = await getDatabase();
  const userCollection = db.collection("users");

  const existingUser = await userCollection.findOne({ email });

  if (existingUser) {
    return { error: "User Already Exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();

  await userCollection.insertOne({
    userId,
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: "chatty_session",
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString().trim();

  if (!email || !password) {
    return { error: "Email & Password are required" };
  }

  const db = await getDatabase();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return { error: "Incorrect Email" };
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return { error: "Incorrect Password" };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "chatty_session",
    value: user.userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("chatty_session");
  redirect("/login");
}