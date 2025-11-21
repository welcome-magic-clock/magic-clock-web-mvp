import { FEED } from "@/features/amazing/feed";
import { CREATORS } from "@/features/meet/creators";
import type { Creator, FeedCard } from "./types";
import { prisma } from "@/core/db/client";

function mapCreatorFromDb(row: any): Creator {
  const langs =
    typeof row.langs === "string"
      ? row.langs.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

  return {
    id: row.id,
    handle: row.handle,
    name: row.displayName,
    city: row.city ?? "",
    langs,
    followers: row.followersCount ?? 0,
    avatar: row.avatar ?? "/images/sample1.jpg",
    access: ["FREE", "ABO", "PPV"],
  };
}

export function listFeed(): FeedCard[] {
  return FEED;
}

export function listFeedByCreator(handle: string): FeedCard[] {
  return FEED.filter((item) => item.user === handle);
}

export async function listCreators(): Promise<Creator[]> {
  try {
    const rows = await prisma.creatorProfile.findMany();
    if (!rows.length) {
      return CREATORS;
    }
    return rows.map(mapCreatorFromDb);
  } catch (err) {
    console.error("[listCreators] falling back to static CREATORS", err);
    return CREATORS;
  }
}

export async function findCreatorByHandle(handle: string): Promise<Creator | undefined> {
  try {
    const row = await prisma.creatorProfile.findUnique({
      where: { handle },
    });
    if (!row) {
      // fallback on static
      return CREATORS.find((c) => c.handle === handle);
    }
    return mapCreatorFromDb(row);
  } catch (err) {
    console.error("[findCreatorByHandle] falling back to static CREATORS", err);
    return CREATORS.find((c) => c.handle === handle);
  }
}
