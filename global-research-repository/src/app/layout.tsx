import type { Metadata } from 'next';
import '../styles/globals.css';
import I18nProvider from '../components/I18nProvider';

export const metadata: Metadata = {
  title: 'Global Research Repository | Empowering Research from Developing Nations',
  description: 'Discover and share groundbreaking research from developing nations. A modern platform connecting researchers, students, and communities worldwide.',
  keywords: 'research, developing nations, global south, academic papers, open access, education',
  authors: [{ name: 'inested.com' }],
  openGraph: {
    title: 'Global Research Repository',
    description: 'Empowering Research from Developing Nations',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Research Repository',
    description: 'Empowering Research from Developing Nations',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}