/*
  Warnings:

  - You are about to drop the column `periodStart` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "periodStart",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "MatchStatus";
