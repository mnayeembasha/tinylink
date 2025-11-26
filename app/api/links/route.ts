import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export async function POST(request: Request) {
  const body = await request.json();
  const { url, code } = body;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  let finalCode = code;

  if (code) {
    if (!/^[A-Za-z0-9]{6,12}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid custom code (must be 6–12 alphanumeric characters)' },
        { status: 400 }
      );
    }

    const exists = await prisma.link.findUnique({ where: { code } });
    if (exists) {
      return NextResponse.json(
        { error: 'Custom code already exists' },
        { status: 409 }
      );
    }
  } else {
    let length = Math.floor(Math.random() * 3) + 6;
    const nanoid = customAlphabet(alphabet, length);

    let exists;
    do {
      finalCode = nanoid();
      exists = await prisma.link.findUnique({ where: { code: finalCode } });
    } while (exists);
  }

  const link = await prisma.link.create({
    data: { code: finalCode, url },
  });

  return NextResponse.json(link);
}

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(links);
}
