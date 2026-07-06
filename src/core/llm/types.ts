/**
 * Couche LLM ABSTRAITE — le « cerveau de langage ».
 *
 * Toute l'app parle à ce contrat, jamais à un fournisseur concret. On peut
 * changer d'OpenAI vers Anthropic/Mistral, ou brancher Agent 0 (RAG interne),
 * sans réécrire l'app : il suffit d'ajouter/activer un adaptateur.
 *
 * Le LLM EXPLIQUE à partir de faits fournis. Il n'est JAMAIS la source d'un
 * chiffre : les faits sont fournis par la couche appelante (voir /api/demander).
 */

export type RoleMessage = 'system' | 'user' | 'assistant';

export interface LlmMessage {
  role: RoleMessage;
  content: string;
}

export interface LlmOptions {
  /** Température (0 = déterministe). Optionnel, chaque adaptateur a un défaut sobre. */
  temperature?: number;
  /** Plafond de tokens de sortie. */
  maxTokens?: number;
}

/**
 * Client LLM minimal : on envoie des messages, on récupère du texte.
 * Interface volontairement étroite pour rester facile à ré-implémenter.
 */
export interface LlmClient {
  /** Nom du fournisseur, pour le diagnostic / l'affichage (« propulsé par… »). */
  readonly nom: string;
  complete(messages: LlmMessage[], options?: LlmOptions): Promise<string>;
}
