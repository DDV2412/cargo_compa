import bcrypt from "bcrypt";
import prisma from "./client";

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@cargo-compa.com" },
    update: {},
    create: {
      email: "admin@cargo-compa.com",
      name: "Admin",
      password: bcrypt.hashSync("cargoDev@24", 12),
      role: "ADMIN",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
