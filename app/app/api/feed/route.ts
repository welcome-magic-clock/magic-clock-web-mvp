
import { NextResponse } from "next/server";
import { FEED } from "@/features/amazing/feed";
export function GET(){ return NextResponse.json(FEED); }
