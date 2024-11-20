-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "Date" SET DATA TYPE TEXT;

-- RenameForeignKey
ALTER TABLE "Review" RENAME CONSTRAINT "Review_serviceId_fkey" TO "reviewServiceId";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Reservation"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
