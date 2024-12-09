/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fastify from 'fastify'
import fjwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import 'dotenv/config'
import userRoutes from './modules/user/user.route.js'
import walletRoutes from './modules/wallet/wallet.route.js'
import merchantRoutes from './modules/merchant/merchant.route.js'
import transferRoutes from './modules/transfer/transfer.route.js'
import { walletSchema } from './modules/wallet/wallet.schema.js'
import { merchantSchemas } from './modules/merchant/merchant.schema.js'
import { transferSchemas } from './modules/transfer/transfer.schema.js'
import { userSchemas } from './modules/user/user.schema.js'
import { errorHandler } from './utils/error-handler.js'
import fastifyHelmet from '@fastify/helmet'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client';

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
})
app.setErrorHandler(errorHandler)

app.register(fjwt, {
  secret: process.env.JWT_SECRET!,
})

app.register(fastifyCors, {
  origin: '*',
  credentials: true,
})

app.register(fastifyHelmet, { global: true })

const prisma = new PrismaClient();
app.addHook('onRequest', (request, reply, done) => {
  request.prisma = prisma; // Attach the Prisma client to the request
  done();
});

app.get('/healthcheck', async function () {
  return {
    status: 'ok',
  }
})

app.register(userRoutes)
app.register(walletRoutes)
app.register(merchantRoutes, { prefix: '/merchants' })
app.register(transferRoutes, { prefix: '/transfers' })

app.register(fastifySwagger, {})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  staticCSP: false,
  transformStaticCSP: (header: any) => header,
})

app.ready((err) => {
  if (err) throw err
  app.swagger()
})

for (const schema of [
  ...userSchemas,
  ...walletSchema,
  ...merchantSchemas,
  ...transferSchemas
]) {
  app.addSchema(schema)
}

export default app
