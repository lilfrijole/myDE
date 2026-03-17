import { NextRequest } from "next/server";
import { getV0Client } from "@/lib/v0";
import { buildAleoContext } from "@/lib/aleo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatId, aleoMode, privacyMode } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const v0 = getV0Client();
    let prompt = message;

    if (aleoMode) {
      prompt = buildAleoContext(privacyMode ?? "private") + "\n\n" + prompt;
    }

    const response = await v0.chats.create({
      message: prompt,
      responseMode: "experimental_stream" as never,
    });

    if (response instanceof ReadableStream) {
      return new Response(response, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
