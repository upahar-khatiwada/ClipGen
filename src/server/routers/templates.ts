import prisma from "@/src/lib/prisma";
import { router, privateProcedure } from "../trpc";

export const templatesRouter = router({
  getContentTypes: privateProcedure.query(() => {
    return prisma.contentType.findMany();
  }),

  getStyles: privateProcedure.query(() => {
    return prisma.style.findMany();
  }),

  getDuration: privateProcedure.query(() => {
    return prisma.duration.findMany();
  }),
});
