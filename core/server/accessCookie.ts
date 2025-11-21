import { cookies } from "next/headers";
import type { ViewerAccessContext } from "@/core/domain/access";

const ACCESS_COOKIE_NAME = "mc_access_v1";

type CookiePayload = {
  subs: string[];
  unlocked: string[];
};

async function readAccessCookie(): Promise<CookiePayload> {
  const store = await cookies();
  const raw = store.get(ACCESS_COOKIE_NAME)?.value;
  if (!raw) return { subs: [], unlocked: [] };
  try {
    const parsed = JSON.parse(raw);
    return {
      subs: Array.isArray(parsed.subs) ? parsed.subs : [],
      unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [],
    };
  } catch {
    return { subs: [], unlocked: [] };
  }
}

async function writeAccessCookie(payload: CookiePayload): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE_NAME, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  });
}

/**
 * Construit un ViewerAccessContext à partir du cookie.
 */
export async function getViewerAccessContextFromCookie(): Promise<ViewerAccessContext> {
  const { subs, unlocked } = await readAccessCookie();
  return {
    isAuthenticated: true,
    subscriptions: subs,
    unlockedPpvContentIds: unlocked,
  };
}

/**
 * Ajoute un abonnement (Abo) au cookie.
 */
export async function addSubscription(handle: string): Promise<ViewerAccessContext> {
  const payload = await readAccessCookie();
  if (!payload.subs.includes(handle)) {
    payload.subs.push(handle);
  }
  await writeAccessCookie(payload);
  return {
    isAuthenticated: true,
    subscriptions: payload.subs,
    unlockedPpvContentIds: payload.unlocked,
  };
}

/**
 * Ajoute un contenu PPV débloqué au cookie.
 */
export async function addUnlockedPpv(
  contentId: string | number
): Promise<ViewerAccessContext> {
  const payload = await readAccessCookie();
  const id = String(contentId);
  if (!payload.unlocked.includes(id)) {
    payload.unlocked.push(id);
  }
  await writeAccessCookie(payload);
  return {
    isAuthenticated: true,
    subscriptions: payload.subs,
    unlockedPpvContentIds: payload.unlocked,
  };
}
