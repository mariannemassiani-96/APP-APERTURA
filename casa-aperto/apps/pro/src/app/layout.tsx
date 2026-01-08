import '../app/globals.css';

import Header from '../components/Header';

export const metadata = {
  title: 'Casa Aperto PRO',
  description: 'Back-office Casa Aperto PRO',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
