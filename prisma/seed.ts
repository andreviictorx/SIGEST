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
  console.log("Admin criado:");

  const alunosData = Array.from({ length: 10 }).map((_, i) => ({
    nome: `Aluno Teste ${i + 1}`,
    email: `aluno${i + 1}@escola.com`,
    matricula: `2024${String(i + 1).padStart(4, "0")}`,
    telefone: "11999999999",
    dataNascimento: new Date("2010-01-01"),
  }));

  for (const aluno of alunosData) {
    await prisma.aluno.upsert({
      where: { email: aluno.email },
      update: {},
      create: aluno,
    });
  }
  console.log("Alunos semeados com sucesso!");

  const professoresData = Array.from({ length: 5 }).map((_, i) => ({
    nome: `Professor Teste ${i + 1}`,
    email: `prof${i + 1}@escola.com`,
    matricula: `2020${String(i + 1).padStart(4, "0")}`,
    telefone: "11999999999",
  }));

  for (const professor of professoresData) {
    await prisma.professor.upsert({
      where: { email: professor.email },
      update: {},
      create: professor,
    });
  }

  console.log("Professores criados!");

  const disciplinasData = Array.from({ length: 5 }).map((_, i) => ({
    nome: `Disciplina Teste ${i + 1}`,
    codigo: `DT25${i + 1}`,
  }));

  for (const disciplina of disciplinasData) {
    await prisma.disciplina.upsert({
      where: { codigo: disciplina.codigo },
      update: {},
      create: disciplina,
    });
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
