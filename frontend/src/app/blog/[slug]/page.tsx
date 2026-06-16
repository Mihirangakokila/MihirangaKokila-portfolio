'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getBlogPost, type BlogPost } from '@/lib/api';

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    getBlogPost(slug)
      .then(setPost)
      .catch(() => setError('Post not found.'));
  }, [slug]);

  if (error) {
    return <p className="px-6 py-12 text-red-400">{error}</p>;
  }

  if (!post) {
    return <p className="px-6 py-12 text-white/50">Loading…</p>;
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <ArrowLeft size={16} /> Back to blog
      </Link>
      <p className="mt-8 text-xs uppercase tracking-wider text-indigo-400">
        {post.category || 'Article'} · {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-4 text-lg text-white/60">{post.summary}</p>
      <div className="prose prose-invert mt-10 max-w-none whitespace-pre-wrap text-white/80">
        {post.content}
      </div>
    </article>
  );
}
