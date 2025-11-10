/*
  Warnings:

  - You are about to drop the column `password_reset_expiry` on the `User` table. All the data in the column will be lost.
  - Added the required column `password_token_expiry` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_reset_expiry",
ADD COLUMN     "password_token_expiry" TIMESTAMP(3) NOT NULL;
