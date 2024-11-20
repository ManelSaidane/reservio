/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_serviceId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reservationId" INTEGER;

-- RenameForeignKey
ALTER TABLE "Review" RENAME CONSTRAINT "reviewServiceId" TO "Review_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("ID") ON DELETE SET NULL ON UPDATE CASCADE;
