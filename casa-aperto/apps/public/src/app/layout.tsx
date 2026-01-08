import './globals.css';

export const metadata = {
  title: 'Aperto Design',
  description: 'Aperto Design — coming soon',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
