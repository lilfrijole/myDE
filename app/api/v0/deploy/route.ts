import { NextRequest, NextResponse } from "next/server";
import { getV0Client } from "@/lib/v0";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, chatId, versionId } = body;

    if (!projectId || !chatId || !versionId) {
      return NextResponse.json(
        { error: "projectId, chatId, and versionId are required" },
        { status: 400 }
      );
    }

    const v0 = getV0Client();
    const deployment = await v0.deployments.create({
      projectId,
      chatId,
      versionId,
    });
    return NextResponse.json(deployment);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deploymentId = searchParams.get("deploymentId");

    if (!deploymentId) {
      return NextResponse.json(
        { error: "deploymentId query param is required" },
        { status: 400 }
      );
    }

    const v0 = getV0Client();
    const deployment = await v0.deployments.getById({ deploymentId });
    return NextResponse.json(deployment);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
