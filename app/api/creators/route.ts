import { NextResponse } from "next/server";
import { listCreators } from "@/core/domain/repository";

export function GET() {
  return NextResponse.json(listCreators());
}
