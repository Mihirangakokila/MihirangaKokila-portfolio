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

export async function getBlogPosts() {
  const { data } = await api.get<BlogPost[]>('/api/blog');
  return data;
}

export async function getBlogPost(slug: string) {
  const { data } = await api.get<BlogPost>(`/api/blog/${slug}`);
  return data;
}

export async function submitContact(form: ContactForm) {
  const { data } = await api.post<string>('/api/contact', form);
  return data;
}
