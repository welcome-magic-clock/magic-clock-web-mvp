import type { ViewerAccessContext } from "@/core/domain/access";
import { getViewerAccessContext } from "@/core/server/viewerAccess";
import { getCurrentUser } from "@/core/server/auth";

export async function getCurrentViewerAccessContext(): Promise<ViewerAccessContext> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      isAuthenticated: false,
      subscriptions: [],
      unlockedPpvContentIds: [],
    };
  }

  return getViewerAccessContext(user.id);
}
