import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/lib/api';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="glass group overflow-hidden rounded-2xl transition hover:border-indigo-400/30">
      {project.mediaUrl && (
        <div className="relative aspect-video overflow-hidden bg-white/5">
          {project.type === 'VIDEO' ? (
            <video src={project.mediaUrl} className="h-full w-full object-cover" controls />
          ) : (
            <Image
              src={project.mediaUrl}
              alt={project.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized
            />
          )}
        </div>
      )}
      <div className="p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
            {project.type}
          </span>
          <span className="text-xs text-white/40">{project.category}</span>
        </div>
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-white/55 line-clamp-3">{project.description}</p>
        <div className="mt-4 flex gap-3">
          {project.githubLink && (
            <Link href={project.githubLink} target="_blank" className="text-white/50 hover:text-white">
              <Github size={18} />
            </Link>
          )}
          {project.demoLink && (
            <Link href={project.demoLink} target="_blank" className="text-white/50 hover:text-white">
              <ExternalLink size={18} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
