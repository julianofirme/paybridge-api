import { type PrismaClient, type CurrencyCode } from '@prisma/client';

export async function executeTransferTransaction(
  prisma: PrismaClient,
  sourceWalletId: string,
  destinationWalletId: string,
  amount: number,
  currencyCode: CurrencyCode,
  reason: string
) {
  return prisma.$transaction(async (tx) => {
    const transfer = await tx.transfer.create({
      data: {
        sourceWalletId,
        destinationWalletId,
        amount,
        currencyCode,
        status: 'COMPLETED',
        reason: reason ?? 'User transfer'
      }
    });

    const updatedSourceWallet = await tx.wallet.update({
      where: { id: sourceWalletId },
      data: { balance: { decrement: amount } }
    });

    const updatedDestinationWallet = await tx.wallet.update({
      where: { id: destinationWalletId },
      data: { balance: { increment: amount } }
    });

    await tx.ledger.createMany({
      data: [
        {
          walletId: sourceWalletId,
          transferId: transfer.id,
          amount: -amount,
          type: 'transfer_out',
          currencyCode
        },
        {
          walletId: destinationWalletId,
          transferId: transfer.id,
          amount,
          type: 'transfer_in',
          currencyCode
        }
      ]
    });

    return { transfer, updatedSourceWallet, updatedDestinationWallet };
  });
}
