/**
 * Adaptateur OpenAI.
 *
 * Appelle l'API Chat Completions via `fetch`. Clé et modèle via l'environnement.
 * Présent pour démontrer l'interchangeabilité des fournisseurs sous le même contrat.
 */

import type { LlmClient, LlmMessage, LlmOptions } from '../types';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export function creerOpenAiClient(apiKey: string, modele: string): LlmClient {
  const model = modele || 'gpt-4o-mini';
  return {
    nom: `openai:${model}`,
    async complete(messages: LlmMessage[], options?: LlmOptions): Promise<string> {
      const reponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          max_tokens: options?.maxTokens ?? 800,
          temperature: options?.temperature ?? 0.2,
        }),
      });

      if (!reponse.ok) {
        const detail = await reponse.text();
        throw new Error(`OpenAI ${reponse.status} : ${detail}`);
      }

      const data = (await reponse.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return data.choices?.[0]?.message?.content ?? '';
    },
  };
}
