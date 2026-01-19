import z from "zod";
import { publicProcedure, router } from "../trpc";
import { comparePassword, hashPassword } from "@/src/utils/password_hasher";
import {
  createAccessToken,
  createRefreshToken,
} from "@/src/utils/token_generators";
import { cookies } from "next/headers";
import { sendEmail } from "@/src/utils/mailer";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
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

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists!",
        });
      }

      const hashedPassword = await hashPassword(password);

      const user = await ctx.prisma.$transaction(async (tx) => {
        const userSigningUp = await tx.user.create({
          data: {
            name: username,
            email: email,
            passwordHash: hashedPassword,
          },
        });

        await tx.account.create({
          data: {
            provider: "email",
            userId: userSigningUp.id,
            providerAccountId: userSigningUp.email,
          },
        });

        return userSigningUp;
      });

      await sendEmail({
        email: user.email,
        emailType: "VERIFY",
        userId: user.id,
      });

      return {
        status: "success",
        message:
          "Check your email to verify your account. You might also need to check your spam folder.",
      };
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
        `refresh_token:${refreshToken}`,
        JSON.stringify({
          userId: existingUser.id,
          accessToken,
        }),
        "EX",
        7 * 24 * 60 * 60,
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

  resendVerificationEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return { status: "error", message: "User not found" };
      }

      if (user.emailVerifiedAt && user.emailVerifiedAt.getTime() < Date.now()) {
        return { status: "error", message: "Email is already verified." };
      }

      try {
        await sendEmail({
          email: user.email,
          emailType: "VERIFY",
          userId: user.id,
        });

        return { status: "success", message: "Verification email sent." };
      } catch (err) {
        console.error("Error while resending email:", err);
        return {
          status: "error",
          message: "Unable to send verification email. Please try again later.",
        };
      }
    }),

  verify: publicProcedure.query(async ({ ctx }) => {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return { status: "error", message: "No refresh token found" };
    }

    const redisKey = `refresh_token:${refreshToken}`;
    const data = await ctx.redis.get(redisKey);

    if (!data) {
      return { status: "error", message: "Token expired or invalid" };
    }

    const { userId, accessToken } = JSON.parse(data);

    return {
      status: "success",
      userId,
      accessToken,
    };
  }),
});
