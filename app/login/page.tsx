import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl shadow-md">
            💬
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back to Chatty
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please enter your details to sign in
          </p>
        </div>

        {/* Login Form */}
        <form action={login} className="mt-8 space-y-5">
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1"
              >
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                name="email" 
                required
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:text-white" 
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <input 
                id="password"
                type="password" 
                name="password" 
                required
                placeholder="••••••••" 
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link to Sign Up */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link 
            href="/signup" 
            className="font-medium text-slate-500 hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </main>
  );
}