import type { FastifyInstance } from 'fastify';
import { $ref } from './wallet.schema.js';
import { handleDeposit } from './wallet.controller.js';
import { auth } from '../../middleware/auth.js';


async function walletRoutes(app: FastifyInstance) {
  app.register(auth).post(
    '/deposit',
    {
      schema: {
        body: $ref('depositSchema'),
      }
    },
    handleDeposit
  );
}

export default walletRoutes;
