import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    // Create pg connection pool
    const pool = new pg.Pool({
      connectionString,
    });

    // Create adapter
    const adapter = new PrismaPg(pool);

    // Create Prisma client with adapter
    return new PrismaClient({
      adapter,
      log: ['query', 'info', 'warn', 'error'], // optional
    });
  })();

// Store in global to prevent multiple instances (Next.js dev mode)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
