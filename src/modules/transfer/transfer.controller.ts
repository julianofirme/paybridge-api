import { type CreateTransferInput } from './transfer.schema.js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createTransfer } from './transfer.service.js';
import { BadRequestError } from '../../errors/bad-request-error.js';

export async function handleCreateTransfer(
  request: FastifyRequest<{
    Body: CreateTransferInput;
  }>,
  reply: FastifyReply
) {
  const { prisma } = request; 
  const userId = await request.getCurrentUserId();

  // Get source wallet to verify ownership
  const sourceWallet = await prisma.wallet.findUnique({
    where: { id: request.body.sourceWalletId }
  });

  // Verify wallet ownership
  if (!sourceWallet || sourceWallet.userId !== userId) {
    throw new BadRequestError('You can only transfer from your own wallet');
  }

  const result = await createTransfer(request.body);

  return reply.code(201).send({
    message: 'Transfer completed successfully',
    data: {
      transfer: result.transfer,
      sourceWallet: result.sourceWallet,
      destinationWallet: result.destinationWallet
    }
  });
}
