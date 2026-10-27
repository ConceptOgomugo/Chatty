'use server'

import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Sign Up
export async function signUp(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString().trim();
  const username = formData.get("username")?.toString().trim().toUpperCase();

  if (!email || !password) {
    throw new Error("Email & Password Required");
  }

  const db = await getDatabase();
  const userCollection = db.collection("users");

  // Check Existing User
  const existingUser = await userCollection.findOne({ email });

  if (existingUser) {
    throw new Error("User Already Exists");
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

  // Automatically log them in by setting a cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: "chatty_session",
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect("/");
}

// Login Action
export async function login(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString().trim();

  if (!email || !password) {
    throw new Error("Email & Password are required");
  }

  const db = await getDatabase();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    throw new Error("Incorrect Email");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Incorrect Password");
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: "chatty_session",
    value: user.userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect("/");
}

// SIGN OUT ACTION
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("chatty_session");
  redirect("/login");
}
