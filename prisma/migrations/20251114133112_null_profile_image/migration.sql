-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile_image" DROP NOT NULL,
ALTER COLUMN "password_reset_token" DROP NOT NULL,
ALTER COLUMN "password_token_expiry" DROP NOT NULL;
