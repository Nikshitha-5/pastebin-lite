import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Invalid content" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "Invalid ttl_seconds" },
        { status: 400 }
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "Invalid max_views" },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const now = new Date();

    const expiresAt =
      ttl_seconds !== undefined
        ? new Date(now.getTime() + ttl_seconds * 1000)
        : null;

    await prisma.paste.create({
      data: {
        id,
        content,
        expiresAt,
        maxViews: max_views ?? null,
      },
    });

    return NextResponse.json({
      id,
      url: `${req.nextUrl.origin}/p/${id}`,
    });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
