import { Suspense } from 'react';
import PortfolioClient from './PortfolioClient';

export default function PortfolioPage() {
  return (
    <Suspense fallback={<p className="px-6 py-12 text-white/50">Loading…</p>}>
      <PortfolioClient />
    </Suspense>
  );
}
