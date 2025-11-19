
import { NextResponse } from "next/server";
export async function POST(){ return NextResponse.json({ ok:true, status:"authorized", id:"chk_mock_123" }); }
