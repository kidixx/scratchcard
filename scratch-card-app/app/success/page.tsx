"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPurchases, type Purchase } from "@/lib/purchases";
import { formatNaira } from "@/lib/cards";

function SuccessContent() {
  const params = useSearchParams();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setPurchase(getPurchases().find((p) => p.id === params.get("id")) ?? null);
  }, [params]);

  function copy(label: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  }

  if (!purchase) {
    return <p className="text-center text-slate-500">Loading...</p>;
  }

  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✅
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Payment successful</h1>
        <p className="mt-1 text-sm text-slate-500">
          {purchase.cardName} · {formatNaira(purchase.price)}
        </p>
      </div>

      <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        {[
          { label: "PIN", value: purchase.pin },
          { label: "Serial number", value: purchase.serial },
        ].map((f) => (
          <div key={f.label}>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {f.label}
            </p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="font-mono text-lg font-semibold text-slate-900">
                {f.value}
              </p>
              <button
                onClick={() => copy(f.label, f.value)}
                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600"
              >
                {copied === f.label ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/my-cards"
        className="mt-6 block w-full rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white hover:bg-indigo-700"
      >
        View my cards
      </Link>
      <Link
        href="/home"
        className="mt-3 block text-center text-sm font-medium text-indigo-600"
      >
        Back to home
      </Link>
    </>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <Suspense fallback={null}>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}