"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) {
      setError("Please fill in every field.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { phone: form.phone.trim() } },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    if (!data.session) {
      setError("Account created. Check your email to confirm, then log in.");
      return;
    }
    router.push("/home");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign up to buy your course registration card
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className={inputClass}
            placeholder="Email address"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <input
            type="tel"
            className={inputClass}
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className={`${inputClass} pr-16`}
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-green-600">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}