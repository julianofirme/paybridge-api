import { PrismaClient } from '@prisma/client';
import { validateTransfer } from './transfer.validator.js';
import { executeTransferTransaction } from './transfer.handler.js';
import { checkAuthorization } from '../../services/external/transfer-authorization.service.js';
import { UnauthorizedError } from '../../errors/unauthorized-error.js';
import type { CreateTransferInput } from './transfer.schema.js';

const prisma = new PrismaClient();

export async function createTransfer(transferData: CreateTransferInput) {
  const { sourceWalletId, destinationWalletId, amount, currencyCode, reason } = transferData;

  await validateTransfer(prisma, sourceWalletId, destinationWalletId, amount, currencyCode);

  const isAuthorized = await checkAuthorization();
  if (!isAuthorized) {
    throw new UnauthorizedError('Transfer not authorized');
  }

  return executeTransferTransaction(prisma, sourceWalletId, destinationWalletId, amount, currencyCode, reason ?? 'User transfer');
}
