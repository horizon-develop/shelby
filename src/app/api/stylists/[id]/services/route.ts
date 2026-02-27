import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const syncSchema = z.object({
  serviceIds: z.array(z.string()),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = syncSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { serviceIds } = parsed.data;

  // Delete existing and recreate
  await prisma.serviceStylist.deleteMany({ where: { stylistId: id } });

  if (serviceIds.length > 0) {
    await prisma.serviceStylist.createMany({
      data: serviceIds.map((serviceId) => ({
        stylistId: id,
        serviceId,
      })),
    });
  }

  const stylist = await prisma.stylist.findUnique({
    where: { id },
    include: { services: { include: { service: true } } },
  });

  return NextResponse.json(stylist);
}
