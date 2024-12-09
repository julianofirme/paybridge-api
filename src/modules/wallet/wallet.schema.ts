import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod'

export const depositSchema = z.object({
  amount: z.number().nonnegative('Amount must be non-negative'),
  walletId: z.string().uuid('Invalid wallet ID'),
  currencyCode: z.string().default('BRL')
});

export type DepositInput = z.infer<typeof depositSchema>

export const models = {
  depositSchema,
}

export const { schemas: walletSchema, $ref } = buildJsonSchemas(models, {
  $id: 'Wallet',
})
