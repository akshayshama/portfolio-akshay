import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, CreditCard, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { API_URL } from '../config';

const mockData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 5000, expense: 2800 },
  { name: 'Apr', income: 4500, expense: 2000 },
  { name: 'May', income: 6000, expense: 3200 },
  { name: 'Jun', income: 5500, expense: 2100 }
];

export default function Dashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const [accountsRes, txRes] = await Promise.all([
        fetch(`${API_URL}/api/accounts`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/transactions`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAccounts(await accountsRes.json());
      setTransactions(await txRes.json());
    };
    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTx = transactions.slice(0, 5);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-400">Overview of your finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-secondary p-6 rounded-xl border border-border card-glow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Total Balance</span>
            <CreditCard className="text-primary" size={24} />
          </div>
          <div className="text-2xl font-bold font-mono">{formatCurrency(totalBalance)}</div>
        </div>
        <div className="bg-bg-secondary p-6 rounded-xl border border-border card-glow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Monthly Income</span>
            <ArrowUpRight className="text-green-400" size={24} />
          </div>
          <div className="text-2xl font-bold font-mono text-green-400">{formatCurrency(5500)}</div>
        </div>
        <div className="bg-bg-secondary p-6 rounded-xl border border-border card-glow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Monthly Expenses</span>
            <ArrowDownRight className="text-red-400" size={24} />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">{formatCurrency(2100)}</div>
        </div>
        <div className="bg-bg-secondary p-6 rounded-xl border border-border card-glow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Accounts</span>
            <TrendingUp className="text-secondary" size={24} />
          </div>
          <div className="text-2xl font-bold">{accounts.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary p-6 rounded-xl border border-border">
          <h3 className="text-lg font-bold mb-6">Monthly Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#00d4aa" fill="#00d4aa33" />
                <Area type="monotone" dataKey="expense" stackId="2" stroke="#ef4444" fill="#ef444433" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl border border-border">
          <h3 className="text-lg font-bold mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTx.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                <div>
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-sm text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</div>
                </div>
                <div className={`font-mono font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}