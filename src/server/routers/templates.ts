import { router, privateProcedure } from "../trpc";

export const templatesRouter = router({
  getContentTypes: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.contentType.findMany();
  }),

  getStyles: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.style.findMany();
  }),

  getDuration: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.duration.findMany();
  }),
});
