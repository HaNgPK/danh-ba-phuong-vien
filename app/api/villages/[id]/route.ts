import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const village = await prisma.village.update({
      where: { id },
      data: {
        slug: body.slug,
        name: body.name,
        fullName: body.fullName,
        address: body.address,
        logoUrl: body.logoUrl || null,
        facebookUrl: body.facebookUrl || null,
        zaloUrl: body.zaloUrl || null,
        emergencyPolicePhone: body.emergencyPolicePhone || null,
        emergencyHealthPhone: body.emergencyHealthPhone || null,
      },
    });
    return NextResponse.json(village);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update village' }, { status: 500 });
  }
}
