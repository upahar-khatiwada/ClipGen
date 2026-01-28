import z from "zod";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { comparePassword, hashPassword } from "@/src/utils/password_hasher";
import {
  createAccessToken,
  verifyAccessToken,
} from "@/src/utils/token_generators";
import { cookies } from "next/headers";
import { sendEmail } from "@/src/services/sendgrid_mailer";
import { TRPCError } from "@trpc/server";
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

      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          OR: [{ email }, { name: username }],
        },
      });

      if (existingUser) {
        if (!existingUser.emailVerifiedAt) {
          await sendEmail({
            email: existingUser.email,
            emailType: "VERIFY",
            userId: existingUser.id,
          });

          return {
            status: "success",
            message:
              "A verification email was resent. Check your inbox or spam folder.",
          };
        } else {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User with this email/username already exists!",
          });
        }
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
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          provider: "email",
        },
      });

      const cookie = await cookies();

      cookie.set("accessToken", accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "lax",
      });

      return {
        status: "success",
        message: "Successfully logged in",
      };
    }),

  loginWithGoogle: publicProcedure.mutation(async ({ ctx }) => {
    const { url, state } = getGoogleAuthUrl();

    await ctx.redis.set(`oauth:google:${state}`, "valid", "EX", 60 * 5);

    return { url };
  }),

  logout: privateProcedure.mutation(async ({ ctx }) => {
    try {
      await ctx.prisma.account.deleteMany({
        where: { userId: ctx.user?.id },
      });

      const cookieStore = await cookies();
      cookieStore.delete("accessToken");

      return { success: true };
    } catch (err) {
      console.error("Error occured while logging out: ", err);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error while logging out",
      });
    }
  }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = input;

      const user = await ctx.prisma.user.findFirst({
        where: {
          verifyToken: token,
          verifyTokenExpiry: { gt: new Date(Date.now()) },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User Not Found" });
      }

      if (user.emailVerifiedAt) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already verified!",
        });
      }

      await ctx.prisma.user.update({
        where: {
          id: user.id,
          verifyToken: token,
        },
        data: {
          emailVerifiedAt: new Date(Date.now()),
          verifyToken: null,
          verifyTokenExpiry: null,
        },
      });

      return {
        status: "success",
        message: "User verified successfully",
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

  getSession: publicProcedure.query(async ({ ctx }) => {
    const cookie = ctx.req.headers.get("cookie") ?? "";

    const accessToken = cookie
      .split(";")
      .find((c) => c.trim().startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) return null;

    const payload = verifyAccessToken(accessToken);
    if (!payload) return null;

    const user = await ctx.prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        image: true,
      },
    });

    return user;
  }),
});
