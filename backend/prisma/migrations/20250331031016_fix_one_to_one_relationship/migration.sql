/*
  Warnings:

  - A unique constraint covering the columns `[rulesetId]` on the table `Run` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Run_rulesetId_key" ON "Run"("rulesetId");
