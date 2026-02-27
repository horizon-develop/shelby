import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const exists = await prisma.stylistAbsence.findUnique({ where: { id } });

  if (!exists) {
    return NextResponse.json(
      { message: "Absence not found" },
      { status: 404 }
    );
  }

  await prisma.stylistAbsence.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
