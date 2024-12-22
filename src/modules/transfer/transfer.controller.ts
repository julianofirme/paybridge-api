import type { CreateTransferInput } from './transfer.schema.js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createTransfer } from './transfer.service.js';
import { validateWalletOwnership } from './transfer.validator.js';

export async function handleCreateTransfer(
  request: FastifyRequest<{
    Body: CreateTransferInput;
  }>,
  reply: FastifyReply
) {
  const { prisma } = request;
  const userId = await request.getCurrentUserId();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await validateWalletOwnership(prisma, request.body.sourceWalletId, userId);

  const result = await createTransfer(request.body);

  return reply.code(201).send({
    message: 'Transfer completed successfully',
    data: result
  });
}
