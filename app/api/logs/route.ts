import { NextRequest, NextResponse } from "next/server";
import { logStore } from "@/server/logStore";


export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId");

  if (!runId || !logStore[runId]) {
    return NextResponse.json({ logs: [], status: "idle" });
  }

  return NextResponse.json(logStore[runId]);
}