import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: userData } = await supabaseAdmin.auth.getUser(token);
  const user = userData.user;
  if (!user || !user.email) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { cardTypeId } = await req.json();

  // Price always comes from the database, never from the browser
  const { data: card } = await supabaseAdmin
    .from("card_types")
    .select("id, price, active")
    .eq("id", cardTypeId)
    .single();

  if (!card || !card.active) {
    return NextResponse.json({ error: "Card not found." }, { status: 400 });
  }

  const { count } = await supabaseAdmin
    .from("cards")
    .select("id", { count: "exact", head: true })
    .eq("card_type_id", card.id)
    .eq("status", "available");

  if (!count) {
    return NextResponse.json(
      { error: "Cards are out of stock right now. Please try again later." },
      { status: 409 }
    );
  }

  const reference = `SC-${crypto.randomUUID()}`;

  const { error: insertError } = await supabaseAdmin.from("purchases").insert({
    user_id: user.id,
    card_type_id: card.id,
    amount: card.price,
    reference,
    status: "pending",
  });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const origin = new URL(req.url).origin;
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: card.price * 100,
      reference,
      callback_url: `${origin}/payment/callback`,
    }),
  });
  const result = await res.json();

  if (!result.status) {
    return NextResponse.json(
      { error: result.message || "Could not start payment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: result.data.authorization_url });
}