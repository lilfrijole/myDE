import { NextRequest, NextResponse } from "next/server";
import { getV0Client } from "@/lib/v0";

export async function POST(request: NextRequest) {
  try {
    const { chatId, versionId, files } = await request.json();

    if (!chatId || !versionId || !files?.length) {
      return NextResponse.json(
        { error: "chatId, versionId, and files are required" },
        { status: 400 }
      );
    }

    console.log("[v0/update-version] Pushing", files.length, "file(s) to version", versionId);

    const v0 = getV0Client();
    const result = await v0.chats.updateVersion({
      chatId,
      versionId,
      files: files.map((f: { name: string; content: string }) => ({
        name: f.name,
        content: f.content,
      })),
    });

    console.log("[v0/update-version] Updated, demoUrl:", result.demoUrl);

    return NextResponse.json({
      versionId: result.id,
      demoUrl: result.demoUrl ?? null,
      files: result.files?.map((f) => ({ name: f.name, content: f.content })) ?? [],
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[v0/update-version] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
