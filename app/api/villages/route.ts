import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const village = await prisma.village.create({
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
  } catch (error: any) {
    console.error('Create Village Error:', error);
    return NextResponse.json(
      { error: 'Failed to create village', message: error.message }, 
      { status: 500 }
    );
  }
}
