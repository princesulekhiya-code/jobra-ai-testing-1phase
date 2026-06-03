import { NextRequest, NextResponse } from "next/server";

const GATEWAY = process.env.GATEWAY_URL || "http://localhost:8080";
const PROXY_TIMEOUT_MS = 15000;

function rewriteSetCookiePath(header: string): string {
  return header.replace(/;\s*Path=\/api\/auth/i, "; Path=/gw/api/auth");
}

async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const gwPath = url.pathname.replace(/^\/gw/, "");
  const target = `${GATEWAY}${gwPath}${url.search}`;

  const skipHeaders = new Set([
    "host", "connection", "transfer-encoding", "expect",
    "keep-alive", "te", "trailer", "upgrade",
  ]);
  const headers = new Headers();
  req.headers.forEach((v, k) => {
    if (!skipHeaders.has(k.toLowerCase())) {
      headers.set(k, v);
    }
  });

  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.text();
    if (body) init.body = body;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  let gwRes: Response;
  try {
    gwRes = await fetch(target, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);

    const isTimeout = error instanceof Error && (error.name === "AbortError" || error.message.includes("Headers Timeout"));
    const message = isTimeout
      ? "Gateway timeout while contacting upstream service"
      : "Failed to contact upstream service";

    return NextResponse.json(
      { error: message },
      { status: isTimeout ? 504 : 502 },
    );
  }

  clearTimeout(timeout);

  const resHeaders = new Headers();
  gwRes.headers.forEach((v, k) => {
    const lower = k.toLowerCase();
    if (lower === "transfer-encoding") return;
    if (lower === "set-cookie") {
      resHeaders.append("set-cookie", rewriteSetCookiePath(v));
    } else {
      resHeaders.set(k, v);
    }
  });

  resHeaders.delete("access-control-allow-origin");
  resHeaders.delete("access-control-allow-credentials");

  const body = await gwRes.arrayBuffer();
  return new NextResponse(body, {
    status: gwRes.status,
    statusText: gwRes.statusText,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
