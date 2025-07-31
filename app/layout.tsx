import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shopify Store Spy - Competitor Intelligence Tool by CommerceInk',
  description: 'Uncover your competitors\' secrets with instant Shopify store analysis. Get insights on design, products, pricing, and marketing strategies in under 30 seconds.',
  keywords: 'shopify, competitor analysis, e-commerce intelligence, store analysis, marketing insights',
  authors: [{ name: 'CommerceInk' }],
  openGraph: {
    title: 'Shopify Store Spy - Competitor Intelligence Tool',
    description: 'Analyze any Shopify store and uncover their competitive strategies instantly',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}