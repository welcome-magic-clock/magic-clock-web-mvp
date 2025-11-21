import { NextResponse } from "next/server";
import { listCreators } from "@/core/domain/repository";

export async function GET() {
  const creators = await listCreators();
  return NextResponse.json(creators);
}
