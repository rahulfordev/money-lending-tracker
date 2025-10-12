import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.ok; // Returns true if token is valid
  } catch (error) {
    return false; // Token is invalid
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/login", "/register", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Dashboard routes
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // If user is trying to access dashboard
  if (isDashboardRoute) {
    if (!token) {
      // No token - redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists - validate it
    const isValidToken = await validateToken(token);

    if (!isValidToken) {
      // Invalid token - clear cookie and redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);

      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("token");
      return response;
    }
  }

  // If user has valid token and trying to access auth routes
  if (token && isPublicRoute) {
    const isValidToken = await validateToken(token);

    if (isValidToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Invalid token on public route - clear it
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/"],
};
