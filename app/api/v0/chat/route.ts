import { NextRequest, NextResponse } from "next/server";
import { getV0Client } from "@/lib/v0";
import { buildAleoContext } from "@/lib/aleo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatId, aleoMode, privacyMode } = body;

    console.log("[v0/chat] POST received", { chatId, aleoMode, messageLength: message?.length });

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const v0 = getV0Client();
    let prompt = message;

    if (aleoMode) {
      prompt = buildAleoContext(privacyMode ?? "private") + "\n\n" + message;
    }

    if (chatId) {
      console.log("[v0/chat] Sending message to existing chat:", chatId);
      const response = await v0.chats.sendMessage({ chatId, message: prompt });
      console.log("[v0/chat] Got sendMessage response");
      return NextResponse.json(response);
    }

    console.log("[v0/chat] Creating new chat...");
    const chat = await v0.chats.create({ message: prompt }) as {
      id: string;
      latestVersion?: {
        id: string;
        demoUrl?: string;
        files: { name: string; content?: string }[];
      };
    };
    const version = chat.latestVersion;
    console.log("[v0/chat] Chat created:", chat.id, "files:", version?.files?.length ?? 0, "demo:", !!version?.demoUrl);
    return NextResponse.json({
      id: chat.id,
      versionId: version?.id,
      files: version?.files?.map((f) => ({ name: f.name, content: f.content ?? "" })) ?? [],
      demo: version?.demoUrl ?? null,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[v0/chat] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
