import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stylists = await prisma.stylist.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      services: {
        include: { service: true },
      },
    },
  });

  return NextResponse.json(stylists);
}
