import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'bankflow-secret-key-2024';

app.use(cors());
app.use(express.json());

const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = (decoded as any).userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    const checkingAccount = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'CHECKING',
        balance: 0,
        accountNumber: Math.random().toString().slice(2, 12)
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/profile', authenticate, async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, createdAt: true }
  });
  res.json(user);
});

app.get('/api/accounts', authenticate, async (req: any, res) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.userId },
    include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } }
  });
  res.json(accounts);
});

app.post('/api/accounts', authenticate, async (req: any, res) => {
  const { type } = req.body;
  const account = await prisma.account.create({
    data: {
      userId: req.userId,
      type,
      balance: 0,
      accountNumber: Math.random().toString().slice(2, 12)
    }
  });
  res.json(account);
});

app.get('/api/accounts/:id', authenticate, async (req: any, res) => {
  const account = await prisma.account.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: { transactions: { orderBy: { createdAt: 'desc' } } }
  });
  if (!account) return res.status(404).json({ error: 'Account not found' });
  res.json(account);
});

app.get('/api/transactions', authenticate, async (req: any, res) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.userId },
    select: { id: true }
  });
  const accountIds = accounts.map(a => a.id);

  const transactions = await prisma.transaction.findMany({
    where: { accountId: { in: accountIds } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(transactions);
});

app.post('/api/transfers', authenticate, async (req: any, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;

  const fromAccount = await prisma.account.findFirst({
    where: { id: fromAccountId, userId: req.userId }
  });
  if (!fromAccount) return res.status(404).json({ error: 'Source account not found' });
  if (fromAccount.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  const toAccount = await prisma.account.findUnique({ where: { id: toAccountId } });
  if (!toAccount) return res.status(404).json({ error: 'Destination account not found' });

  await prisma.$transaction([
    prisma.account.update({ where: { id: fromAccountId }, data: { balance: { decrement: amount } } }),
    prisma.account.update({ where: { id: toAccountId }, data: { balance: { increment: amount } } }),
    prisma.transaction.create({ data: { accountId: fromAccountId, type: 'TRANSFER_OUT', amount: -amount, description } }),
    prisma.transaction.create({ data: { accountId: toAccountId, type: 'TRANSFER_IN', amount, description } })
  ]);

  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));