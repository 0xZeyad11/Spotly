/*
  Warnings:

  - Changed the type of `user_type` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('REGULAR', 'FAMOUS', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_type",
ADD COLUMN     "user_type" "ROLE" NOT NULL;

-- DropEnum
DROP TYPE "role";
