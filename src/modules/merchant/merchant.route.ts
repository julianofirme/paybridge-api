import type { FastifyInstance } from 'fastify';
import { handleCreateMerchant } from './merchant.controller.js';
import { $ref } from './merchant.schema.js';

async function merchantRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: {
        body: $ref('createMerchantSchema'),
      },
      onRequest: [app.authenticate]
    },
    handleCreateMerchant
  );
}

export default merchantRoutes;
