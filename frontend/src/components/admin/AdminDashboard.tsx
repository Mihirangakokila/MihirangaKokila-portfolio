'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import BlogAdmin from './BlogAdmin';
import ContactAdmin from './ContactAdmin';
import PortfolioAdmin from './PortfolioAdmin';

const tabs = [
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Messages' },
] as const;

type TabId = (typeof tabs)[number]['id'];

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('portfolio');

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-gradient">Admin</span>
          </h1>
          <p className="mt-2 text-white/60">Manage portfolio, blog, and contact messages.</p>
        </div>
        <button
          onClick={onLogout}
          className="rounded-full border border-white/15 px-6 py-2 text-sm text-white/70 hover:text-white"
        >
          Logout
        </button>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium transition',
              activeTab === tab.id
                ? 'bg-indigo-500 text-white'
                : 'border border-white/10 text-white/60 hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {activeTab === 'portfolio' && <PortfolioAdmin />}
        {activeTab === 'blog' && <BlogAdmin />}
        {activeTab === 'contact' && <ContactAdmin />}
      </div>
    </div>
  );
}
