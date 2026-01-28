import prisma from "@/src/lib/prisma";
import { redis } from "@/src/server/redis";
import { createAccessToken } from "@/src/utils/token_generators";
import { NextRequest, NextResponse } from "next/server";

// reference taken from here: https://www.yaqeen.me/blog/how-to-do-google-oauth
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    // TODO HANDLE LOGIC
    console.log("1");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const stateKey = `oauth:google:${state}`;
  const valid = await redis.get(stateKey);

  if (!valid) {
    // TODO HANDLE ERROR HERE
    console.log("2");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  await redis.del(stateKey);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    // TODO HANDLE LOGIC
    console.log("3");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const tokens = await tokenRes.json();

  const { access_token, id_token, expires_in, scope, token_type } = tokens;

  const tokenInfoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`,
  );

  const googleUser = await tokenInfoRes.json();

  let user = await prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        image: googleUser.picture,
      },
    });
  }

  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: googleUser.sub,
      },
    },
    update: {
      access_token,
      id_token,
      token_type,
      scope,
      expires_at: new Date(Date.now() + expires_in * 1000),
    },
    create: {
      userId: user.id,
      provider: "google",
      providerAccountId: googleUser.sub,
      access_token,
      id_token,
      token_type,
      scope,
      expires_at: new Date(Date.now() + expires_in * 1000),
    },
  });

  const response = NextResponse.redirect(new URL("/dashboard", req.url));

  const accessToken = createAccessToken(user.id);

  response.cookies.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
  });

  return response;
}
