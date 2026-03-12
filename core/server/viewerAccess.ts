// core/server/viewerAccess.ts
// ✅ v2 — Migration Prisma → Supabase (stack Magic Clock)
import { supabaseAdmin } from "@/core/supabase/admin";
import type { ViewerAccessContext } from "@/core/domain/access";

export async function getViewerAccessContext(
  userId: string
): Promise<ViewerAccessContext> {
  const [subscriptionsResult, ppvPurchasesResult] = await Promise.all([
    supabaseAdmin
      .from("subscriptions")
      .select(`
        status,
        ends_at,
        cancelled_at,
        creator:profiles!subscriptions_creator_id_fkey(handle),
        payments(status)
      `)
      .eq("user_id", userId),
    supabaseAdmin
      .from("ppv_purchases")
      .select(`
        content_id,
        payment:payment_logs(status)
      `)
      .eq("user_id", userId),
  ]);

  const subscriptions = subscriptionsResult.data ?? [];
  const ppvPurchases = ppvPurchasesResult.data ?? [];

  // ── Abonnements actifs ────────────────────────────────────
  const now = new Date();

  const activeSubscriptions = subscriptions
    .filter((sub) => {
      if (sub.status !== "ACTIVE") return false;
      if (sub.ends_at && new Date(sub.ends_at) <= now) return false;

      const payments = Array.isArray(sub.payments) ? sub.payments : [];
      const hasSucceededPayment = payments.some((p: any) => p.status === "SUCCEEDED");
      const hasRefundedPayment = payments.some((p: any) => p.status === "REFUNDED");
      return hasSucceededPayment && !hasRefundedPayment;
    })
    .map((sub) => {
      const creator = Array.isArray(sub.creator) ? sub.creator[0] : sub.creator;
      return (creator as any)?.handle ?? "";
    })
    .filter(Boolean);

  // ── Achats PPV valides ────────────────────────────────────
  const unlockedPpvContentIds = ppvPurchases
    .filter((purchase) => {
      const payment = Array.isArray(purchase.payment)
        ? purchase.payment[0]
        : purchase.payment;
      return (payment as any)?.status === "SUCCEEDED";
    })
    .map((purchase) => String(purchase.content_id));

  return {
    isAuthenticated: true,
    subscriptions: activeSubscriptions,
    unlockedPpvContentIds,
  };
}
