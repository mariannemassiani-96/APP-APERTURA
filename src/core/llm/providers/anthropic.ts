/**
 * Adaptateur Anthropic (Claude).
 *
 * Appelle l'API Messages via `fetch` (aucune dépendance externe requise pour
 * l'incrément). La clé et le modèle proviennent des variables d'environnement,
 * jamais du code. Le message système (qui contient les faits + les garde-fous)
 * est transmis dans le champ `system` de l'API.
 */

import type { LlmClient, LlmMessage, LlmOptions } from '../types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const VERSION = '2023-06-01';

export function creerAnthropicClient(apiKey: string, modele: string): LlmClient {
  const model = modele || 'claude-sonnet-5';
  return {
    nom: `anthropic:${model}`,
    async complete(messages: LlmMessage[], options?: LlmOptions): Promise<string> {
      const system = messages
        .filter((m) => m.role === 'system')
        .map((m) => m.content)
        .join('\n\n');

      const conversation = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content }));

      const reponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': VERSION,
        },
        body: JSON.stringify({
          model,
          system,
          messages: conversation,
          max_tokens: options?.maxTokens ?? 800,
          temperature: options?.temperature ?? 0.2,
        }),
      });

      if (!reponse.ok) {
        const detail = await reponse.text();
        throw new Error(`Anthropic ${reponse.status} : ${detail}`);
      }

      const data = (await reponse.json()) as { content?: Array<{ text?: string }> };
      return data.content?.map((bloc) => bloc.text ?? '').join('') ?? '';
    },
  };
}
