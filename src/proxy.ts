// import { NextRequest, NextResponse } from "next/server";
// import { redis } from "./server/redis";

// export async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const refreshToken = req.cookies.get("refreshToken")?.value;

//   let isLoggedIn = false;

//   if (refreshToken) {
//     const session = await redis.get(`refresh_token:${refreshToken}`);
//     if (session) isLoggedIn = true;
//   }

//   if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   const protectedPages = [
//     "/",
//     "/dashboard",
//     "/upgrade",
//     "/account",
//     "/templates",
//   ];

//   if (!isLoggedIn && protectedPages.includes(pathname)) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// // export const config = {
// //   matcher: "/(.*)",
// // };

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

export async function proxy() {
}
