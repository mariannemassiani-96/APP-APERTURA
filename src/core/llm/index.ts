/**
 * Factory de la couche LLM.
 *
 * `getLlmClient()` lit l'environnement et retourne l'adaptateur adéquat.
 * C'est le SEUL endroit de l'app qui connaît l'existence de fournisseurs concrets.
 * Pour changer de fournisseur : modifier les variables d'env, rien d'autre.
 */

import { creerAgent0Client } from './agent0';
import { creerAnthropicClient } from './providers/anthropic';
import { creerEchoClient } from './providers/echo';
import { creerOpenAiClient } from './providers/openai';
import type { LlmClient } from './types';

export type { LlmClient, LlmMessage, LlmOptions } from './types';
export {
  serialiserContexte,
  extraireContexte,
  type ContexteFaits,
  type FaitAtome,
  type ConnaissanceAtome,
} from './context';

export function getLlmClient(): LlmClient {
  const provider = (process.env.LLM_PROVIDER ?? 'echo').toLowerCase();
  const apiKey = process.env.LLM_API_KEY ?? '';
  const modele = process.env.LLM_MODEL ?? '';

  switch (provider) {
    case 'anthropic':
      if (!apiKey) throw new Error('LLM_PROVIDER=anthropic mais LLM_API_KEY est vide.');
      return creerAnthropicClient(apiKey, modele);

    case 'openai':
      if (!apiKey) throw new Error('LLM_PROVIDER=openai mais LLM_API_KEY est vide.');
      return creerOpenAiClient(apiKey, modele);

    case 'agent0':
      return creerAgent0Client(process.env.AGENT0_BASE_URL ?? 'http://localhost:8000');

    case 'echo':
    default:
      // Défaut sûr : fonctionne hors-ligne, ne peut rien inventer.
      return creerEchoClient();
  }
}
