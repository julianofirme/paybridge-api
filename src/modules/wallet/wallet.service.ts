import { type CurrencyCode, PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../errors/not-found-error.js'
import { BadRequestError } from '../../errors/bad-request-error.js'

const prisma = new PrismaClient();

async function getOrCreateSystemWallet(currencyCode: CurrencyCode) {
  const systemEmail = 'system@paybridge.com';

  // get the system user
  const systemUser = await prisma.user.findUnique({
    where: { email: systemEmail },
  });

  if (!systemUser) {
    throw new Error('System user not found. Please initialize the system user first.');
  }

  let systemWallet = await prisma.wallet.findFirst({
    where: {
      isSystem: true,
      currencyCode,
    },
  });

  if (!systemWallet) {
    systemWallet = await prisma.wallet.create({
      data: {
        userId: systemUser.id,
        currencyCode,
        balance: 1000000000, // 1 billion
        isSystem: true,
        walletType: 'SYSTEM',
      },
    });
  }

  return systemWallet;
}

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

  // Get or create system wallet for the deposit
  const systemWallet = await getOrCreateSystemWallet(currencyCode);

  const result = await prisma.$transaction(async (tx) => {
    // Create transfer record
    const transfer = await tx.transfer.create({
      data: {
        sourceWalletId: systemWallet.id,
        destinationWalletId: walletId,
        amount,
        currencyCode,
        status: 'COMPLETED',
        reason: 'Deposit',
      }
    });

    // Update destination wallet balance
    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: { increment: amount }
      }
    });

    // Create ledger entries
    await tx.ledger.create({
      data: {
        walletId: systemWallet.id,
        transferId: transfer.id,
        currencyCode,
        amount: -amount, // Debit from system wallet
        type: 'system_deposit_out'
      }
    });

    await tx.ledger.create({
      data: {
        walletId,
        transferId: transfer.id,
        currencyCode,
        amount, // Credit to user wallet
        type: 'deposit_in'
      }
    });

    return {
      wallet: updatedWallet,
      transfer
    };
  });

  return result;
}
