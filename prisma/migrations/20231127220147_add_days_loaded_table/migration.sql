-- CreateTable
CREATE TABLE "DaysLoaded" (
    "id" INTEGER NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "DaysLoaded_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DaysLoaded_day_key" ON "DaysLoaded"("day");
