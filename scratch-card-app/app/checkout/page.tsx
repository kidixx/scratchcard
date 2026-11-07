"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cardTypes, formatNaira } from "@/lib/cards";
import { supabase } from "@/lib/supabase";

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const card = cardTypes.find((c) => c.id === params.get("card"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!card) {
    return (
      <div className="text-center">
        <p className="text-slate-600">No card selected.</p>
        <Link href="/home" className="mt-3 inline-block font-semibold text-green-700">
          Back to home
        </Link>
      </div>
    );
  }

  async function pay() {
    if (!card) return;
    setLoading(true);
    setError("");

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardTypeId: card.id }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Could not start payment.");
      }
      window.location.href = json.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <>
      <Link href="/home" className="text-sm font-medium text-green-700">
        ← Back
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Checkout</h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">You are buying</p>
        <h2 className="mt-1 font-semibold text-slate-900">{card.name}</h2>
        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
          <span className="text-slate-500">Total</span>
          <span className="text-lg font-bold text-green-700">
            {formatNaira(card.price)}
          </span>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        You'll pay securely on Paystack with your card, bank transfer or USSD.
        Your card details are shown here right after payment.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        onClick={pay}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Redirecting to Paystack..." : `Pay ${formatNaira(card.price)}`}
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