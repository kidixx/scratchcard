import { supabase } from "./supabase";

export type Purchase = {
  id: string;
  cardName: string;
  price: number;
  pin: string;
  serial: string;
  date: string;
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