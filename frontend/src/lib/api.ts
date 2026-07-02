import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'PHOTO' | 'VIDEO' | 'SOFTWARE';
  category: string;
  mediaUrl?: string;
  tags?: string[];
  githubLink?: string;
  demoLink?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl?: string;
  category?: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  type: 'PHOTO' | 'VIDEO' | 'SOFTWARE';
  category: string;
  tags?: string[];
  githubLink?: string;
  demoLink?: string;
  mediaUrl?: string;
}

export interface BlogInput {
  title: string;
  summary: string;
  content: string;
  coverImageUrl?: string;
  category: string;
  tags?: string[];
  isPublished: boolean;
}

export async function login(username: string, password: string) {
  const { data } = await api.post<{ token: string; type: string }>('/api/auth/login', {
    username,
    password,
  });
  return data;
}

export async function getProjectsByType(type: string) {
  const { data } = await api.get<Project[]>(`/api/portfolio/type/${type}`);
  return data;
}

export async function getAllProjects() {
  const types = ['PHOTO', 'VIDEO', 'SOFTWARE'] as const;
  const results = await Promise.all(types.map((type) => getProjectsByType(type)));
  return results.flat().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createProject(project: ProjectInput, media?: File) {
  const formData = new FormData();
  formData.append(
    'project',
    new Blob([JSON.stringify(project)], { type: 'application/json' })
  );
  if (media) formData.append('media', media);
  const { data } = await api.post<Project>('/api/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateProject(id: string, project: ProjectInput, media?: File) {
  const formData = new FormData();
  formData.append(
    'project',
    new Blob([JSON.stringify(project)], { type: 'application/json' })
  );
  if (media) formData.append('media', media);
  const { data } = await api.put<Project>(`/api/portfolio/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteProject(id: string) {
  await api.delete(`/api/portfolio/${id}`);
}

export async function getBlogPosts() {
  const { data } = await api.get<BlogPost[]>('/api/blog');
  return data;
}

export async function getAllBlogPosts() {
  const { data } = await api.get<BlogPost[]>('/api/blog/manage');
  return data;
}

export async function getBlogPost(slug: string) {
  const { data } = await api.get<BlogPost>(`/api/blog/${slug}`);
  return data;
}

export async function createBlogPost(post: BlogInput) {
  const { data } = await api.post<BlogPost>('/api/blog', post);
  return data;
}

export async function updateBlogPost(id: string, post: BlogInput) {
  const { data } = await api.put<BlogPost>(`/api/blog/${id}`, post);
  return data;
}

export async function deleteBlogPost(id: string) {
  await api.delete(`/api/blog/${id}`);
}

export async function submitContact(form: ContactForm) {
  const { data } = await api.post<string>('/api/contact', form);
  return data;
}

export async function getContactMessages() {
  const { data } = await api.get<ContactMessage[]>('/api/contact');
  return data;
}

export async function markContactRead(id: string) {
  const { data } = await api.patch<ContactMessage>(`/api/contact/${id}/read`);
  return data;
}
