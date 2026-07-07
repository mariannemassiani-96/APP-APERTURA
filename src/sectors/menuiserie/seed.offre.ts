/**
 * Devis EXEMPLE — secteur menuiserie.
 *
 * ⚠️ DONNÉES D'EXEMPLE (`exemple: true`). Les valeurs chiffrées sont des
 * PLACEHOLDERS réalistes, à remplacer par la base de faits réelle. Rien ici
 * n'est présenté comme certifié : les statuts 'promesse'/'preuve' et la source
 * 'fait' décrivent la NATURE de la donnée, pas une certification officielle.
 *
 * 3 postes : une baie coulissante (séjour), une fenêtre 2 vantaux (chambre),
 * une porte-fenêtre (cuisine). Chaque poste porte une traduction-bénéfice claire
 * et 2-3 variantes exprimées en DIRECTIONS (pas de recette copiable).
 */

import type { Branding, Offre } from '@/core/model/offre';

/** Marque blanche par défaut : Apertura Di Corsica. */
const brandingApertura: Branding = {
  couleurs: {
    primaire: '#4F5E46', // Vert Maquis
    accent: '#C27A4A', // Cuivre
    encre: '#1A1A1A', // Noir
    fond: '#F5F0E8', // Crème
  },
  slogan: 'Menuiseries de caractère, confort de tous les jours.',
};

