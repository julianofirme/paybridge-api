import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod'

export const depositSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    walletId: z.string().uuid('Invalid wallet ID'),
    currencyCode: z.string().default('BRL')
  })
});

export type DepositInput = z.TypeOf<typeof depositSchema>['body'];

export const models = {
  depositSchema,
}

export const { schemas: walletSchema, $ref } = buildJsonSchemas(models, {
  $id: 'Wallet',
})
