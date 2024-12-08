import { PrismaClient } from '@prisma/client';
import { BadRequestError } from '../../errors/bad-request-error.js';
import { NotFoundError } from '../../errors/not-found-error.js';
import type { CreateMerchantInput } from './merchant.schema.js';

const prisma = new PrismaClient();

export async function createMerchant(userId: string, merchantData: CreateMerchantInput) {
  // Check if user exists and is eligible for merchant account
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { Merchant: true }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.Merchant) {
    throw new BadRequestError('User already has a merchant account');
  }

  if (user.accountType !== 'PJ') {
    throw new BadRequestError('Only PJ accounts can create merchant profiles');
  }

  // Create merchant account
  const merchant = await prisma.merchant.create({
    data: {
      userId,
      ...merchantData
    }
  });

  return merchant;
}
