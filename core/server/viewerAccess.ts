import { prisma } from "@/core/prisma";
import type { ViewerAccessContext } from "@/core/domain/access";
import { PaymentStatus, SubscriptionStatus } from "@prisma/client";

function isSubscriptionCurrentlyActive(subscription: {
  status: SubscriptionStatus;
  endsAt: Date | null;
  cancelledAt: Date | null;
}): boolean {
  if (subscription.status !== SubscriptionStatus.ACTIVE) {
    return false;
  }

  const now = new Date();

  // Si une date de fin existe et qu'elle est passée, l'abonnement n'est plus actif.
  if (subscription.endsAt && subscription.endsAt <= now) {
    return false;
  }

  // cancelledAt ne coupe pas forcément l'accès immédiatement si endsAt est dans le futur.
  return true;
}

export async function getViewerAccessContext(
  userId: string
): Promise<ViewerAccessContext> {
  const [subscriptions, ppvPurchases] = await Promise.all([
    prisma.subscription.findMany({
      where: {
        userId,
      },
      select: {
        creator: {
          select: {
            handle: true,
          },
        },
        status: true,
        endsAt: true,
        cancelledAt: true,
        payments: {
          select: {
            status: true,
          },
        },
      },
    }),

    prisma.ppvPurchase.findMany({
      where: {
        userId,
      },
      select: {
        contentId: true,
        payment: {
          select: {
            status: true,
          },
        },
      },
    }),
  ]);

  const activeSubscriptions = subscriptions
    .filter((sub) => {
      if (!isSubscriptionCurrentlyActive(sub)) {
        return false;
      }

      // On exige au moins un paiement réussi et aucun paiement remboursé.
      const hasSucceededPayment = sub.payments.some(
        (payment) => payment.status === PaymentStatus.SUCCEEDED
      );

      const hasRefundedPayment = sub.payments.some(
        (payment) => payment.status === PaymentStatus.REFUNDED
      );

      return hasSucceededPayment && !hasRefundedPayment;
    })
    .map((sub) => sub.creator.handle);

  const unlockedPpvContentIds = ppvPurchases
    .filter((purchase) => {
      // Achat PPV valide si paiement présent et réussi
      if (!purchase.payment) {
        return false;
      }

      return purchase.payment.status === PaymentStatus.SUCCEEDED;
    })
    .map((purchase) => purchase.contentId);

  return {
    isAuthenticated: true,
    subscriptions: activeSubscriptions,
    unlockedPpvContentIds,
  };
}
