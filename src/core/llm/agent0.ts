/**
 * Adaptateur « Agent 0 » — STUB.
 *
 * Agent 0 est notre agent RAG existant (service FastAPI + ChromaDB). L'objectif
 * de cet incrément est seulement de RÉSERVER LA PLACE : le jour où on le branche,
 * on remplit `complete()` ci-dessous pour appeler son endpoint, sans toucher au
 * reste de l'app (le contrat LlmClient est déjà respecté).
 *
 * Piste d'implémentation future :
 *   POST {AGENT0_BASE_URL}/query  { question, contexte_faits } -> { reponse }
 * en transmettant le même contexte de faits que les autres providers.
 */

import type { LlmClient, LlmMessage } from './types';

export function creerAgent0Client(baseUrl: string): LlmClient {
  return {
    nom: 'agent0 (RAG interne — non branché)',
    async complete(_messages: LlmMessage[]): Promise<string> {
      // Volontairement non implémenté : signale clairement l'état au lieu d'inventer.
      throw new Error(
        `L'adaptateur Agent 0 n'est pas encore branché (base : ${baseUrl}). ` +
          `Utilisez LLM_PROVIDER=echo ou =anthropic pour l'instant.`,
      );
    },
  };
}
