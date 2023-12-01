/*
  Warnings:

  - The primary key for the `Competition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shortName` on the `Team` table. All the data in the column will be lost.
  - Changed the type of `id` on the `Competition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `competitionId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `homeTeamId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `awayTeamId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `matchId` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Team` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_matchId_fkey";

-- AlterTable
ALTER TABLE "Competition" DROP CONSTRAINT "Competition_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Competition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "competitionId",
ADD COLUMN     "competitionId" INTEGER NOT NULL,
DROP COLUMN "homeTeamId",
ADD COLUMN     "homeTeamId" INTEGER NOT NULL,
DROP COLUMN "awayTeamId",
ADD COLUMN     "awayTeamId" INTEGER NOT NULL,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "matchId",
ADD COLUMN     "matchId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "shortName",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
