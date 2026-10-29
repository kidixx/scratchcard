"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Accounting",
  "Mass Communication",
  "Other",
];
const levels = ["100", "200", "300", "400", "500"];

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    matric: "",
    department: "",
    level: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) {
      setError("Please fill in every field.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    // TODO: replace with real signup call
    router.push("/home");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in your student details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className={inputClass}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Matric number"
            value={form.matric}
            onChange={(e) => update("matric", e.target.value)}
          />

          <select
            className={inputClass}
            value={form.department}
            onChange={(e) => update("department", e.target.value)}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select
            className={inputClass}
            value={form.level}
            onChange={(e) => update("level", e.target.value)}
          >
            <option value="">Select level</option>
            {levels.map((l) => (
              <option key={l} value={l}>
                {l} Level
              </option>
            ))}
          </select>

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
          <input
            type="password"
            className={inputClass}
            placeholder="Password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white active:scale-[0.98] hover:bg-indigo-700"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}