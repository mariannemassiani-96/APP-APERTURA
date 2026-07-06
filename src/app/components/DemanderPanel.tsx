'use client';

import { useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Quelle fenêtre isole le mieux ?',
  'Laquelle est la plus silencieuse ?',
  'Qu’est-ce que le Uw ?',
  'Y a-t-il des garanties ?',
];

/**
 * Assistant « Demander ».
 *
 * Interroge /api/demander, qui nourrit la couche LLM UNIQUEMENT avec les faits
 * de cette offre + la base de connaissances du secteur. L'assistant explique et
 * s'appuie sur les faits ; il ne doit jamais inventer de chiffre.
 */
export function DemanderPanel({ offreId }: { offreId: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [saisie, setSaisie] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [fournisseur, setFournisseur] = useState<string | null>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

  async function envoyer(question: string) {
    const texte = question.trim();
    if (!texte || enCours) return;

    const historique = messages;
    const nouveaux: Message[] = [...messages, { role: 'user', content: texte }];
    setMessages(nouveaux);
    setSaisie('');
    setEnCours(true);

    try {
      const r = await fetch('/api/demander', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ offreId, question: texte, historique }),
      });
      const data = (await r.json()) as { reponse?: string; fournisseur?: string; erreur?: string };
      if (data.fournisseur) setFournisseur(data.fournisseur);
      setMessages([
        ...nouveaux,
        {
          role: 'assistant',
          content: data.reponse ?? data.erreur ?? 'Désolé, une erreur est survenue.',
        },
      ]);
    } catch {
      setMessages([
        ...nouveaux,
        { role: 'assistant', content: 'Connexion impossible à l’assistant. Réessayez.' },
      ]);
    } finally {
      setEnCours(false);
      requestAnimationFrame(() => {
        zoneRef.current?.scrollTo({ top: zoneRef.current.scrollHeight, behavior: 'smooth' });
      });
    }
  }

  return (
    <>
      {/* Bouton flottant d'ouverture */}
      {!ouvert && (
        <button
          type="button"
          onClick={() => setOuvert(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-maquis px-5 py-3 font-medium text-creme shadow-carteHover transition hover:brightness-110"
        >
          <span aria-hidden>💬</span> Demander
        </button>
      )}

      {/* Panneau */}
      {ouvert && (
        <div className="fixed inset-0 z-50 flex justify-end sm:p-4">
          {/* voile */}
          <div
            className="absolute inset-0 bg-noir/30"
            onClick={() => setOuvert(false)}
            aria-hidden
          />
          <section className="relative flex h-full w-full flex-col bg-white shadow-carteHover sm:h-auto sm:max-h-full sm:w-[420px] sm:rounded-xl2">
            <header className="flex items-center justify-between border-b border-noir/10 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">Demander</h2>
                <p className="text-xs text-noir/50">
                  Réponses fondées sur votre devis
                  {fournisseur ? ` · via ${fournisseur}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOuvert(false)}
                className="rounded-full p-2 text-noir/50 hover:bg-creme"
                aria-label="Fermer"
              >
                ✕
              </button>
            </header>

            <div ref={zoneRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <div className="text-sm text-noir/60">
                  <p className="mb-3">
                    Posez une question sur ce devis. Je m’appuie uniquement sur les
                    faits qu’il contient ; si l’information n’y est pas, je vous le dis.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => envoyer(s)}
                        className="rounded-full border border-noir/15 px-3 py-1 text-xs transition hover:border-cuivre hover:text-cuivre"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-maquis px-4 py-2 text-sm text-creme'
                        : 'max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-creme px-4 py-2 text-sm text-noir/85'
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {enCours && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-creme px-4 py-2 text-sm text-noir/50">
                    …
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                envoyer(saisie);
              }}
              className="flex items-center gap-2 border-t border-noir/10 px-4 py-3"
            >
              <input
                value={saisie}
                onChange={(e) => setSaisie(e.target.value)}
                placeholder="Votre question…"
                className="flex-1 rounded-full border border-noir/15 bg-creme/40 px-4 py-2 text-sm outline-none focus:border-cuivre"
              />
              <button
                type="submit"
                disabled={enCours || saisie.trim().length === 0}
                className="rounded-full bg-cuivre px-4 py-2 text-sm font-medium text-white transition disabled:opacity-40"
              >
                Envoyer
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
