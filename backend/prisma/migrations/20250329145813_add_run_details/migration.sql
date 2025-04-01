-- AlterTable
ALTER TABLE "Run" ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateTable
CREATE TABLE "RunDetail" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "caught" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "isAlive" BOOLEAN NOT NULL,

    CONSTRAINT "RunDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RunDetail" ADD CONSTRAINT "RunDetail_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
