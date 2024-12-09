import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeSystemUser() {
  const systemEmail = 'system@paybridge.com';

  let systemUser = await prisma.user.findUnique({
    where: { email: systemEmail },
  });

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: systemEmail,
        name: 'System User',
        document: '00000000000',
        passwordHash: 'system',
        salt: 'staticSalt',
      },
    });
  }

  return systemUser.id;
}

initializeSystemUser()
  .then((id) => {
    console.log(`System user ID: ${id}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error initializing system user:', error);
    process.exit(1);
  });
