import type { FastifyReply, FastifyRequest } from 'fastify';
import { createMerchant } from './merchant.service.js';
import type { CreateMerchantInput } from './merchant.schema.js';

export async function handleCreateMerchant(
  request: FastifyRequest<{
    Body: CreateMerchantInput;
  }>,
  reply: FastifyReply
) {
  // Get the authenticated user's ID from the request
  const userId = request.user.id;

  const merchant = await createMerchant(userId, request.body);

  return reply.code(201).send({
    message: 'Merchant account created successfully',
    data: {
      merchant
    }
  });
}
