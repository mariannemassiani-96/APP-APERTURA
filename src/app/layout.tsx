import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Projet Lumen — votre devis, en clair',
  description:
    'Votre devis de menuiserie, transformé en une page vivante pour comprendre, comparer et décider.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Typographies Apertura : Cormorant Garamond (titres) + DM Sans (texte).
            Chargées via <link> pour ne pas bloquer le build hors-ligne ; repli
            système défini dans tailwind.config.ts si le réseau est absent. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
