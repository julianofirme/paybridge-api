import type { FastifyInstance } from 'fastify';
import { handleCreateMerchant } from './merchant.controller.js';
import { $ref } from './merchant.schema.js';
import { auth } from '../../middleware/auth.js';

async function merchantRoutes(app: FastifyInstance) {
  app.register(auth).post(
    '/',
    {
      schema: {
        body: $ref('createMerchantSchema'),
      },
    },
    handleCreateMerchant
  );
}

export default merchantRoutes;
