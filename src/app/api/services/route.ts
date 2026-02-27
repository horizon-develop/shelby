import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "true";

  const services = await prisma.service.findMany({
    where: showAll ? {} : { isActive: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });

  const service = await prisma.service.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      duration: parsed.data.duration,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
