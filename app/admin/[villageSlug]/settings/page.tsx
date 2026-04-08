import { notFound } from 'next/navigation';
import prisma from '@/src/lib/prisma';
import AdminPanel from '@/src/components/AdminPanel';
import { getVillageBySlug } from '@/src/lib/villages';

export const revalidate = 0;

export default async function AdminSettingsPage({
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
    if (!village) return notFound();

    contacts = await prisma.contact.findMany({
      where: { villageId: village.id },
      orderBy: { createdAt: 'desc' },
    });
    scopes = await prisma.groupScope.findMany({
      where: { villageId: village.id },
      orderBy: { order: 'asc' },
    });
    buttons = await prisma.actionButton.findMany({
      where: { villageId: village.id },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error(error);
  }

  return (
    <AdminPanel
      village={village}
      initialContacts={contacts}
      initialScopes={scopes}
      initialButtons={buttons}
      initialTab="settings"
    />
  );
}
