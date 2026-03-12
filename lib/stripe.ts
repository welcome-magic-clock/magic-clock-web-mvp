/**
 * lib/stripe.ts
 *
 * Singleton Stripe — côté serveur uniquement.
 * Utiliser sk_test_... en dev/staging, sk_live_... après passage SA.
 *
 * Variables d'environnement requises (Vercel + .env.local) :
 *   STRIPE_SECRET_KEY          → sk_test_... ou sk_live_...
 *   STRIPE_WEBHOOK_SECRET      → whsec_...
 *   NEXT_PUBLIC_STRIPE_PK      → pk_test_... ou pk_live_...
 */

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("[Stripe] STRIPE_SECRET_KEY manquante dans les variables d'environnement");
}

// Singleton — évite d'instancier Stripe à chaque import en dev (HMR)
const globalForStripe = globalThis as unknown as { _stripe?: Stripe };

export const stripe =
  globalForStripe._stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForStripe._stripe = stripe;
}
