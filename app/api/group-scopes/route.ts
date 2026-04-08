import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scope = await prisma.groupScope.create({
      data: {
        code: body.code,
        name: body.name,
        message: body.message || null,
        disabled: Boolean(body.disabled),
        order: Number(body.order ?? 0),
        villageId: body.villageId,
      },
    });
    return NextResponse.json(scope);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create scope' }, { status: 500 });
  }
}
