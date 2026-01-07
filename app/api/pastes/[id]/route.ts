import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ Correct for Next.js 16
  const { id } = await params;

  const now = new Date();

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.expiresAt && now > paste.expiresAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.paste.update({
    where: { id },
    data: { viewsUsed: { increment: 1 } },
  });

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.maxViews !== null
        ? Math.max(paste.maxViews - paste.viewsUsed - 1, 0)
        : null,
    expires_at: paste.expiresAt?.toISOString() ?? null,
  });
}
