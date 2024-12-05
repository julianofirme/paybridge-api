import { BadRequestError } from '../../errors/bad-request-error.js'
import { db } from '../../lib/prisma.js'
import { Prisma } from '@prisma/client'
import { hashPassword } from '../../utils/hash.js'
import { type CreateUserInput } from './user.schema.js'

export async function createUserWithWalletService(input: CreateUserInput) {
  const { password, ...rest } = input
  const { hash, salt } = hashPassword(password)

  return await db.$transaction(async (transaction) => {
    try {
      const user = await transaction.user.create({
        data: { ...rest, salt, passwordHash: hash },
      })

      const wallet = await transaction.wallet.create({
        data: {
          userId: user.id,
          currencyCode: 'BRL',
          balance: 0,
        },
      })

      return { user, wallet }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestError('Email or document already registered')
        }
      }
      throw e
    }
  })
}

export async function findUserByEmailService(email: string) {
  return db.user.findUnique({
    where: { email },
  })
}

export async function findUserByIdService(id: string) {
  return db.user.findUnique({
    where: { id },
  })
}
