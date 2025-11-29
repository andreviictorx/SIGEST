// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  
  const senhaHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@escola.com" },
    update: {},
    create: {
      email: "admin@escola.com",
      name: "Diretor Admin",
      password: senhaHash,
      role: "ADMIN",
    },
  });

  console.log("Admin criado:", admin);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
