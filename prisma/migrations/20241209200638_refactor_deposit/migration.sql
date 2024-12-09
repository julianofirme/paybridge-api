/*
  Warnings:

  - You are about to drop the column `initiated_by` on the `transfers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'TRANSFER');

-- AlterTable
ALTER TABLE "transfers" DROP COLUMN "initiated_by";

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "is_system" BOOLEAN NOT NULL DEFAULT false;
