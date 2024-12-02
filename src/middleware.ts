import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/shipments", "/settings", "/dashboard"];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function middleware(request: NextRequest) {
  const isPreflight = request.method === "OPTIONS";
  const token = request.cookies.get(process.env.NEXT_AUTH_TOKEN_NAME as string);

  if (isPreflight) {
    const preflightHeaders = {
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
    "/",
  ],
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images/.*|document/.*|_next/static/media).*)",
  ],
};
