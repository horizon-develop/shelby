import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hairdresserId: string }> }
) {
  const { hairdresserId } = await params;

  const absences = await prisma.stylistAbsence.findMany({
    where: { stylistId: hairdresserId },
  });

  const formatted = absences.map((a) => ({
    ...a,
    date: a.date.toISOString().split("T")[0],
  }));

  return NextResponse.json(formatted);
}
