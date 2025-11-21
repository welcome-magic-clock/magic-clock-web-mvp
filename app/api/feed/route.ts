import { NextRequest, NextResponse } from "next/server";
import { listFeed, listFeedByCreator } from "@/core/domain/repository";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("user");

  const data = handle ? listFeedByCreator(handle) : listFeed();
  return NextResponse.json(data);
}
