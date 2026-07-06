/**
 * Implémentation en mémoire du OffreRepository.
 *
 * Les offres ne sont PAS importées depuis /sectors ici (le core reste générique) :
 * ce sont les modules de secteur qui enregistrent leurs offres via `enregistrerOffre`.
 * Un simple remplacement de ce fichier par une impl. PostgreSQL suffira plus tard.
 */

import type { Offre } from '../model/offre';
import type { OffreRepository } from './repository';

const store = new Map<string, Offre>();

/** Enregistre une offre dans le magasin mémoire. Appelé par les modules /sectors. */
export function enregistrerOffre(offre: Offre): void {
  store.set(offre.id, offre);
}

export const memoryRepository: OffreRepository = {
  async getOffre(id: string): Promise<Offre | null> {
    return store.get(id) ?? null;
  },
  async listOffres(): Promise<Offre[]> {
    return Array.from(store.values());
  },
};
