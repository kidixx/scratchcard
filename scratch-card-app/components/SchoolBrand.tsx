"use client";

import { useState } from "react";
import { school } from "@/lib/school";

export default function SchoolBrand() {
  const [noLogo, setNoLogo] = useState(false);

  if (noLogo) {
    return (
      <div className="mb-4 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-lg font-bold text-white">
          {school.short}
        </div>
        <p className="mt-2 text-sm font-semibold text-green-700">
          {school.name}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt={`${school.name} logo`}
        className="h-auto w-64 max-w-full mix-blend-multiply"
        onError={() => setNoLogo(true)}
      />
    </div>
  );
}