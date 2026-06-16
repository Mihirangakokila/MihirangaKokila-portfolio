'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';
import { getProjectsByType, type Project } from '@/lib/api';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'PHOTO', label: 'Photography' },
  { key: 'VIDEO', label: 'Videography' },
  { key: 'SOFTWARE', label: 'Software' },
] as const;

export default function PortfolioClient() {
  const searchParams = useSearchParams();
  const initial = (searchParams?.get('type') as (typeof tabs)[number]['key']) || 'PHOTO';
  const [active, setActive] = useState<(typeof tabs)[number]['key']>(initial);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getProjectsByType(active)
      .then(setProjects)
      .catch(() => setError('Could not load projects. Make sure the API is running.'))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        <span className="text-gradient">Portfolio</span>
      </h1>
      <p className="mt-4 max-w-2xl text-white/60">
        Selected work across photography, film, and software engineering.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium transition',
              active === tab.key
                ? 'bg-indigo-500 text-white'
                : 'border border-white/10 text-white/60 hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-12 text-white/50">Loading projects…</p>}
      {error && <p className="mt-12 text-red-400">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="mt-12 text-white/50">No projects yet in this category.</p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
