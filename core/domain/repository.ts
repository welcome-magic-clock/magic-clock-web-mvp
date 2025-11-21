import { FEED } from "@/features/amazing/feed";
import { CREATORS } from "@/features/meet/creators";
import type { Creator, FeedCard } from "./types";

export function listFeed(): FeedCard[] {
  return FEED;
}

export function listCreators(): Creator[] {
  return CREATORS;
}

export function findCreatorByHandle(handle: string): Creator | undefined {
  return CREATORS.find((c) => c.handle === handle);
}

export function listFeedByCreator(handle: string): FeedCard[] {
  return FEED.filter((item) => item.user === handle);
}
