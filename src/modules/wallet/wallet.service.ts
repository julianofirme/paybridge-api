import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../errors/not-found-error.js'
import { BadRequestError } from '../../errors/bad-request-error.js'

const prisma = new PrismaClient();

export async function deposit(walletId: string, amount: number, currencyCode: string = 'BRL') {
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId }
  });

  if (!wallet) {
    throw new NotFoundError('Wallet not found');
  }

  if (wallet.currencyCode !== currencyCode) {
    throw new BadRequestError('Currency mismatch');
  }

  const updatedWallet = await prisma.$transaction(async (tx) => {
    // Update wallet balance
    const wallet = await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: { increment: amount }
      }
    });

    // Create ledger entry
    await tx.ledger.create({
      data: {
        walletId,
        amount,
        currencyCode,
        type: 'deposit',
        transferId: '', // Since this is a direct deposit, no transfer is involved
      }
    });

    return wallet;
  });

  return updatedWallet;
}