export const offreExempleMenuiserie: Offre = {
  id: 'demo-menuiserie',
  etat: 'offre',
  secteur: 'menuiserie',
  exemple: true,
  pro: { nom: 'Apertura Di Corsica', branding: brandingApertura },
  client: { nom: 'Famille Rossi' },
  // Plan schématique (unités abstraites). Colonne gauche = Séjour (pleine hauteur) ;
  // colonne droite = Chambre (haut) + Cuisine (bas). Nord en haut.
  plan: {
    pieces: [
      { nom: 'Séjour', x: 0, y: 0, largeur: 6, hauteur: 8 },
      { nom: 'Chambre', x: 6, y: 0, largeur: 4, hauteur: 4 },
      { nom: 'Cuisine', x: 6, y: 4, largeur: 4, hauteur: 4 },
    ],
  },
  postes: [
    // ── Poste 1 : baie coulissante séjour ───────────────────────────────────
    {
      id: 'poste-baie-sejour',
      identite: {
        reference: 'EXEMPLE-BAIE-01',
        designation: 'Baie coulissante — Séjour',
      },
      attributs: [
        { cle: 'dimensions', valeur: '2400 × 2150', unite: 'mm' },
        { cle: 'materiau', valeur: 'Aluminium' },
        { cle: 'couleur', valeur: 'Gris anthracite' },
        { cle: 'vitrage', valeur: 'Double vitrage à isolation renforcée' },
        { cle: 'ouverture', valeur: 'Coulissant 2 vantaux' },
      ],
      performances: [
        { cle: 'isolation_thermique', valeur: 1.4, unite: 'W/m²·K', statut: 'promesse', source: 'fait' },
        { cle: 'isolation_acoustique', valeur: 32, unite: 'dB', statut: 'promesse', source: 'fait' },
        { cle: 'etancheite_air', valeur: 'A*E*V — classe élevée', statut: 'promesse', source: 'fait' },
        { cle: 'facteur_solaire', valeur: 0.42, statut: 'promesse', source: 'fait' },
      ],
      benefice: {
        texte:
          'Une grande ouverture lumineuse sur l’extérieur, tout en gardant le séjour confortable : les grandes surfaces vitrées laissent entrer la lumière et la chaleur du soleil en hiver, et le vitrage isolant limite les pertes quand il fait froid.',
        source: 'genere',
      },
      variantes: [
        { direction: 'Plus d’isolation', effet: 'des hivers plus confortables et une facture de chauffage réduite' },
        { direction: 'Plus de confort d’été', effet: 'moins de surchauffe les après-midis ensoleillés' },
        { direction: 'Plus de sécurité', effet: 'une ouverture plus difficile à forcer, l’esprit tranquille' },
      ],
      prix: { montant: 4200, devise: 'EUR', statut: 'propose' },
      localisation: { piece: 'Séjour', façade: 'Sud' },
      preuves: [
        { type: 'garantie', libelle: 'Garantie fabricant (durée à confirmer)' },
        { type: 'certification', libelle: 'Marquage CE (exemple — à documenter)' },
      ],
    },

    // ── Poste 2 : fenêtre 2 vantaux chambre ──────────────────────────────────
    {
      id: 'poste-fenetre-chambre',
      identite: {
        reference: 'EXEMPLE-FEN-02',
        designation: 'Fenêtre 2 vantaux — Chambre',
      },
      attributs: [
        { cle: 'dimensions', valeur: '1200 × 1350', unite: 'mm' },
        { cle: 'materiau', valeur: 'PVC' },
        { cle: 'couleur', valeur: 'Blanc' },
        { cle: 'vitrage', valeur: 'Double vitrage acoustique' },
        { cle: 'ouverture', valeur: 'Oscillo-battant, 2 vantaux' },
      ],
      performances: [
        { cle: 'isolation_thermique', valeur: 1.3, unite: 'W/m²·K', statut: 'promesse', source: 'fait' },
        { cle: 'isolation_acoustique', valeur: 38, unite: 'dB', statut: 'preuve', source: 'fait' },
        { cle: 'etancheite_air', valeur: 'A*E*V — classe standard', statut: 'promesse', source: 'fait' },
      ],
      benefice: {
        texte:
          'Une chambre plus calme et plus facile à vivre : le vitrage acoustique atténue les bruits extérieurs pour mieux dormir, et l’ouverture oscillo-battant permet d’aérer en toute sécurité, même absent.',
        source: 'genere',
      },
      variantes: [
        { direction: 'Plus de calme', effet: 'un sommeil mieux protégé des bruits de la rue' },
        { direction: 'Plus d’isolation', effet: 'moins de sensation de paroi froide près du lit en hiver' },
      ],
      prix: { montant: 890, devise: 'EUR', statut: 'propose' },
      localisation: { piece: 'Chambre', façade: 'Est' },
      preuves: [{ type: 'garantie', libelle: 'Garantie fabricant (durée à confirmer)' }],
    },

    // ── Poste 3 : porte-fenêtre cuisine ──────────────────────────────────────
    {
      id: 'poste-porte-fenetre-cuisine',
      identite: {
        reference: 'EXEMPLE-PF-03',
        designation: 'Porte-fenêtre — Cuisine',
      },
      attributs: [
        { cle: 'dimensions', valeur: '900 × 2150', unite: 'mm' },
        { cle: 'materiau', valeur: 'Aluminium' },
        { cle: 'couleur', valeur: 'Gris anthracite' },
        { cle: 'vitrage', valeur: 'Double vitrage sécurité (feuilleté)' },
        { cle: 'ouverture', valeur: 'Ouvrant à la française, 1 vantail' },
      ],
      performances: [
        { cle: 'isolation_thermique', valeur: 1.5, unite: 'W/m²·K', statut: 'promesse', source: 'fait' },
        { cle: 'resistance_effraction', valeur: 'Classe RC (niveau à confirmer)', statut: 'promesse', source: 'fait' },
        { cle: 'etancheite_air', valeur: 'A*E*V — classe élevée', statut: 'promesse', source: 'fait' },
      ],
      benefice: {
        texte:
          'Un accès direct et sûr vers l’extérieur depuis la cuisine : le vitrage feuilleté et le verrouillage renforcé compliquent les tentatives d’intrusion, tout en gardant une belle entrée de lumière.',
        source: 'genere',
      },
      variantes: [
        { direction: 'Plus de sécurité', effet: 'une porte plus dissuasive face aux tentatives d’effraction' },
        { direction: 'Plus de lumière', effet: 'une cuisine plus claire et plus agréable au quotidien' },
        { direction: 'Plus d’isolation', effet: 'moins de déperditions par cette ouverture très utilisée' },
      ],
      prix: { montant: 1750, devise: 'EUR', statut: 'propose' },
      localisation: { piece: 'Cuisine', façade: 'Ouest' },
      preuves: [
        { type: 'garantie', libelle: 'Garantie fabricant (durée à confirmer)' },
        { type: 'certification', libelle: 'Vitrage feuilleté de sécurité (exemple — à documenter)' },
      ],
    },
  ],
};
