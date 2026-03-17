import { NextRequest, NextResponse } from "next/server";
import { getV0Client } from "@/lib/v0";

export async function GET() {
  try {
    const v0 = getV0Client();
    const projects = await v0.projects.find();
    return NextResponse.json(projects);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const v0 = getV0Client();
    const project = await v0.projects.create({ name, description });
    return NextResponse.json(project);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
