'use client';

import { FormEvent, useState } from 'react';
import { submitContact } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        <span className="text-gradient">Contact</span>
      </h1>
      <p className="mt-4 text-white/60">
        Have a project in mind or want to collaborate? Send a message.
      </p>

      <form onSubmit={handleSubmit} className="mt-12 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-white/60">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/60">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-sm text-white/60">Subject</span>
          <input
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400"
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/60">Message</span>
          <textarea
            required
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400"
          />
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-indigo-500 px-8 py-3 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </button>

        {status === 'success' && (
          <p className="text-sm text-emerald-400">Message sent successfully!</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400">Failed to send. Please try again later.</p>
        )}
      </form>
    </section>
  );
}
