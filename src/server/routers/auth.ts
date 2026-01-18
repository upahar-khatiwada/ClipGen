import z from "zod";
import { publicProcedure, router } from "../trpc";
import { hashPassword } from "@/src/utils/password_hasher";
import { createSessionId } from "@/src/utils/session_id_generator";

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

      if (existingUser) {
        throw new Error("The user already exists");
      }

      const hashedPassword = await hashPassword(password);

      const user = await ctx.prisma.user.create({
        data: {
          username,
          email,
          passwordHash: hashedPassword,
        },
      });

      const sessionId = createSessionId();
    }),
});
