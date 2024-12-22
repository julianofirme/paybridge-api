import { PrismaClient } from '@prisma/client';
import { validateTransfer } from './transfer.validator.js';
import { checkAuthorization } from '../../services/external/transfer-authorization.service.js';
import { UnauthorizedError } from '../../errors/unauthorized-error.js';
import type { CreateTransferInput } from './transfer.schema.js';
import { RabbitMQPublisher } from '../../queue/rabbitmq.service.js';

const prisma = new PrismaClient();

const publisher = new RabbitMQPublisher('transfer_queue');

export async function createTransfer(transferData: CreateTransferInput) {
  const { sourceWalletId, destinationWalletId, amount, currencyCode } = transferData;

  await validateTransfer(prisma, sourceWalletId, destinationWalletId, amount, currencyCode);

  const isAuthorized = await checkAuthorization();
  if (!isAuthorized) {
    throw new UnauthorizedError('Transfer not authorized');
  }

  await publisher.connect();
  await publisher.publish(transferData);
  await publisher.close();

  return { status: 'Transfer request received' };
}
