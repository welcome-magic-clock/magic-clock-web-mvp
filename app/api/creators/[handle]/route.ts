import { NextRequest, NextResponse } from "next/server";
import { findCreatorByHandle } from "@/core/domain/repository";

export function GET(
  _req: NextRequest,
  { params }: { params: { handle: string } }
) {
  const creator = findCreatorByHandle(params.handle);
  if (!creator) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json(creator);
}
