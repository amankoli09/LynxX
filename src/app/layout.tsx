import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../index.css';
import '../App.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LynxX - Non-custodial Payments on Stellar',
  description: 'LynxX merges fast, non-custodial payments with real on-chain smart contracts — unlocking trustless transfers and crowdfunding on Stellar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
