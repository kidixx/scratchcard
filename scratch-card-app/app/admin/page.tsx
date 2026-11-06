"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cardTypes } from "@/lib/cards";

const CARD_TYPE = cardTypes[0].id;

type Stock = { out_available: number; out_sold: number };
type AddResult = { out_added: number; out_skipped: number };

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [stock, setStock] = useState<Stock>({ out_available: 0, out_sold: 0 });
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStock = useCallback(async () => {
    const { data } = await supabase.rpc("admin_stock", {
      p_card_type: CARD_TYPE,
    });
    const row = (data as Stock[] | null)?.[0];
    if (row) setStock(row);
  }, []);

  useEffect(() => {
    async function check() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/login");
        return;
      }
      const { data: admin } = await supabase.rpc("is_admin");
      if (!admin) {
        router.replace("/home");
        return;
      }
      await loadStock();
      setReady(true);
    }
    check();
  }, [router, loadStock]);

  async function upload() {
    if (!text.trim()) {
      setError("Paste your card numbers first.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");

    const { data, error } = await supabase.rpc("admin_add_cards", {
      p_card_type: CARD_TYPE,
      p_lines: text,
    });

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    const r = (data as AddResult[])[0];
    setMessage(
      `Added ${r.out_added} card(s). Skipped ${r.out_skipped} duplicate(s).`
    );
    setText("");
    loadStock();
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 pt-10">
        <p className="text-center text-slate-500">Loading...</p>
      </main>
    );
  }

  const lines = text.split("\n").filter((l) => l.trim()).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <Link href="/home" className="text-sm font-medium text-indigo-600">
          ← Back to app
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Manage card stock</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Available
            </p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {stock.out_available}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Sold
            </p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">
              {stock.out_sold}
            </p>
          </div>
        </div>

        <h2 className="mb-2 mt-8 font-semibold text-slate-900">
          Upload cards
        </h2>
        <p className="mb-3 text-sm text-slate-500">
          One card per line. Either just the serial number, or the serial
          number and PIN separated by a comma or space.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder={"SN0001\nSN0002\nSN0003,481920"}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <p className="mt-1 text-xs text-slate-400">{lines} line(s) pasted</p>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-3 text-sm text-green-600">{message}</p>}

        <button
          onClick={upload}
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {busy ? "Uploading..." : "Upload cards"}
        </button>
      </div>
    </main>
  );
}