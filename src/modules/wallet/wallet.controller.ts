import type { FastifyReply, FastifyRequest } from 'fastify';
import { deposit } from './wallet.service.js';
import type { DepositInput } from './wallet.schema.js';

export async function handleDeposit(
  request: FastifyRequest<{
    Params: { walletId: string };
    Body: DepositInput;
  }>,
  reply: FastifyReply
) {
  const { walletId } = request.params;
  const { amount, currencyCode } = request.body;

  const result = await deposit(walletId, amount, currencyCode);

  return reply.code(200).send({
    message: 'Deposit successful',
    data: {
      wallet: result.wallet,
      transfer: result.transfer
    }
  });
}
