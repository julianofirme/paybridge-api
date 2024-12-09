import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient; // Replace PrismaClient with the actual type of your Prisma client
  }
}
