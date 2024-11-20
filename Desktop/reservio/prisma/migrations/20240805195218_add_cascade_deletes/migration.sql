/*
  Warnings:

  - You are about to drop the column `DATE` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `DateDebut` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DateFin` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `DateDebut` on the `Service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `DateFin` on the `Service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "DATE",
ADD COLUMN     "DateDebut" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DateFin" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "DateDebut",
ADD COLUMN     "DateDebut" TIMESTAMP(3) NOT NULL,
DROP COLUMN "DateFin",
ADD COLUMN     "DateFin" TIMESTAMP(3) NOT NULL;
