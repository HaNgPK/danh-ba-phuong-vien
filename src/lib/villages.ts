import prisma from '@/src/lib/prisma';

export async function getVillageBySlug(slug: string) {
  const villageModel = (prisma as any).village;
  if (!villageModel) {
    console.warn('Prisma client does not have village model yet. Restart dev server or regenerate client.');
    return null;
  }

  try {
    return await villageModel.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error('Database connection failed for getVillageBySlug:', error);
    return null; // Graceful degradation for unavailable DB
  }
}

export async function getAllVillages() {
  const villageModel = (prisma as any).village;
  if (!villageModel) {
    console.warn('Prisma client does not have village model yet. Returning empty villages list.');
    return [];
  }

  try {
    return await villageModel.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Database connection failed for getAllVillages:', error);
    return []; // Graceful degradation for unavailable DB
  }
}
