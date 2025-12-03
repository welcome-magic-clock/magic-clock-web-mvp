import { NextRequest, NextResponse } from "next/server";
import { findCreatorByHandle } from "@/core/domain/repository";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const creator = await findCreatorByHandle(handle);
  if (!creator) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json(creator);
}
