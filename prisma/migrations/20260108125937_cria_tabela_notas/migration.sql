/*
  Warnings:

  - You are about to drop the column `nota1` on the `Matricula` table. All the data in the column will be lost.
  - You are about to drop the column `nota2` on the `Matricula` table. All the data in the column will be lost.
  - You are about to drop the column `nota3` on the `Matricula` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Matricula" DROP COLUMN "nota1",
DROP COLUMN "nota2",
DROP COLUMN "nota3";

-- AlterTable
ALTER TABLE "Turma" ADD COLUMN     "anoLetivo" INTEGER;

-- CreateTable
CREATE TABLE "Nota" (
    "id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "etapa" TEXT NOT NULL,
    "matriculaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nota_matriculaId_etapa_key" ON "Nota"("matriculaId", "etapa");

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "Matricula"("id") ON DELETE CASCADE ON UPDATE CASCADE;
