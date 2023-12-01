/*
  Warnings:

  - Added the required column `elapsed` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('FINISHED', 'SCHEDULED', 'FIRST_HALF', 'HALFTIME', 'SECOND_HALF');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "elapsed" INTEGER NOT NULL,
ADD COLUMN     "status" "MatchStatus" NOT NULL;
