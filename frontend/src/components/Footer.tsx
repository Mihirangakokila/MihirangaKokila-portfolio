import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-white/50 md:flex-row">
        <p>&copy; {new Date().getFullYear()} Mihiranga Kokila. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/portfolio" className="hover:text-white transition-colors">Work</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Writing</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
