import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("x-auth-placeholder", "admin-route");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
