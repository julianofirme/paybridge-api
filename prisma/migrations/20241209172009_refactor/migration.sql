/*
  Warnings:

  - You are about to drop the column `accountType` on the `users` table. All the data in the column will be lost.
  - Added the required column `wallet_type` to the `ledgers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initiated_by` to the `transfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ledgers" ADD COLUMN     "wallet_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transfers" ADD COLUMN     "initiated_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "accountType";

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "merchant_id" TEXT,
ADD COLUMN     "wallet_type" TEXT NOT NULL DEFAULT 'personal',
ALTER COLUMN "currency_code" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
