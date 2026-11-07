import crypto from "crypto";
import { confirmPayment } from "@/lib/paystack";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);
  if (event.event === "charge.success") {
    await confirmPayment(event.data.reference);
  }

  return new Response("OK");
}