"use client";

import { useEffect, useRef, useState } from "react";
import { school } from "@/lib/school";

export default function SchoolBrand({
  align = "center",
}: {
  align?: "left" | "center";
}) {
  const [noLogo, setNoLogo] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setNoLogo(true);
    }
  }, []);

  const position = align === "left" ? "items-start" : "items-center";
  const justify = align === "left" ? "justify-start" : "justify-center";

  if (noLogo) {
    return (
      <div className={`mb-4 flex flex-col ${position}`}>
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
    <div className={`mb-4 flex ${justify}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/logo.png"
        alt={`${school.name} logo`}
        className="h-auto w-64 max-w-full mix-blend-multiply"
        onError={() => setNoLogo(true)}
      />
    </div>
  );
}