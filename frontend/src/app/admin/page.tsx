'use client';

import { FormEvent, useEffect, useState } from 'react';
import { login, setAuthToken } from '@/lib/api';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mk_token');
    if (saved) {
      setToken(saved);
      setAuthToken(saved);
    }
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(username, password);
      localStorage.setItem('mk_token', data.token);
      setAuthToken(data.token);
      setToken(data.token);
    } catch {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('mk_token');
    setAuthToken(null);
    setToken(null);
  }

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight">
        <span className="text-gradient">Admin</span>
      </h1>
      <p className="mt-4 text-white/60">Sign in to manage portfolio content via the API.</p>

      {token ? (
        <div className="glass mt-10 rounded-2xl p-6">
          <p className="text-sm text-emerald-400">Authenticated successfully.</p>
          <p className="mt-2 text-xs text-white/40 break-all">Token: {token.slice(0, 40)}…</p>
          <p className="mt-4 text-sm text-white/55">
            Use this token in API requests to create projects, blog posts, and manage contact messages.
          </p>
          <button
            onClick={logout}
            className="mt-6 rounded-full border border-white/15 px-6 py-2 text-sm text-white/70 hover:text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="glass mt-10 space-y-4 rounded-2xl p-6">
          <label className="block">
            <span className="text-sm text-white/60">Username</span>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/60">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-indigo-500 py-3 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <p className="text-xs text-white/35">Default: mihiranga / admin123</p>
        </form>
      )}
    </section>
  );
}
