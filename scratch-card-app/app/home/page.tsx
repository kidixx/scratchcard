import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { cardTypes, formatNaira } from "@/lib/cards";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-28 pt-10">
      <div className="mx-auto w-full max-w-sm">
        <p className="text-sm text-slate-500">Welcome 👋</p>
        <h1 className="text-2xl font-bold text-slate-900">Buy a card</h1>

        <div className="mt-6 rounded-2xl bg-indigo-600 p-5 text-white">
          <p className="text-sm opacity-80">Registration open</p>
          <p className="mt-1 text-lg font-semibold">
            Get your PIN instantly after payment
          </p>
        </div>

        <h2 className="mb-3 mt-8 font-semibold text-slate-900">
          Available cards
        </h2>

        <div className="space-y-4">
          {cardTypes.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {c.description}
                  </p>
                </div>
                <p className="whitespace-nowrap font-bold text-indigo-600">
                  {formatNaira(c.price)}
                </p>
              </div>
              <Link
                href={`/checkout?card=${c.id}`}
                className="mt-4 block w-full rounded-xl bg-indigo-600 py-2.5 text-center font-semibold text-white hover:bg-indigo-700"
              >
                Buy now
              </Link>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}