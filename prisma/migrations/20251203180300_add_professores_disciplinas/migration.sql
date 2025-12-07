/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Disciplina` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_codigo_key" ON "Disciplina"("codigo");
