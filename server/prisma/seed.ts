import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@bankflow.com' },
    update: {},
    create: {
      email: 'demo@bankflow.com',
      password,
      name: 'Demo User',
      accounts: {
        create: [
          {
            type: 'CHECKING',
            balance: 5432.50,
            accountNumber: '1234567890'
          },
          {
            type: 'SAVINGS',
            balance: 12500.00,
            accountNumber: '0987654321'
          }
        ]
      }
    }
  });

  const checkingAccount = await prisma.account.findFirst({
    where: { userId: user.id, type: 'CHECKING' }
  });

  if (checkingAccount) {
    await prisma.transaction.createMany({
      data: [
        {
          accountId: checkingAccount.id,
          type: 'DEPOSIT',
          amount: 2500.00,
          description: 'Salary Deposit'
        },
        {
          accountId: checkingAccount.id,
          type: 'PAYMENT',
          amount: -125.50,
          description: 'Electric Bill'
        },
        {
          accountId: checkingAccount.id,
          type: 'WITHDRAWAL',
          amount: -200.00,
          description: 'ATM Withdrawal'
        },
        {
          accountId: checkingAccount.id,
          type: 'PAYMENT',
          amount: -89.99,
          description: 'Netflix Subscription'
        },
        {
          accountId: checkingAccount.id,
          type: 'TRANSFER_IN',
          amount: 500.00,
          description: 'Transfer from Savings'
        }
      ]
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });