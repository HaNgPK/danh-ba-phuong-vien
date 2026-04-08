import { notFound } from 'next/navigation';
import DirectoryClient from '@/src/components/DirectoryClient';
import prisma from '@/src/lib/prisma';
import { getVillageBySlug } from '@/src/lib/villages';

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ villageSlug: string }> | { villageSlug: string };
}) {
  const { villageSlug } = await params;

  let contacts: any[] = [];
  let scopes: any[] = [];
  let buttons: any[] = [];
  let village: any = null;

  try {
    village = await getVillageBySlug(villageSlug);
    if (!village) {
      return notFound();
    }

    contacts = await prisma.contact.findMany({ where: { villageId: village.id }, orderBy: { createdAt: 'asc' } });
    scopes = await prisma.groupScope.findMany({ where: { villageId: village.id }, orderBy: { order: 'asc' } });
    buttons = await prisma.actionButton.findMany({ where: { villageId: village.id }, orderBy: { order: 'asc' } });
  } catch (e) {
    console.error(e);
  }

  return <DirectoryClient village={village} contacts={contacts} scopes={scopes} buttons={buttons} />;
}
