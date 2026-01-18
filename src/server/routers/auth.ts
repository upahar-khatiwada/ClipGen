import z from "zod";
import { publicProcedure, router } from "../trpc";
import { comparePassword, hashPassword } from "@/src/utils/password_hasher";
import {
  createAccessToken,
  createRefreshToken,
} from "@/src/utils/token_generators";
import { cookies } from "next/headers";

export const userRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input;

      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      console.log(existingUser);

      if (existingUser) {
        return { status: "error", message: "User already exists!" };
      }

      const hashedPassword = await hashPassword(password);

      await ctx.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: username,
            email: email,
            passwordHash: hashedPassword,
          },
        });

        await tx.account.create({
          data: {
            provider: "email",
            userId: user.id,
            providerAccountId: user.email,
          },
        });
      });

      return { status: "success", message: "User successfully created!" };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        return { status: "error", message: "User doesn't exist!" };
      }

      const isPasswordOk = await comparePassword(
        password,
        existingUser.passwordHash!,
      );

      if (!isPasswordOk) {
        return { status: "error", message: "Password doesn't match" };
      }
      const accessToken = createAccessToken(existingUser.id);
      const refreshToken = createRefreshToken(existingUser.id);

      await ctx.redis.set(
        `refresh_token: ${refreshToken}`,
        `user_id: ${existingUser.id}`,
      );

      await ctx.prisma.account.update({
        where: {
          userId: existingUser.id,
          provider_providerAccountId: {
            provider: "email",
            providerAccountId: existingUser.email,
          },
        },
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          provider: "session",
        },
      });

      const cookie = await cookies();

      cookie.set("accessToken", accessToken);
      cookie.set("refreshToken", refreshToken);

      return {
        status: "success",
        message: "Successfully logged in",
      };
    }),
});
