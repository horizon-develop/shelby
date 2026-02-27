import { PrismaClient, DayOfWeek } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Create admin users
  const hash1 = await bcrypt.hash("ys-N0HA99Qw%", 12);
  const alan = await prisma.user.upsert({
    where: { email: "alaneduardokennedy@gmail.com" },
    update: { passwordHash: hash1 },
    create: {
      email: "alaneduardokennedy@gmail.com",
      name: "Alan Kennedy",
      passwordHash: hash1,
    },
  });

  const hash2 = await bcrypt.hash(")02qli<9Y<Jj", 12);
  const leo = await prisma.user.upsert({
    where: { email: "leo@shelby.com" },
    update: { passwordHash: hash2 },
    create: {
      email: "leo@shelby.com",
      name: "Leonardo Miño",
      passwordHash: hash2,
    },
  });
  console.log(`Admin users created: ${alan.email}, ${leo.email}`);

  // 2. Create stylist
  const pedro = await prisma.stylist.upsert({
    where: { id: "stylist-pedro" },
    update: { name: "Pedro" },
    create: {
      id: "stylist-pedro",
      name: "Pedro",
      order: 0,
    },
  });
  console.log(`Stylist created: ${pedro.name}`);

  // 3. Create services (prices in ARS cents)
  const services = [
    {
      id: "service-corte-corto",
      name: "Corte de cabello - Corto",
      price: 2000000,
      duration: 30,
      order: 0,
    },
    {
      id: "service-corte-barba",
      name: "Corte de barba",
      price: 800000,
      duration: 30,
      order: 1,
    },
    {
      id: "service-corte-barba-combo",
      name: "Corte de cabello corto + barba",
      price: 2500000,
      duration: 30,
      order: 2,
    },
    {
      id: "service-corte-largo",
      name: "Corte de cabello - Largo",
      price: 2500000,
      duration: 60,
      order: 3,
    },
    {
      id: "service-brushing",
      name: "Brushing",
      price: 1300000,
      duration: 60,
      order: 4,
    },
    {
      id: "service-secado",
      name: "Secado",
      price: 1000000,
      duration: 60,
      order: 5,
    },
    {
      id: "service-hidratacion",
      name: "Tratamientos de hidratación",
      price: 1000000,
      duration: 60,
      order: 6,
    },
  ];

  const createdServices = [];
  for (const s of services) {
    const service = await prisma.service.upsert({
      where: { id: s.id },
      update: { name: s.name, price: s.price, duration: s.duration, order: s.order },
      create: s,
    });
    createdServices.push(service);
  }
  console.log(`Services created: ${createdServices.length}`);

  // 4. Assign all services to Pedro
  for (const service of createdServices) {
    await prisma.serviceStylist.upsert({
      where: {
        serviceId_stylistId: {
          serviceId: service.id,
          stylistId: pedro.id,
        },
      },
      update: {},
      create: {
        serviceId: service.id,
        stylistId: pedro.id,
      },
    });
  }
  console.log("Service-stylist assignments created");

  // 5. Create salon schedule (Mon-Sat 10:00-22:00, Sun closed)
  const workDays: DayOfWeek[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  for (const day of workDays) {
    await prisma.salonSchedule.upsert({
      where: { id: `salon-schedule-${day.toLowerCase()}` },
      update: { startTime: "10:00", endTime: "22:00", isActive: true },
      create: {
        id: `salon-schedule-${day.toLowerCase()}`,
        dayOfWeek: day,
        startTime: "10:00",
        endTime: "22:00",
        isActive: true,
      },
    });
  }

  await prisma.salonSchedule.upsert({
    where: { id: "salon-schedule-sunday" },
    update: { isActive: false },
    create: {
      id: "salon-schedule-sunday",
      dayOfWeek: "SUNDAY",
      startTime: "10:00",
      endTime: "22:00",
      isActive: false,
    },
  });
  console.log("Salon schedule created (Mon-Sat 10:00-22:00, Sun closed)");

  // 6. Create Pedro's stylist schedules (Mon-Sat 10:00-22:00)
  for (const day of workDays) {
    await prisma.stylistSchedule.upsert({
      where: { id: `${pedro.id}-schedule-${day.toLowerCase()}` },
      update: { startTime: "10:00", endTime: "22:00" },
      create: {
        id: `${pedro.id}-schedule-${day.toLowerCase()}`,
        stylistId: pedro.id,
        dayOfWeek: day,
        startTime: "10:00",
        endTime: "22:00",
      },
    });
  }
  console.log("Stylist schedules created");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
