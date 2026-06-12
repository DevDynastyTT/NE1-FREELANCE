import { NextRequest, NextResponse } from "next/server";
import { setOnline } from "@/lib/events";

export async function POST(request: NextRequest) {
  try {
    const { userID } = await request.json();

    if (!userID) {
      return NextResponse.json({ error: "userID required" }, { status: 400 });
    }

    setOnline(userID);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("[online] Error:", e instanceof Error ? e.message : "Unknown error");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
