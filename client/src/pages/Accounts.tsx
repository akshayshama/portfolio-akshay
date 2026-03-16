import { useEffect, useState } from 'react';
import { Plus, Wallet, PiggyBank, CreditCard as CreditCardIcon } from 'lucide-react';
import { API_URL } from '../config';

export default function Accounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState('CHECKING');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/accounts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setAccounts);
  }, []);

  const createAccount = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: newType })
    });
    if (res.ok) {
      const updated = await fetch(`${API_URL}/api/accounts`, { headers: { Authorization: `Bearer ${token}` } });
      setAccounts(await updated.json());
      setShowModal(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const getIcon = (type: string) => {
    switch (type) {
      case 'CHECKING': return Wallet;
      case 'SAVINGS': return PiggyBank;
      case 'CREDIT': return CreditCardIcon;
      default: return Wallet;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Accounts</h2>
          <p className="text-gray-400">Manage your bank accounts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition">
          <Plus size={20} />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => {
          const Icon = getIcon(acc.type);
          return (
            <div key={acc.id} className="bg-bg-secondary p-6 rounded-xl border border-border card-glow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="text-primary" size={24} />
                </div>
                <span className="text-sm text-gray-400">{acc.type}</span>
              </div>
              <div className="text-sm text-gray-400 mb-1">Account Number</div>
              <div className="font-mono text-lg mb-4">{acc.accountNumber}</div>
              <div className="text-sm text-gray-400 mb-1">Balance</div>
              <div className="text-2xl font-bold font-mono">{formatCurrency(acc.balance)}</div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-secondary p-6 rounded-xl border border-border w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Account Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)}
                  className="w-full p-3 bg-bg-tertiary border border-border rounded-lg focus:border-primary outline-none">
                  <option value="CHECKING">Checking Account</option>
                  <option value="SAVINGS">Savings Account</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-border rounded-lg hover:bg-bg-tertiary">Cancel</button>
                <button onClick={createAccount} className="flex-1 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}