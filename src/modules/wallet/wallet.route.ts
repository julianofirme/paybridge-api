import type { FastifyInstance } from 'fastify';
import { depositSchema } from './wallet.schema.js';
import { handleDeposit } from './wallet.controller.js';


async function walletRoutes(app: FastifyInstance) {
  app.post(
    '/deposit',
    {
      schema: {
        body: depositSchema.shape.body
      }
    },
    handleDeposit
  );
}

export default walletRoutes;
