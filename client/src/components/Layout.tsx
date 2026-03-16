import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, CreditCard, ArrowLeftRight, Send, LogOut, Bell, User } from 'lucide-react';
import { useAuth } from '../App';

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/accounts', icon: CreditCard, label: 'Accounts' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { to: '/transfer', icon: Send, label: 'Transfer' }
  ];

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <aside className="w-64 bg-bg-secondary border-r border-border p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">BankFlow</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-bg-tertiary'}`
            }>
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-8">
          <div className="text-gray-400 text-sm">Welcome back, <span className="text-white">{user?.name}</span></div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white"><Bell size={20} /></button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User size={16} className="text-black" />
              </div>
            </div>
          </div>
        </header>
        <div className="p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}