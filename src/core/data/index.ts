/**
 * Point d'entrée unique de la couche d'accès aux données.
 *
 * L'app importe `repository` d'ici et ignore l'implémentation concrète.
 * Pour brancher PostgreSQL : changer l'export ci-dessous, rien d'autre.
 */

import { memoryRepository } from './memoryRepository';
import type { OffreRepository } from './repository';

export const repository: OffreRepository = memoryRepository;
export type { OffreRepository } from './repository';
