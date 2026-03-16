import { API_URL } from './config';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  return response;
}

export async function getAccounts() {
  const res = await apiCall('/api/accounts');
  return res.json();
}

export async function getTransactions() {
  const res = await apiCall('/api/transactions');
  return res.json();
}