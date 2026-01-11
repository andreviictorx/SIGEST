/*
  Warnings:

  - You are about to drop the column `frequencia` on the `Matricula` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusFrequencia" AS ENUM ('PRESENTE', 'AUSENTE', 'JUSTIFICADO');

-- AlterTable
ALTER TABLE "Matricula" DROP COLUMN "frequencia";

-- CreateTable
CREATE TABLE "Frequencia" (
    "id" TEXT NOT NULL,
    "status" "StatusFrequencia" NOT NULL DEFAULT 'PRESENTE',
    "matriculaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Frequencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Frequencia_matriculaId_idx" ON "Frequencia"("matriculaId");

-- CreateIndex
CREATE INDEX "Frequencia_data_idx" ON "Frequencia"("data");

-- CreateIndex
CREATE UNIQUE INDEX "Frequencia_matriculaId_data_key" ON "Frequencia"("matriculaId", "data");

-- AddForeignKey
ALTER TABLE "Frequencia" ADD CONSTRAINT "Frequencia_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "Matricula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
