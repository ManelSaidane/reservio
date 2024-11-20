/*
  Warnings:

  - You are about to drop the column `Date` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "Date",
ADD COLUMN     "DateDebut" TEXT,
ADD COLUMN     "DateFin" TEXT;
