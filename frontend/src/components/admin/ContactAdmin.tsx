'use client';

import { useCallback, useEffect, useState } from 'react';
import { getContactMessages, markContactRead, type ContactMessage } from '@/lib/api';

export default function ContactAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setMessages(await getContactMessages());
    } catch {
      setError('Could not load contact messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleMarkRead(id: string) {
    try {
      await markContactRead(id);
      await load();
    } catch {
      setError('Failed to mark message as read.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contact Messages</h2>
        <button
          onClick={load}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <p className="text-white/50">Loading messages…</p>}

      {!loading && messages.length === 0 && (
        <p className="text-white/50">No contact messages yet.</p>
      )}

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`glass rounded-2xl p-5 ${
              msg.status === 'UNREAD' ? 'border-indigo-400/30' : ''
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{msg.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      msg.status === 'UNREAD'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/55">{msg.email}</p>
                <p className="mt-2 font-medium text-white/80">{msg.subject}</p>
              </div>
              <p className="text-xs text-white/35">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-white/60">{msg.message}</p>
            {msg.status === 'UNREAD' && (
              <button
                onClick={() => handleMarkRead(msg.id)}
                className="mt-4 rounded-full bg-indigo-500/20 px-4 py-1.5 text-sm text-indigo-300 hover:bg-indigo-500/30"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
