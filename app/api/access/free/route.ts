import { NextResponse } from "next/server";

// MVP : route simplifiée, tout est accessible en FREE
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      access: "FREE",
    },
    { status: 200 }
  );
}
