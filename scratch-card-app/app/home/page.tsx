import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import SchoolBrand from "@/components/SchoolBrand";
import { cardTypes, formatNaira } from "@/lib/cards";

export default function HomePage() {
  const card = cardTypes[0];

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-28 pt-8">
      <div className="mx-auto w-full max-w-sm">
        <SchoolBrand align="left" />
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Buy your card
        </h1>

        <div className="mt-6 rounded-2xl bg-green-600 p-6 text-white">
          <p className="text-sm opacity-80">{card.name}</p>
          <p className="mt-2 text-4xl font-bold">{formatNaira(card.price)}</p>
          <p className="mt-3 text-sm opacity-90">{card.description}</p>
          <p className="mt-1 text-sm opacity-90">
            Get your card details instantly after payment.
          </p>
          <Link
            href={`/checkout?card=${card.id}`}
            className="mt-6 block w-full rounded-xl bg-white py-3 text-center font-semibold text-green-700 hover:bg-green-50"
          >
            Buy now
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}