import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stylistSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "true";

  const stylists = await prisma.stylist.findMany({
    where: showAll ? {} : { isActive: true },
    orderBy: { order: "asc" },
    include: {
      services: {
        include: { service: true },
      },
    },
  });

  return NextResponse.json(stylists);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = stylistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const maxOrder = await prisma.stylist.aggregate({ _max: { order: true } });

  const stylist = await prisma.stylist.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      imageUrl: parsed.data.imageUrl || null,
      order: (maxOrder._max.order ?? -1) + 1,
    },
    include: {
      services: { include: { service: true } },
    },
  });

  return NextResponse.json(stylist, { status: 201 });
}
