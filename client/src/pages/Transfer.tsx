import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { API_URL } from '../config';

export default function Transfer() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/accounts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setAccounts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fromAccount || !toAccount || !amount || !description) {
      setError('Please fill all fields');
      return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: parseFloat(amount),
        description
      })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setSuccess('Transfer completed successfully!');
      setAmount('');
      setDescription('');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Transfer Money</h2>
        <p className="text-gray-400">Send money between accounts</p>
      </div>

      <div className="bg-bg-secondary p-8 rounded-xl border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-500/10 text-green-400 rounded-lg text-sm">{success}</div>}

          <div>
            <label className="block text-sm text-gray-400 mb-2">From Account</label>
            <select value={fromAccount} onChange={e => setFromAccount(e.target.value)}
              className="w-full p-3 bg-bg-tertiary border border-border rounded-lg focus:border-primary outline-none">
              <option value="">Select source account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.type} - {acc.accountNumber} (${acc.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">To Account</label>
            <select value={toAccount} onChange={e => setToAccount(e.target.value)}
              className="w-full p-3 bg-bg-tertiary border border-border rounded-lg focus:border-primary outline-none">
              <option value="">Select destination account</option>
              {accounts.filter(a => a.id !== fromAccount).map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.type} - {acc.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount</label>
            <input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full p-3 bg-bg-tertiary border border-border rounded-lg focus:border-primary outline-none font-mono" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              className="w-full p-3 bg-bg-tertiary border border-border rounded-lg focus:border-primary outline-none" />
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition">
            <Send size={20} />
            Transfer Money
          </button>
        </form>
      </div>
    </div>
  );
}