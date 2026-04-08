import prisma from '@/src/lib/prisma';

export async function getVillageBySlug(slug: string) {
  const villageModel = (prisma as any).village;
  if (!villageModel) {
    console.warn('Prisma client does not have village model yet. Restart dev server or regenerate client.');
    return null;
  }

  return villageModel.findUnique({
    where: { slug },
  });
}

export async function getAllVillages() {
  const villageModel = (prisma as any).village;
  if (!villageModel) {
    console.warn('Prisma client does not have village model yet. Returning empty villages list.');
    return [];
  }

  return villageModel.findMany({
    orderBy: { name: 'asc' },
  });
}
