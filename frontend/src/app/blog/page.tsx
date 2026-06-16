'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBlogPosts, type BlogPost } from '@/lib/api';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch(() => setError('Could not load blog posts.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        <span className="text-gradient">Blog</span>
      </h1>
      <p className="mt-4 text-white/60">Thoughts on craft, code, and creative work.</p>

      {loading && <p className="mt-12 text-white/50">Loading posts…</p>}
      {error && <p className="mt-12 text-red-400">{error}</p>}

      <div className="mt-12 space-y-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="glass block rounded-2xl p-6 transition hover:border-indigo-400/30"
          >
            <p className="text-xs uppercase tracking-wider text-indigo-400">
              {post.category || 'Article'} · {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-white/55">{post.summary}</p>
          </Link>
        ))}
      </div>

      {!loading && !error && posts.length === 0 && (
        <p className="mt-12 text-white/50">No published posts yet.</p>
      )}
    </section>
  );
}
