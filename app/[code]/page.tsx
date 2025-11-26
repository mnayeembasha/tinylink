import { notFound, redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function RedirectPage({ params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({ where: { code: params.code } });

  if (!link) {
    notFound();
  }

  await prisma.link.update({
    where: { code: params.code },
    data: { clicks: { increment: 1 }, lastClicked: new Date() },
  });

  redirect(link.url);
}