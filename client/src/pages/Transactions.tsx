import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { API_URL } from '../config';

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/transactions`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setTransactions);
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || tx.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': case 'TRANSFER_IN': return 'text-green-400';
      case 'WITHDRAWAL': case 'TRANSFER_OUT': case 'PAYMENT': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Transactions</h2>
        <p className="text-gray-400">View your transaction history</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 p-3 bg-bg-secondary border border-border rounded-lg focus:border-primary outline-none" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="pl-10 pr-8 p-3 bg-bg-secondary border border-border rounded-lg focus:border-primary outline-none appearance-none">
            <option value="">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="TRANSFER_IN">Transfer In</option>
            <option value="TRANSFER_OUT">Transfer Out</option>
            <option value="PAYMENT">Payment</option>
          </select>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-gray-400 font-medium">Date</th>
              <th className="text-left p-4 text-gray-400 font-medium">Description</th>
              <th className="text-left p-4 text-gray-400 font-medium">Type</th>
              <th className="text-right p-4 text-gray-400 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx.id} className="border-b border-border/50 hover:bg-bg-tertiary/50">
                <td className="p-4 text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{tx.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(tx.type)} bg-bg-tertiary`}>
                    {tx.type.replace('_', ' ')}
                  </span>
                </td>
                <td className={`p-4 text-right font-mono font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">No transactions found</div>
        )}
      </div>
    </div>
  );
}