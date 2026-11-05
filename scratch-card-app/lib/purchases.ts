import type { CardType } from "./cards";

export type Purchase = {
  id: string;
  cardName: string;
  price: number;
  pin: string;
  serial: string;
  date: string;
};

const KEY = "purchases";

const digits = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

// TODO: replace with real PIN from the backend
export function createPurchase(card: CardType): Purchase {
  return {
    id: crypto.randomUUID(),
    cardName: card.name,
    price: card.price,
    pin: `${digits(4)}-${digits(4)}-${digits(4)}-${digits(4)}`,
    serial: `SN${digits(10)}`,
    date: new Date().toISOString(),
  };
}

export function getPurchases(): Purchase[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function savePurchase(p: Purchase) {
  localStorage.setItem(KEY, JSON.stringify([p, ...getPurchases()]));
}