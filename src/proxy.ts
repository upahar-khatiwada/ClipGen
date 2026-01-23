import { NextRequest, NextResponse } from "next/server";
import { redis } from "./server/redis";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const refreshToken = req.cookies.get("refreshToken")?.value;

  let isLoggedIn = false;

  if (refreshToken) {
    const session = await redis.get(`refresh_token:${refreshToken}`);
    if (session) isLoggedIn = true;
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const protectedPages = [
    "/",
    "/dashboard",
    "/upgrade",
    "/upgrade/success",
    "/upgrade/failure",
    "/account",
    "/templates",
  ];

  if (pathname.startsWith("/upgrade/success")) {
    const paid = req.nextUrl.searchParams.get("paid");
    if (paid !== "true") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/upgrade/failure")) {
    const success = req.nextUrl.searchParams.get("success");
    if (success !== "false") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (!isLoggedIn && protectedPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/(.*)",
};

// export const config = {
//   matcher: [
//     "/",
//     "/login",
//     "/signup",
//     "/dashboard",
//     "/upgrade",
//     "/account",
//     "/templates",
//   ],
// };
