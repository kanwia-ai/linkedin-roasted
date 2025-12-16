import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  title: 'LinkedIn Roasted | Your 2025 LinkedIn Wrapped, But Mean',
  description: 'Upload your LinkedIn data export and get roasted. Client-side only - we never see your data. LinkedIn Wrapped, but it\'s mean. (Affectionately.)',
  keywords: ['LinkedIn', 'LinkedIn Wrapped', 'roast', '2025', 'networking', 'social media', 'career humor'],
  authors: [{ name: 'LinkedIn Roasted' }],
  creator: 'LinkedIn Roasted',
  publisher: 'LinkedIn Roasted',
  metadataBase: new URL('https://linkedinroasted.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LinkedIn Roasted | Your 2025 LinkedIn Wrapped, But Mean',
    description: 'Upload your LinkedIn data export and get roasted. Privacy-first - all processing happens in your browser.',
    url: 'https://linkedinroasted.com',
    siteName: 'LinkedIn Roasted',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LinkedIn Roasted - Your 2025 LinkedIn Wrapped, But Mean',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn Roasted | Your 2025 LinkedIn Wrapped, But Mean',
    description: 'Get your LinkedIn behavior roasted. We never see your data - it\'s all client-side.',
    images: ['/og-image.png'],
    creator: '@linkedinroasted',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
