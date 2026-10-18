import { NextResponse } from 'next/server';
import { deleteDbEvent } from '@/lib/admin-data';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteDbEvent(id);
  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  await prisma.eventEntry.update({
    where: { id },
    data: {
      nameFr: body.nameFr,
      nameEn: body.nameEn,
      descriptionFr: body.descriptionFr,
      descriptionEn: body.descriptionEn,
      shortDescFr: body.shortDescFr,
      shortDescEn: body.shortDescEn,
    },
  });
  return NextResponse.json({ ok: true });
}
