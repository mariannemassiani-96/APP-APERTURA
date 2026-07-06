/**
 * Barrel des secteurs.
 *
 * Importer ce module enregistre TOUS les secteurs (ontologies + offres seed)
 * auprès du moteur, via les effets de bord des index de secteur. C'est le seul
 * point que l'app importe pour « activer » le métier.
 *
 * Ajouter un secteur = créer /sectors/<nom> puis l'importer ici. Le moteur ne bouge pas.
 */

import type { ConnaissanceAtome } from '@/core/llm/context';

import { connaissancesMenuiserie } from './menuiserie';

// Effets de bord d'enregistrement déjà exécutés à l'import ci-dessus.

/** Base de connaissances par secteur, pour l'assistant « Demander ». */
export const connaissancesParSecteur: Record<string, ConnaissanceAtome[]> = {
  menuiserie: connaissancesMenuiserie,
};

export function connaissancesDuSecteur(secteur: string): ConnaissanceAtome[] {
  return connaissancesParSecteur[secteur] ?? [];
}
