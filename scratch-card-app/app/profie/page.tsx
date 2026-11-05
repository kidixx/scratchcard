"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

// TODO: replace with the logged-in student's real details from the backend
const student = {
  name: "Student Name",
  matric: "20/1234",
  department: "Computer Science",
  level: "300 Level",
  email: "student@email.com",
  phone: "08012345678",
};

export default function ProfilePage() {
  const router = useRouter();

  const rows = [
    { label: "Matric number", value: student.matric },
    { label: "Department", value: student.department },
    { label: "Level", value: student.level },
    { label: "Email", value: student.email },
    { label: "Phone", value: student.phone },
  ];

  function logout() {
    // TODO: clear the real session once auth exists
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-28 pt-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
            {student.name.charAt(0)}
          </div>
          <h1 className="mt-3 text-xl font-bold text-slate-900">
            {student.name}
          </h1>
        </div>

        <div className="mt-8 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4 p-4">
              <span className="text-sm text-slate-500">{r.label}</span>
              <span className="text-right text-sm font-medium text-slate-900">
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full rounded-xl border border-red-200 bg-white py-3 font-semibold text-red-600 hover:bg-red-50"
        >
          Log out
        </button>
      </div>

      <BottomNav />
    </main>
  );
}