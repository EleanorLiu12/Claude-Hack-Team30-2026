import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ripple',
  description: 'Small nods. Wide ripples.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen ripple-bg antialiased">{children}</body>
    </html>
  );
}
