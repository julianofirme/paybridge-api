import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const userCore = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  name: z.string(),
  document: z.string(),
}

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const createUserResponseSchema = z.object({
  id: z.string(),
  ...userCore,
  walletId: z.string(),
})

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const loginResponseSchema = z.object({
  token: z.string(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>

export const models = {
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
}

export const { schemas: userSchemas, $ref } = buildJsonSchemas(models, {
  $id: 'User',
})
