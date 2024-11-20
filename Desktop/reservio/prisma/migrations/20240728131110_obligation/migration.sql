/*
  Warnings:

  - The primary key for the `Paiement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Paiement` table. All the data in the column will be lost.
  - You are about to drop the column `NumCarte` on the `Paiement` table. All the data in the column will be lost.
  - You are about to drop the column `montant` on the `Paiement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeId]` on the table `Paiement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeId` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Made the column `DateDebut` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DateFin` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_pkey",
DROP COLUMN "ID",
DROP COLUMN "NumCarte",
DROP COLUMN "montant",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "stripeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "DateDebut" SET NOT NULL,
ALTER COLUMN "DateFin" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_stripeId_key" ON "Paiement"("stripeId");
