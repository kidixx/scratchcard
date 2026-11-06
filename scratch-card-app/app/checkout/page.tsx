"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cardTypes, formatNaira } from "@/lib/cards";
import { buyCard } from "@/lib/purchases";

const methods = [
  { id: "card", label: "Debit card", icon: "💳" },
  { id: "transfer", label: "Bank transfer", icon: "🏦" },
  { id: "ussd", label: "USSD", icon: "📱" },
];

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const card = cardTypes.find((c) => c.id === params.get("card"));
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!card) {
    return (
      <div className="text-center">
        <p className="text-slate-600">No card selected.</p>
        <Link href="/home" className="mt-3 inline-block font-semibold text-indigo-600">
          Back to home
        </Link>
      </div>
    );
  }

  async function pay() {
    if (!card) return;
    setLoading(true);
    setError("");
    try {
      // TODO: Paystack payment goes here, before buyCard
      const purchase = await buyCard(card.id);
      router.push(`/success?id=${purchase.id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong.";
      if (message.includes("Not logged in")) {
        router.push("/login");
        return;
      }
      setError(message);
      setLoading(false);
    }
  }

  return (
    <>
      <Link href="/home" className="text-sm font-medium text-indigo-600">
        ← Back
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Checkout</h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">You are buying</p>
        <h2 className="mt-1 font-semibold text-slate-900">{card.name}</h2>
        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
          <span className="text-slate-500">Total</span>
          <span className="text-lg font-bold text-indigo-600">
            {formatNaira(card.price)}
          </span>
        </div>
      </div>

      <h3 className="mb-3 mt-8 font-semibold text-slate-900">Payment method</h3>
      <div className="space-y-3">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex w-full items-center gap-3 rounded-xl border bg-white p-4 text-left ${
              method === m.id
                ? "border-indigo-600 ring-2 ring-indigo-200"
                : "border-slate-200"
            }`}
          >
            <span className="text-xl">{m.icon}</span>
            <span className="font-medium text-slate-900">{m.label}</span>
          </button>
        ))}
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <button
        onClick={pay}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Processing..." : `Pay ${formatNaira(card.price)}`}
      </button>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <Suspense fallback={null}>
          <CheckoutContent />
        </Suspense>
      </div>
    </main>
  );
}