
import { NextResponse } from "next/server";
import { CREATORS } from "@/features/meet/creators";
export function GET(){ return NextResponse.json(CREATORS); }
