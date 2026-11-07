"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    async function verify() {
      const reference = params.get("reference") || params.get("trxref");
      if (!reference) {
        setError("Missing payment reference.");
        return;
      }
      const res = await fetch(
        `/api/paystack/verify?reference=${encodeURIComponent(reference)}`
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "We could not confirm your payment.");
        return;
      }
      router.replace(`/success?id=${json.purchaseId}`);
    }
    verify();
  }, [params, router]);

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600">{error}</p>
        <Link
          href="/my-cards"
          className="mt-4 inline-block font-semibold text-green-700"
        >
          Check My Cards
        </Link>
      </div>
    );
  }

  return (
    <p className="text-center text-slate-500">Confirming your payment...</p>
  );
}

export default function CallbackPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <Suspense fallback={null}>
          <CallbackContent />
        </Suspense>
      </div>
    </main>
  );
}