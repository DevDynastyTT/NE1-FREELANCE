import { NextRequest, NextResponse } from "next/server";
import { publish } from "@/lib/events";

export async function POST(request: NextRequest) {
  try {
    const { senderID, receiverID } = await request.json();

    if (!senderID || !receiverID) {
      return NextResponse.json({ error: "senderID and receiverID required" }, { status: 400 });
    }

    publish(receiverID, "typing", { senderID, receiverID, isTyping: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("[typing] Error:", e instanceof Error ? e.message : "Unknown error");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
