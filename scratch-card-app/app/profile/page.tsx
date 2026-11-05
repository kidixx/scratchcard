"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

type Profile = {
  full_name: string;
  matric: string;
  department: string | null;
  level: string | null;
  phone: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.replace("/login");
        return;
      }
      setEmail(user.email ?? "");

      const { data: row } = await supabase
        .from("profiles")
        .select("full_name, matric, department, level, phone")
        .eq("id", user.id)
        .single();

      setProfile(row);
      setLoading(false);
    }
    load();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 pt-10">
        <p className="text-center text-slate-500">Loading...</p>
        <BottomNav />
      </main>
    );
  }

  const rows = [
    { label: "Matric number", value: profile?.matric },
    { label: "Department", value: profile?.department },
    { label: "Level", value: profile?.level ? `${profile.level} Level` : "" },
    { label: "Email", value: email },
    { label: "Phone", value: profile?.phone },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-28 pt-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
            {profile?.full_name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <h1 className="mt-3 text-xl font-bold text-slate-900">
            {profile?.full_name ?? "Student"}
          </h1>
        </div>

        <div className="mt-8 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4 p-4">
              <span className="text-sm text-slate-500">{r.label}</span>
              <span className="text-right text-sm font-medium text-slate-900">
                {r.value || "-"}
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