/**
 * Registre d'ontologies de secteur.
 *
 * Simple table `secteur -> ontologie`. Les modules de secteur (données) s'y
 * enregistrent eux-mêmes ; le moteur se contente de résoudre par clé.
 * Ainsi core ne dépend jamais de /sectors : c'est la donnée qui vient à lui.
 */

import type { SectorOntology } from './types';

const registre = new Map<string, SectorOntology>();

/** Enregistre (ou remplace) l'ontologie d'un secteur. Appelé par les modules /sectors. */
export function enregistrerOntologie(ontologie: SectorOntology): void {
  registre.set(ontologie.secteur, ontologie);
}

/** Résout l'ontologie d'un secteur, ou `undefined` si non enregistrée. */
export function getOntologie(secteur: string): SectorOntology | undefined {
  return registre.get(secteur);
}

/** Libellé d'une clé de performance (repli sur la clé brute si inconnue). */
export function labelPerformance(secteur: string, cle: string): string {
  return getOntologie(secteur)?.performances[cle]?.label ?? cle;
}

/** Libellé d'une clé d'attribut (repli sur la clé brute si inconnue). */
export function labelAttribut(secteur: string, cle: string): string {
  return getOntologie(secteur)?.attributs[cle]?.label ?? cle;
}
