import type { FastifyInstance } from 'fastify';
import { handleCreateTransfer } from './transfer.controller.js';
import { $ref } from './transfer.schema.js';
import { auth } from '../../middleware/auth.js';

async function transferRoutes(app: FastifyInstance) {
  app.register(auth).post(
    '/send',
    {
      schema: {
        body: $ref('createTransferSchema'),
      },
    },
    handleCreateTransfer
  );
}

export default transferRoutes;
