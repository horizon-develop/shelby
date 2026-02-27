import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stylistSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stylist = await prisma.stylist.findUnique({
    where: { id },
    include: { services: { include: { service: true } } },
  });

  if (!stylist) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(stylist);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // Allow partial updates including isActive toggle
  if (typeof body.isActive === "boolean" && Object.keys(body).length === 1) {
    const stylist = await prisma.stylist.update({
      where: { id },
      data: { isActive: body.isActive },
      include: { services: { include: { service: true } } },
    });
    return NextResponse.json(stylist);
  }

  const parsed = stylistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const stylist = await prisma.stylist.update({
    where: { id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      imageUrl: parsed.data.imageUrl || null,
    },
    include: { services: { include: { service: true } } },
  });

  return NextResponse.json(stylist);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.stylist.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
