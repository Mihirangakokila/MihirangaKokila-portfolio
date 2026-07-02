'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  createBlogPost,
  deleteBlogPost,
  getAllBlogPosts,
  updateBlogPost,
  type BlogInput,
  type BlogPost,
} from '@/lib/api';

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400';

const emptyForm: BlogInput = {
  title: '',
  summary: '',
  content: '',
  coverImageUrl: '',
  category: '',
  tags: [],
  isPublished: false,
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogInput>(emptyForm);
  const [tagsInput, setTagsInput] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPosts(await getAllBlogPosts());
    } catch {
      setError('Could not load blog posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm(emptyForm);
    setTagsInput('');
    setEditingId(null);
    setShowForm(false);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      summary: post.summary,
      content: post.content,
      coverImageUrl: post.coverImageUrl ?? '',
      category: post.category ?? '',
      tags: post.tags ?? [],
      isPublished: post.isPublished,
    });
    setTagsInput((post.tags ?? []).join(', '));
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const payload: BlogInput = {
      ...form,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await updateBlogPost(editingId, payload);
        setSuccess('Post updated.');
      } else {
        await createBlogPost(payload);
        setSuccess('Post created.');
      }
      resetForm();
      await load();
    } catch {
      setError('Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this blog post?')) return;
    setError('');
    try {
      await deleteBlogPost(id);
      setSuccess('Post deleted.');
      if (editingId === id) resetForm();
      await load();
    } catch {
      setError('Failed to delete post.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Blog Posts</h2>
        <button
          onClick={startCreate}
          className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          + New Post
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-emerald-400">{success}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6">
          <p className="text-sm font-medium text-white/80">
            {editingId ? 'Edit Post' : 'New Post'}
          </p>
          <label className="block">
            <span className="text-sm text-white/60">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/60">Summary</span>
            <textarea
              required
              rows={2}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/60">Content (Markdown)</span>
            <textarea
              required
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={`${inputClass} font-mono text-sm`}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm text-white/60">Category</span>
              <input
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Cover Image URL</span>
              <input
                value={form.coverImageUrl}
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-white/60">Tags (comma-separated)</span>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-indigo-500"
            />
            <span className="text-sm text-white/60">Publish immediately</span>
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-indigo-500 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/15 px-6 py-2 text-sm text-white/70 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-white/50">Loading posts…</p>}

      {!loading && posts.length === 0 && (
        <p className="text-white/50">No blog posts yet. Create your first one above.</p>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{post.title}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    post.isPublished
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-white/55">{post.summary}</p>
              <p className="mt-1 text-xs text-white/35">/{post.slug}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(post)}
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70 hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="rounded-full border border-red-400/30 px-4 py-1.5 text-sm text-red-400 hover:bg-red-400/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
