import { type CurrencyCode, PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../errors/not-found-error.js';
import { BadRequestError } from '../../errors/bad-request-error.js';
import type { CreateTransferInput } from './transfer.schema.js';

const prisma = new PrismaClient();

async function validateTransfer(
  sourceWalletId: string,
  destinationWalletId: string,
  amount: number,
  currencyCode: CurrencyCode
) {
  // Get both wallets
  const [sourceWallet, destinationWallet] = await Promise.all([
    prisma.wallet.findUnique({
      where: { id: sourceWalletId },
      include: { user: true }
    }),
    prisma.wallet.findUnique({
      where: { id: destinationWalletId },
      include: { user: true }
    })
  ]);

  // Validate source wallet
  if (!sourceWallet) {
    throw new NotFoundError('Source wallet not found');
  }

  // Validate destination wallet
  if (!destinationWallet) {
    throw new NotFoundError('Destination wallet not found');
  }

  // Validate currency match
  if (sourceWallet.currencyCode !== currencyCode || destinationWallet.currencyCode !== currencyCode) {
    throw new BadRequestError('Currency mismatch between wallets');
  }

  // Validate sufficient funds
  if (sourceWallet.balance < amount) {
    throw new BadRequestError('Insufficient funds in source wallet');
  }

  // Prevent transfers to/from system wallets
  if (sourceWallet.isSystem || destinationWallet.isSystem) {
    throw new BadRequestError('Cannot transfer to or from system wallets');
  }

  // Prevent self-transfers
  if (sourceWalletId === destinationWalletId) {
    throw new BadRequestError('Cannot transfer to the same wallet');
  }

  return {
    sourceWallet,
    destinationWallet
  };
}

export async function createTransfer(transferData: CreateTransferInput) {
  const { sourceWalletId, destinationWalletId, amount, currencyCode, reason } = transferData;

  // Validate transfer before starting transaction
  await validateTransfer(sourceWalletId, destinationWalletId, amount, currencyCode);

  // Execute transfer in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create transfer record
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

    // Update source wallet balance
    const updatedSourceWallet = await tx.wallet.update({
      where: { id: sourceWalletId },
      data: {
        balance: { decrement: amount }
      },
      include: { user: true }
    });

    // Update destination wallet balance
    const updatedDestinationWallet = await tx.wallet.update({
      where: { id: destinationWalletId },
      data: {
        balance: { increment: amount }
      },
      include: { user: true }
    });

    // Create ledger entries
    await tx.ledger.create({
      data: {
        walletId: sourceWalletId,
        transferId: transfer.id,
        amount: -amount, // Debit from source wallet
        type: 'transfer_out',
        currencyCode
      }
    });

    await tx.ledger.create({
      data: {
        walletId: destinationWalletId,
        transferId: transfer.id,
        amount, // Credit to destination wallet
        type: 'transfer_in',
        currencyCode
      }
    });

    return {
      transfer,
      sourceWallet: updatedSourceWallet,
      destinationWallet: updatedDestinationWallet
    };
  });

  return result;
}
