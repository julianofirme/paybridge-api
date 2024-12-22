import { type PrismaClient, type CurrencyCode } from '@prisma/client';
import { NotFoundError } from '../../errors/not-found-error.js';
import { BadRequestError } from '../../errors/bad-request-error.js';

export async function validateWalletOwnership(prisma: PrismaClient, walletId: string, userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });

  if (!wallet || wallet.userId !== userId) {
    throw new BadRequestError('You can only transfer from your own wallet');
  }

  return wallet;
}

export async function validateTransfer(
  prisma: PrismaClient,
  sourceWalletId: string,
  destinationWalletId: string,
  amount: number,
  currencyCode: CurrencyCode
) {
  const [sourceWallet, destinationWallet] = await Promise.all([
    prisma.wallet.findUnique({ where: { id: sourceWalletId } }),
    prisma.wallet.findUnique({ where: { id: destinationWalletId } })
  ]);

  if (!sourceWallet) throw new NotFoundError('Source wallet not found');
  if (!destinationWallet) throw new NotFoundError('Destination wallet not found');

  if (sourceWallet.currencyCode !== currencyCode || destinationWallet.currencyCode !== currencyCode) {
    throw new BadRequestError('Currency mismatch between wallets');
  }

  if (sourceWallet.balance < amount) {
    throw new BadRequestError('Insufficient funds in source wallet');
  }

  if (sourceWallet.isSystem || destinationWallet.isSystem) {
    throw new BadRequestError('Cannot transfer to or from system wallets');
  }

  if (sourceWalletId === destinationWalletId) {
    throw new BadRequestError('Cannot transfer to the same wallet');
  }

  return { sourceWallet, destinationWallet };
}
