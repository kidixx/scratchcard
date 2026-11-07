import { supabaseAdmin } from "./supabaseAdmin";

export async function confirmPayment(
  reference: string
): Promise<
  { ok: true; purchaseId: string } | { ok: false; message: string }
> {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
    }
  );
  const result = await res.json();

  if (!result.status || result.data?.status !== "success") {
    return { ok: false, message: "Payment was not completed." };
  }

  const { data: purchase } = await supabaseAdmin
    .from("purchases")
    .select("id, amount")
    .eq("reference", reference)
    .single();

  if (!purchase) {
    return { ok: false, message: "Purchase not found." };
  }
  if (result.data.amount !== purchase.amount * 100) {
    return { ok: false, message: "Amount paid does not match the price." };
  }

  const { data, error } = await supabaseAdmin.rpc("fulfill_purchase", {
    p_reference: reference,
  });

  if (error) {
    return {
      ok: false,
      message: error.message.includes("Out of stock")
        ? `Payment received but cards are out of stock. Contact support with reference ${reference}.`
        : error.message,
    };
  }

  return { ok: true, purchaseId: data as string };
}