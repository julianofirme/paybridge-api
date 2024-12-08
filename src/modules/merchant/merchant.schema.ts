import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

export const createMerchantSchema = z.object({
  body: z.object({
    businessName: z.string({
      required_error: 'Business name is required',
    }),
    businessAddress: z.string().optional(),
    contactPhone: z.string().optional(),
    taxIdentification: z.string({
      required_error: 'Tax identification is required',
    }),
    industryType: z.string().optional(),
    accountManager: z.string().optional(),
  }),
});

export type CreateMerchantInput = z.TypeOf<typeof createMerchantSchema>['body'];

export const models = {
  createMerchantSchema,
};

export const { schemas: merchantSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'Merchant',
});
