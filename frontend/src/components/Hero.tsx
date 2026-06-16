'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Camera, Code2, Film } from 'lucide-react';

const highlights = [
  {
    icon: Camera,
    title: 'Photography',
    desc: 'Portrait, landscape, and editorial work with a cinematic eye.',
    href: '/portfolio?type=PHOTO',
  },
  {
    icon: Film,
    title: 'Videography',
    desc: 'Short films, brand stories, and motion-driven narratives.',
    href: '/portfolio?type=VIDEO',
  },
  {
    icon: Code2,
    title: 'Software',
    desc: 'Full-stack apps, microservices, and creative technology.',
    href: '/portfolio?type=SOFTWARE',
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-indigo-400">
            Creative Technologist
          </p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Mihiranga <span className="text-gradient">Kokila</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
            I craft visual stories and build digital experiences — from lens to codebase.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              View Portfolio <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
            >
              <Link href={item.href} className="glass block rounded-2xl p-6 transition hover:border-indigo-400/30">
                <item.icon className="mb-4 text-indigo-400" size={28} />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/55">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
