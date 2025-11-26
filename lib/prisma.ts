import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg'; 

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');

    const pool = new Pool({ connectionString }); // ⬅ FIXED
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: ['error', 'warn'],
    });
  })();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
