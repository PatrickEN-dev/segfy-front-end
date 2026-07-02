import { NextResponse } from "next/server";

const DEFAULT_TIMEOUT_MS = 60_000;

export const dynamic = "force-dynamic";

export async function GET() {
  const base = (process.env.SEGFY_API_URL ?? "http://localhost:5000").replace(
    /\/$/,
    "",
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${base}/health`, {
      cache: "no-store",
      signal: controller.signal,
    });
    const text = await res.text();
    const body = text ? JSON.parse(text) : { status: "Unknown" };
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json(
      { status: "Unreachable", target: base },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
