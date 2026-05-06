import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TimeOfDay from '@/components/system/TimeOfDay';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Bhavesh Varma — AI Engineer',
  description:
    'An AI agent that introduces Bhavesh Varma. Production AI engineer. Architect. Philosopher.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    url: 'https://bhavesh.dev',
    title: 'Bhavesh Varma — AI Engineer',
    description:
      'An interactive AI introduction. Experience the systems he builds.',
    images: [
      {
        url: '/poster.jpg',
        width: 1280,
        height: 720,
        alt: 'Bhavesh Varma portfolio experience',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body>
        <TimeOfDay />
        {children}
      </body>
    </html>
  );
}
