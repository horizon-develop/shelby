import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const closures = await prisma.salonClosure.findMany({
    where: { date: { gte: today } },
  });

  const formatted = closures.map((c) => ({
    ...c,
    date: c.date.toISOString().split("T")[0],
  }));

  return NextResponse.json(formatted);
}
