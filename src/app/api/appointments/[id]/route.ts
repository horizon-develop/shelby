import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { statusUpdateSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = statusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json(
      { message: "Booking not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
    include: { service: true, stylist: true },
  });

  return NextResponse.json({
    ...updated,
    date: updated.date.toISOString().split("T")[0],
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json(
      { message: "Booking not found" },
      { status: 404 }
    );
  }

  await prisma.booking.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
