import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/paystack";

export async function GET(req: Request) {
  const reference = new URL(req.url).searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  const result = await confirmPayment(reference);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
  return NextResponse.json({ purchaseId: result.purchaseId });
}