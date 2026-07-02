import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Mihiranga Kokila | Portfolio',
  description:
    'Photography, videography, software engineering, and creative technology.',

  // ✅ GOOGLE VERIFICATION (THIS IS THE CORRECT WAY)
  verification: {
    google: 'u3f2EJtNS22vV9E8a5kjUsz--3k5SaCVhU19QsKLTe0',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#030712] antialiased">
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}