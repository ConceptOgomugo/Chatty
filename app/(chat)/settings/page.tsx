"use client";

import Image from "next/image";

export default function Settings() {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 lg:px-20">
      <div className="max-w-xl">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Profile</h2>
          <p className="text-sm text-slate-500">Manage your account information.</p>
        </div>

        {/* Profile Image Section */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white shadow-sm">
            JD
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            {/* Simple lock/photo icon */}
            <svg
              className="h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Change Photo
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-shadow focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-shadow focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Divider Line */}
          <hr className="my-6 border-slate-100" />

          {/* Change Password Section */}
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Change Password</h3>
              <p className="text-sm text-slate-500">Keep your account secure.</p>
            </div>
            
            <div>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}