import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const villageId = searchParams.get('villageId');
    if (!villageId) return NextResponse.json({ error: 'Missing villageId' }, { status: 400 });

    const contacts = await prisma.contact.findMany({
      where: { villageId } as any,
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { villageId, scope, category, categoryDesc, fullName, role, phone, avatarUrl, displayType } = body;
    if (!villageId) return NextResponse.json({ error: 'Missing villageId' }, { status: 400 });
    if (!fullName || !role || !phone) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const contact = await prisma.contact.create({
      data: {
        villageId,
        scope: scope || 'chung',
        category: category || 'Chung',
        categoryDesc: categoryDesc || null,
        fullName,
        role,
        phone,
        avatarUrl: avatarUrl || null,
        displayType: displayType || 'normal',
      } as any,
    });
    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('Create contact error:', error);
    return NextResponse.json({ error: 'Failed to create contact', message: error.message }, { status: 500 });
  }
}
