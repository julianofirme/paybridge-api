/*
  Warnings:

  - You are about to drop the column `wallet_type` on the `ledgers` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `transfers` table. All the data in the column will be lost.
  - The `status` column on the `transfers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `wallet_type` column on the `wallets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `currency_code` to the `ledgers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency_code` to the `transfers` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `currency_code` on the `wallets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('PERSONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('BRL', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "ledgers" DROP COLUMN "wallet_type",
ADD COLUMN     "currency_code" "CurrencyCode" NOT NULL;

-- AlterTable
ALTER TABLE "transfers" DROP COLUMN "currency",
ADD COLUMN     "currency_code" "CurrencyCode" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TransferStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "currency_code",
ADD COLUMN     "currency_code" "CurrencyCode" NOT NULL,
DROP COLUMN "wallet_type",
ADD COLUMN     "wallet_type" "WalletType" NOT NULL DEFAULT 'PERSONAL';
