'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
  type Project,
  type ProjectInput,
} from '@/lib/api';

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400';

function getErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
}

const emptyForm: ProjectInput = {
  title: '',
  description: '',
  type: 'PHOTO',
  category: '',
  tags: [],
  githubLink: '',
  demoLink: '',
  mediaUrl: '',
};

export default function PortfolioAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [tagsInput, setTagsInput] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProjects(await getAllProjects());
    } catch {
      setError('Could not load projects.');
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
    setMediaFile(null);
    setEditingId(null);
    setShowForm(false);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      type: project.type,
      category: project.category,
      tags: project.tags ?? [],
      githubLink: project.githubLink ?? '',
      demoLink: project.demoLink ?? '',
      mediaUrl: project.mediaUrl ?? '',
    });
    setTagsInput((project.tags ?? []).join(', '));
    setMediaFile(null);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const payload: ProjectInput = {
      ...form,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      mediaUrl: form.mediaUrl?.trim() || undefined,
    };
    try {
      if (editingId) {
        await updateProject(editingId, payload, mediaFile ?? undefined);
        setSuccess('Project updated.');
      } else {
        await createProject(payload, mediaFile ?? undefined);
        setSuccess('Project created.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save project.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    setError('');
    try {
      await deleteProject(id);
      setSuccess('Project deleted.');
      if (editingId === id) resetForm();
      await load();
    } catch {
      setError('Failed to delete project.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Portfolio Projects</h2>
        <button
          onClick={startCreate}
          className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          + New Project
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-emerald-400">{success}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6">
          <p className="text-sm font-medium text-white/80">
            {editingId ? 'Edit Project' : 'New Project'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm text-white/60">Title</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-white/60">Description</span>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Type</span>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as ProjectInput['type'] })
                }
                className={inputClass}
              >
                <option value="PHOTO">Photography</option>
                <option value="VIDEO">Videography</option>
                <option value="SOFTWARE">Software</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Category</span>
              <input
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
                placeholder="e.g. Landscape, React Apps"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-white/60">Tags (comma-separated)</span>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className={inputClass}
                placeholder="react, typescript, design"
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/60">GitHub Link</span>
              <input
                value={form.githubLink}
                onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Demo Link</span>
              <input
                value={form.demoLink}
                onChange={(e) => setForm({ ...form, demoLink: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-white/60">Media URL (image or video link)</span>
              <input
                value={form.mediaUrl ?? ''}
                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                className={inputClass}
                placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
              />
              <p className="mt-1 text-xs text-white/35">
                Paste a direct URL, or upload a file below (stored locally when Cloudinary is not configured).
              </p>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-white/60">
                Upload media file {editingId ? '(optional — leave empty to keep current)' : '(optional)'}
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                className="mt-2 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-sm file:text-white"
              />
            </label>
          </div>
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

      {loading && <p className="text-white/50">Loading projects…</p>}

      {!loading && projects.length === 0 && (
        <p className="text-white/50">No projects yet. Create your first one above.</p>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{project.title}</p>
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
                  {project.type}
                </span>
                <span className="text-xs text-white/40">{project.category}</span>
              </div>
              <p className="mt-1 truncate text-sm text-white/55">{project.description}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(project)}
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70 hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
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
