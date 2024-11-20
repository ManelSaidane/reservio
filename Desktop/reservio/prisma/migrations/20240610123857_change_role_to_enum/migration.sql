/*
  Warnings:

  - Changed the type of `Role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT', 'SERVICE_PROVIDER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Role",
ADD COLUMN     "Role" "Role" NOT NULL;
