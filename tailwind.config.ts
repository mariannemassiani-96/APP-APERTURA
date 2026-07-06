import type { Config } from 'tailwindcss';

/**
 * Palette et typographies "Apertura Di Corsica" par défaut.
 *
 * Ce sont les valeurs de repli de la marque blanche : chaque offre porte son
 * propre `branding` (voir core/model/offre.ts) et l'UI injecte ces couleurs
 * comme variables CSS au runtime. Tailwind ne fait que fournir le socle.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette Apertura (défaut). Réutilisable via var() pour la marque blanche.
        maquis: '#4F5E46', // Vert Maquis
        cuivre: '#C27A4A', // Cuivre
        noir: '#1A1A1A', // Noir
        creme: '#F5F0E8', // Crème
        // Alias pilotés par les variables CSS de branding de l'offre.
        marque: {
          primaire: 'var(--marque-primaire)',
          accent: 'var(--marque-accent)',
          encre: 'var(--marque-encre)',
          fond: 'var(--marque-fond)',
        },
      },
      fontFamily: {
        // Titres : Cormorant Garamond ; Texte : DM Sans. Chargés via <link> dans le layout.
        titre: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        texte: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        carte: '0 1px 2px rgba(26,26,26,0.04), 0 8px 24px -12px rgba(26,26,26,0.12)',
        carteHover: '0 2px 4px rgba(26,26,26,0.06), 0 18px 40px -16px rgba(26,26,26,0.20)',
      },
    },
  },
  plugins: [],
};

export default config;
