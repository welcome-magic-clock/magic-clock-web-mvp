/**
 * lib/stripe.ts
 * v1.1 — Singleton Stripe compatible SDK v20
 */

import Stripe from "stripe";

const globalForStripe = globalThis as unknown as {
  _stripe: Stripe | undefined;
};

export const stripe =
  globalForStripe._stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForStripe._stripe = stripe;
}
