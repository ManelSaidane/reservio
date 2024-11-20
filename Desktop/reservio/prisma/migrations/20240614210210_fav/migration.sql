/*
  Warnings:

  - You are about to drop the column `clientId` on the `Favoris` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Favoris` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Favoris" DROP CONSTRAINT "Favoris_clientId_fkey";

-- AlterTable
ALTER TABLE "Favoris" DROP COLUMN "clientId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Favoris" ADD CONSTRAINT "Favoris_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
