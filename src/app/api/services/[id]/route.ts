import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // Allow isActive toggle
  if (typeof body.isActive === "boolean" && Object.keys(body).length === 1) {
    const service = await prisma.service.update({
      where: { id },
      data: { isActive: body.isActive },
    });
    return NextResponse.json(service);
  }

  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      duration: parsed.data.duration,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
