import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.API_URL ||
  process.env.GATEWAY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://13.211.87.137:30080";

const PROXY_TIMEOUT_MS = 180000;

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = new URL(req.url);
  const target = `${BACKEND.replace(/\/$/, "")}/${path.join("/")}${url.search}`;

  const skipHeaders = new Set([
    "host",
    "connection",
    "transfer-encoding",
    "expect",
    "keep-alive",
    "te",
    "trailer",
    "upgrade",
  ]);

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!skipHeaders.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.arrayBuffer();
    if (body.byteLength > 0) init.body = body;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { detail: isTimeout ? "Backend timeout while processing request" : "Failed to contact backend service" },
      { status: isTimeout ? 504 : 502 },
    );
  }

  clearTimeout(timeout);

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "transfer-encoding") {
      responseHeaders.set(key, value);
    }
  });

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
