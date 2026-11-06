import { supabase } from "./supabase";

export type Purchase = {
  id: string;
  cardName: string;
  price: number;
  pin: string;
  serial: string;
  date: string;
};

type BuyRow = {
  out_purchase_id: string;
  out_pin: string | null;
  out_serial: string;
  out_amount: number;
  out_card_name: string;
  out_date: string;
};

type PurchaseRow = {
  id: string;
  amount: number;
  created_at: string;
  cards: {
    pin: string | null;
    serial: string;
    card_types: { name: string } | null;
  } | null;
};

export async function buyCard(cardTypeId: string): Promise<Purchase> {
  const { data, error } = await supabase.rpc("buy_card", {
    p_card_type: cardTypeId,
  });
  if (error) {
    if (error.message.includes("Out of stock")) {
      throw new Error("Cards are out of stock right now. Please try again later.");
    }
    throw new Error(error.message);
  }
  const r = (data as BuyRow[])[0];
  return {
    id: r.out_purchase_id,
    cardName: r.out_card_name,
    price: r.out_amount,
    pin: r.out_pin ?? "",
    serial: r.out_serial,
    date: r.out_date,
  };
}

export async function getPurchases(): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from("purchases")
    .select("id, amount, created_at, cards(pin, serial, card_types(name))")
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as PurchaseRow[]).map((p) => ({
    id: p.id,
    cardName: p.cards?.card_types?.name ?? "Card",
    price: p.amount,
    pin: p.cards?.pin ?? "",
    serial: p.cards?.serial ?? "",
    date: p.created_at,
  }));
}