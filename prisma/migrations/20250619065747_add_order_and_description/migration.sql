-- AlterTable
ALTER TABLE "Pricing" ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" INTEGER,
ALTER COLUMN "price" SET DATA TYPE TEXT;
