/**
 * Base de connaissances MENUISERIE — courte, en langage clair.
 *
 * Elle sert UNIQUEMENT à aider l'assistant « Demander » à EXPLIQUER des notions
 * (ce qu'est le Uw, pourquoi le triple vitrage, etc.). Elle ne contient AUCUN
 * chiffre propre à l'offre : les chiffres viennent toujours du seed (faits).
 *
 * C'est de la donnée : on l'enrichit ici sans toucher au moteur.
 */

import type { ConnaissanceAtome } from '@/core/llm/context';

export const connaissancesMenuiserie: ConnaissanceAtome[] = [
  {
    titre: 'Isolation thermique (Uw)',
    texte:
      'Le coefficient Uw mesure les pertes de chaleur d’une fenêtre : plus il est bas, moins vous perdez de chaleur en hiver, ce qui améliore le confort et réduit la facture de chauffage.',
    motsCles: ['isolation', 'thermique', 'chaleur', 'uw', 'chauffage', 'froid', 'confort', 'hiver', 'deperdition'],
  },
  {
    titre: 'Isolation acoustique (Rw)',
    texte:
      'L’indice Rw indique la réduction du bruit extérieur en décibels : plus il est élevé, plus l’intérieur est calme. Un bon vitrage acoustique est utile en bord de route ou en ville.',
    motsCles: ['acoustique', 'bruit', 'phonique', 'rw', 'decibel', 'silence', 'calme', 'route', 'voisinage'],
  },
  {
    titre: 'Étanchéité (classement AEV)',
    texte:
      'Le classement Air / Eau / Vent qualifie la résistance de la menuiserie aux courants d’air, à la pluie battante et au vent. Des classes élevées évitent les infiltrations et les sensations de courant d’air.',
    motsCles: ['etancheite', 'aev', 'air', 'eau', 'vent', 'pluie', 'infiltration', 'courant'],
  },
  {
    titre: 'Sécurité (classes RC)',
    texte:
      'La résistance à l’effraction se note en classes RC : elles indiquent combien de temps la menuiserie résiste à une tentative d’intrusion. Des points de verrouillage supplémentaires et un vitrage retardateur renforcent la sécurité.',
    motsCles: ['securite', 'effraction', 'rc', 'intrusion', 'cambriolage', 'verrouillage', 'serrure', 'vitrage retardateur'],
  },
  {
    titre: 'Types de vitrage',
    texte:
      'Le double vitrage (deux vitres + lame de gaz) offre un bon rapport isolation/prix. Le triple vitrage isole davantage mais pèse plus lourd et coûte plus cher : il est surtout pertinent en climat froid ou façade très exposée.',
    motsCles: ['vitrage', 'double', 'triple', 'vitre', 'gaz', 'argon', 'verre'],
  },
  {
    titre: 'Matériaux de menuiserie',
    texte:
      'Le PVC est économique et sans entretien ; l’aluminium permet des profilés fins et de grandes surfaces vitrées ; le bois offre une isolation naturelle et un rendu chaleureux, avec un entretien régulier.',
    motsCles: ['materiau', 'pvc', 'aluminium', 'alu', 'bois', 'entretien', 'profil'],
  },
  {
    titre: 'Apports solaires (facteur solaire Sw)',
    texte:
      'Le facteur solaire mesure la chaleur du soleil qui entre par le vitrage. Un facteur élevé réchauffe gratuitement en hiver ; en façade très ensoleillée, on peut préférer un vitrage à contrôle solaire pour limiter la surchauffe estivale.',
    motsCles: ['solaire', 'soleil', 'sw', 'chaleur', 'surchauffe', 'ete', 'lumiere', 'apport'],
  },
  {
    titre: 'Aides et garanties',
    texte:
      'Le remplacement de menuiseries performantes peut ouvrir droit à des aides à la rénovation énergétique selon votre situation ; les menuiseries sont par ailleurs couvertes par des garanties fabricant. Les montants et l’éligibilité exacts dépendent de votre dossier et sont à confirmer avec le professionnel.',
    motsCles: ['aide', 'subvention', 'renovation', 'garantie', 'eligibilite', 'financement', 'prime'],
  },
];
