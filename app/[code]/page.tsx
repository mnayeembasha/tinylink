import { redirect } from "next/navigation";
import {NotFound} from "@/components/NotFound";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; 

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params; // ⬅ FIX: params is a promise

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return <NotFound/>
  }

  await prisma.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  redirect(link.url);
}
