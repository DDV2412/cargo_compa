import { decode } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = ["http://localhost:3000"];

const protectedPaths = ["/shipments", "/settings", "/dashboard"];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  if (origin === "*") {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const isPreflight = request.method === "OPTIONS";
  const token = request.cookies.get("next-auth.session-token");

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const { pathname } = request.nextUrl;
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const response = NextResponse.next();
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  publicUrl: [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/404",
  ],
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images/.*|_next/static/media).*)",
  ],
};
