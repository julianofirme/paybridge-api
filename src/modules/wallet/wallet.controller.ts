import type { FastifyReply, FastifyRequest } from 'fastify';
import { deposit } from './wallet.service.js';
import { type DepositInput } from './wallet.schema.js';

export async function handleDeposit(
  request: FastifyRequest<{
    Body: DepositInput;
  }>,
  reply: FastifyReply
) {
  const { walletId, amount, currencyCode } = request.body;

  const wallet = await deposit(walletId, amount, currencyCode);

  return reply.code(200).send({
    message: 'Deposit successful',
    data: {
      wallet
    }
  });
}
