import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const villageId = body.villageId;

    if (!villageId) {
      return NextResponse.json({ error: 'Missing villageId' }, { status: 400 });
    }

    const existing = await prisma.contact.findFirst({
      where: { id: resolvedParams.id, villageId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Contact not found for village' }, { status: 404 });
    }

    const contact = await prisma.contact.update({
      where: { id: resolvedParams.id },
      data: {
        scope: body.scope,
        category: body.category,
        categoryDesc: body.categoryDesc,
        fullName: body.fullName,
        avatarUrl: body.avatarUrl,
        role: body.role,
        phone: body.phone,
        address: body.address,
        displayType: body.displayType,
      },
    });
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const villageId = searchParams.get('villageId');

    if (!villageId) {
      return NextResponse.json({ error: 'Missing villageId' }, { status: 400 });
    }

    const existing = await prisma.contact.findFirst({
      where: { id: resolvedParams.id, villageId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Contact not found for village' }, { status: 404 });
    }

    await prisma.contact.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
