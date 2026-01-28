import { router, publicProcedure } from "../trpc";
import { randomUUID } from "crypto";

function getGoogleAuthUrl() {
  const state = randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  });

  return {
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
    state,
  };
}

export const oauthRouter = router({
  loginWithGoogle: publicProcedure.mutation(async ({ ctx }) => {
    const { url, state } = getGoogleAuthUrl();

    await ctx.redis.set(`oauth:google:${state}`, "valid", "EX", 60 * 5);

    return { url };
  }),
});
