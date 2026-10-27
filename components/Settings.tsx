"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/app/actions/avatar";
import { useRouter } from "next/navigation";

export default function Settings({ initialUser }: { initialUser?: any }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUser?.avatarUrl || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keep state synced if initialUser reloads from server
  useEffect(() => {
    if (initialUser?.avatarUrl) {
      setAvatarUrl(initialUser.avatarUrl);
    }
  }, [initialUser]);

  const username = initialUser?.username || "JD";
  const initials = username.slice(0, 2).toUpperCase();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkrf22hel";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setAvatarUrl(data.secure_url);
        
        // Call the Avatar server action
        const dbResult = await Avatar(data.secure_url);
        
        if (dbResult && !dbResult.success) {
          alert(`Image uploaded to Cloudinary, but failed to save in database: ${dbResult.error}`);
          return;
        }

        router.refresh();
      } else {
        alert(`Cloudinary upload failed: ${data.error?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload network error:", error);
      alert("Failed to process image upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 lg:px-20">
      <div className="max-w-xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Profile</h2>
          <p className="text-sm text-slate-500">Manage your account information.</p>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-lg font-semibold text-white shadow-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Change Photo"}
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Username
            </label>
            <input
              type="text"
              readOnly
              defaultValue={initialUser?.username || ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              readOnly
              defaultValue={initialUser?.email || ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm outline-none"
            />
          </div>
        </form>
      </div>
    </main>
  );
}