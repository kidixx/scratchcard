"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { formatNaira } from "@/lib/cards";
import { getPurchases, type Purchase } from "@/lib/purchases";

export default function MyCardsPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    getPurchases().then((list) => {
      setPurchases(list);
      setLoading(false);
    });
  }, []);

  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-28 pt-10">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-900">My cards</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tap a card to view its details
        </p>

        {loading ? (
          <p className="mt-16 text-center text-slate-500">Loading...</p>
        ) : purchases.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-4xl">🎫</p>
            <p className="mt-3 text-slate-600">
              You haven't bought any card yet.
            </p>
            <Link
              href="/home"
              className="mt-4 inline-block font-semibold text-green-600"
            >
              Buy your first card
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {purchases.map((p) => {
              const open = openId === p.id;
              const fields = [
                { label: "PIN", value: p.pin },
                { label: "Serial number", value: p.serial },
              ].filter((f) => f.value);

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <button
                    onClick={() => setOpenId(open ? null : p.id)}
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {p.cardName}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(p.date).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-bold text-green-600">
                      {formatNaira(p.price)}
                    </p>
                  </button>

                  {open && (
                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                      {fields.map((f) => (
                        <div key={f.label}>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            {f.label}
                          </p>
                          <div className="mt-1 flex items-center justify-between gap-3">
                            <p className="font-mono font-semibold text-slate-900">
                              {f.value}
                            </p>
                            <button
                              onClick={() => copy(p.id + f.label, f.value)}
                              className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600"
                            >
                              {copied === p.id + f.label ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}