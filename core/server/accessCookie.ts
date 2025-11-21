import { cookies } from "next/headers";
import type { ViewerAccessContext } from "@/core/domain/access";

const ACCESS_COOKIE_NAME = "mc_access_v1";

type CookiePayload = {
  subs: string[];
  unlocked: string[];
};

function readAccessCookie(): CookiePayload {
  const store = cookies();
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

function writeAccessCookie(payload: CookiePayload) {
  const store = cookies();
  store.set(ACCESS_COOKIE_NAME, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  });
}

/**
 * Construit un ViewerAccessContext à partir du cookie.
 * Pour l'instant, on considère que si l'utilisateur manipule des accès,
 * il est "authentifié" (auth réelle viendra plus tard).
 */
export function getViewerAccessContextFromCookie(): ViewerAccessContext {
  const { subs, unlocked } = readAccessCookie();
  return {
    isAuthenticated: true,
    subscriptions: subs,
    unlockedPpvContentIds: unlocked,
  };
}

/**
 * Met à jour les subscriptions (ABO) et enregistre en cookie.
 */
export function addSubscription(handle: string): ViewerAccessContext {
  const payload = readAccessCookie();
  if (!payload.subs.includes(handle)) {
    payload.subs.push(handle);
  }
  writeAccessCookie(payload);
  return {
    isAuthenticated: true,
    subscriptions: payload.subs,
    unlockedPpvContentIds: payload.unlocked,
  };
}

/**
 * Met à jour les contenus PPV débloqués et enregistre en cookie.
 */
export function addUnlockedPpv(contentId: string | number): ViewerAccessContext {
  const payload = readAccessCookie();
  const id = String(contentId);
  if (!payload.unlocked.includes(id)) {
    payload.unlocked.push(id);
  }
  writeAccessCookie(payload);
  return {
    isAuthenticated: true,
    subscriptions: payload.subs,
    unlockedPpvContentIds: payload.unlocked,
  };
}
