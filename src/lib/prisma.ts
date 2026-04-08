import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing POSTGRES_URL or DATABASE_URL for Prisma');
}

// Reuse pool across hot-reloads in dev
declare global {
  var _pgPool: Pool | undefined;
  var prismaGlobal: PrismaClient | undefined;
}

const pool = globalThis._pgPool ?? new Pool({ connectionString });
if (process.env.NODE_ENV !== 'production') globalThis._pgPool = pool;

function buildPrismaClient() {
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = globalThis.prismaGlobal ?? buildPrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export default prisma;
