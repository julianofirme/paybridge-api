import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { CurrencyCode } from '@prisma/client';

export const createTransferSchema = z.object({
    sourceWalletId: z.string().uuid({
      message: 'Source wallet ID must be a valid UUID',
    }),
    destinationWalletId: z.string().uuid({
      message: 'Destination wallet ID must be a valid UUID',
    }),
    amount: z.number().nonnegative({
      message: 'Amount must be positive',
    }),
    currencyCode: z.nativeEnum(CurrencyCode).default(CurrencyCode.BRL),
    reason: z.string().optional(),
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;

export const models = {
  createTransferSchema,
};

export const { schemas: transferSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'Transfer',
});
