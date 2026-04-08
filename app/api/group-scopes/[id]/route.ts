import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const scope = await prisma.groupScope.update({
      where: { id },
      data: {
        code: body.code,
        name: body.name,
        message: body.message || null,
        disabled: Boolean(body.disabled),
        order: Number(body.order ?? 0),
      },
    });
    return NextResponse.json(scope);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update scope' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const { id } = await params;
    await prisma.groupScope.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete scope' }, { status: 500 });
  }
}
