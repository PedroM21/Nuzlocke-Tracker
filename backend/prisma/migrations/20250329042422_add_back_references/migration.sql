-- CreateTable
CREATE TABLE "Run" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "runName" TEXT NOT NULL,
    "generation" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'standard',
    "attempt" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "rulesetId" INTEGER,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruleset" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ruleSetText" TEXT NOT NULL,

    CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
