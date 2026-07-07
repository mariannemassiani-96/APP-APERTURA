'use client';

import { useMemo, useState } from 'react';

import type { Offre, Poste } from '@/core/model/offre';

import { PrixTag } from './PrixTag';

/**
 * Vue « plan » du logement.
 *
 * Dessine les pièces (positions en unités abstraites, normalisées ici) et place
 * chaque poste sur le mur correspondant à sa façade (Nord/Sud/Est/Ouest). Les
 * repères sont cliquables : une bulle montre l'essentiel + un bouton « Voir le
 * détail » qui bascule vers la liste et déplie le bon poste.
 *
 * Rien de spécifique menuiserie : on lit `offre.plan` + `poste.localisation`.
 */

type Mur = 'haut' | 'bas' | 'gauche' | 'droite' | 'centre';

/** Traduit une façade (texte libre) en mur du plan. Nord en haut. */
function murDepuisFacade(facade?: string): Mur {
  const f = (facade ?? '').toLowerCase();
  if (f.startsWith('n')) return 'haut';
  if (f.startsWith('s')) return 'bas';
  if (f.startsWith('e')) return 'droite';
  if (f.startsWith('o') || f.startsWith('w')) return 'gauche';
  return 'centre';
}

interface Repere {
  poste: Poste;
  cx: number; // position dans le conteneur, en %
  cy: number;
}

export function PlanView({
  offre,
  consultes,
  onConsulter,
  onVoirDetail,
}: {
  offre: Offre;
  consultes: Set<string>;
  onConsulter: (posteId: string) => void;
  onVoirDetail: (posteId: string) => void;
}) {
  const [selection, setSelection] = useState<string | null>(null);

  const plan = offre.plan;

  // Bornes du plan pour normaliser en pourcentages.
  const bbox = useMemo(() => {
    if (!plan || plan.pieces.length === 0) return null;
    const minX = Math.min(...plan.pieces.map((p) => p.x));
    const minY = Math.min(...plan.pieces.map((p) => p.y));
    const maxX = Math.max(...plan.pieces.map((p) => p.x + p.largeur));
    const maxY = Math.max(...plan.pieces.map((p) => p.y + p.hauteur));
    return { minX, minY, largeur: maxX - minX, hauteur: maxY - minY };
  }, [plan]);

  // Calcule les repères (un par poste localisé), répartis sur leur mur.
  const reperes = useMemo<Repere[]>(() => {
    if (!plan || !bbox) return [];
    const parPieceEtMur = new Map<string, Poste[]>();
    for (const poste of offre.postes) {
      const piece = poste.localisation?.piece;
      if (!piece) continue;
      const mur = murDepuisFacade(poste.localisation?.façade);
      const cle = `${piece}|${mur}`;
      const liste = parPieceEtMur.get(cle) ?? [];
      liste.push(poste);
      parPieceEtMur.set(cle, liste);
    }

    const out: Repere[] = [];
    for (const [cle, postes] of parPieceEtMur) {
      const [nomPiece, mur] = cle.split('|') as [string, Mur];
      const piece = plan.pieces.find((p) => p.nom === nomPiece);
      if (!piece) continue;

      const rl = ((piece.x - bbox.minX) / bbox.largeur) * 100;
      const rt = ((piece.y - bbox.minY) / bbox.hauteur) * 100;
      const rw = (piece.largeur / bbox.largeur) * 100;
      const rh = (piece.hauteur / bbox.hauteur) * 100;

      postes.forEach((poste, i) => {
        const spread = (i + 1) / (postes.length + 1); // répartit le long du mur
        let fx = 0.5;
        let fy = 0.5;
        if (mur === 'haut') (fx = spread), (fy = 0);
        else if (mur === 'bas') (fx = spread), (fy = 1);
        else if (mur === 'gauche') (fx = 0), (fy = spread);
        else if (mur === 'droite') (fx = 1), (fy = spread);
        out.push({ poste, cx: rl + fx * rw, cy: rt + fy * rh });
      });
    }
    return out;
  }, [plan, bbox, offre.postes]);

  if (!plan || !bbox) {
    return (
      <p className="rounded-xl2 border border-noir/10 bg-white px-6 py-8 text-center text-sm text-noir/55">
        Aucun plan n’est disponible pour ce devis.
      </p>
    );
  }

  const repereSelectionne = reperes.find((r) => r.poste.id === selection) ?? null;
  const nonSitues = offre.postes.filter((p) => !p.localisation?.piece);

  return (
    <div>
      <p className="mb-3 text-center text-sm text-noir/55">
        Plan schématique (orientation indicative) : chaque menuiserie est posée sur le mur de sa
        pièce. Touchez un repère pour voir de quoi il s’agit.
      </p>

      <div className="relative rounded-xl2 border border-noir/10 bg-white p-4 shadow-carte sm:p-6">
        {/* Boussole */}
        <div className="pointer-events-none absolute right-4 top-4 z-10 flex flex-col items-center text-[10px] font-semibold uppercase tracking-wide text-noir/45">
          <span className="text-cuivre">▲</span>
          <span>Nord</span>
        </div>

        {/* Surface du plan (ratio calé sur les proportions du logement) */}
        <div
          className="relative mx-auto w-full"
          style={{ aspectRatio: `${bbox.largeur} / ${bbox.hauteur}`, maxWidth: 520 }}
        >
          {/* Pièces */}
          {plan.pieces.map((piece) => {
            const rl = ((piece.x - bbox.minX) / bbox.largeur) * 100;
            const rt = ((piece.y - bbox.minY) / bbox.hauteur) * 100;
            const rw = (piece.largeur / bbox.largeur) * 100;
            const rh = (piece.hauteur / bbox.hauteur) * 100;
            return (
              <div
                key={piece.nom}
                className="absolute rounded-lg border-2 border-maquis/25 bg-maquis/[0.06]"
                style={{ left: `${rl}%`, top: `${rt}%`, width: `${rw}%`, height: `${rh}%` }}
              >
                <span className="absolute left-2 top-1.5 font-titre text-sm text-maquis/80">
                  {piece.nom}
                </span>
              </div>
            );
          })}

          {/* Repères des postes */}
          {reperes.map((r) => {
            const vu = consultes.has(r.poste.id);
            const actif = selection === r.poste.id;
            return (
              <button
                key={r.poste.id}
                type="button"
                onClick={() => {
                  setSelection(actif ? null : r.poste.id);
                  if (!actif) onConsulter(r.poste.id);
                }}
                aria-label={`Menuiserie : ${r.poste.identite.designation}`}
                className={[
                  'absolute z-10 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[13px] shadow-carte ring-2 ring-white transition',
                  actif ? 'scale-125 bg-maquis text-creme' : vu ? 'bg-maquis/80 text-creme' : 'bg-cuivre text-white',
                  'hover:scale-125',
                ].join(' ')}
                style={{ left: `${r.cx}%`, top: `${r.cy}%` }}
              >
                <span aria-hidden>▧</span>
              </button>
            );
          })}

          {/* Bulle d'infos */}
          {repereSelectionne && (
            <div
              className="absolute z-20 w-60 max-w-[80vw] rounded-xl2 border border-noir/10 bg-white p-4 shadow-carteHover"
              style={{
                left: `${Math.min(Math.max(repereSelectionne.cx, 20), 80)}%`,
                top: `${repereSelectionne.cy}%`,
                transform:
                  repereSelectionne.cy < 40
                    ? 'translate(-50%, 16px)'
                    : 'translate(-50%, calc(-100% - 16px))',
              }}
            >
              <button
                type="button"
                onClick={() => setSelection(null)}
                aria-label="Fermer"
                className="absolute right-2 top-2 rounded-full p-1 text-noir/40 hover:bg-creme"
              >
                ✕
              </button>
              {repereSelectionne.poste.localisation?.piece && (
                <span className="text-[11px] font-medium uppercase tracking-wide text-maquis">
                  {repereSelectionne.poste.localisation.piece}
                </span>
              )}
              <h4 className="mt-0.5 pr-4 font-titre text-base font-semibold leading-tight">
                {repereSelectionne.poste.identite.designation}
              </h4>
              <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-noir/60">
                {repereSelectionne.poste.benefice.texte}
              </p>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <PrixTag prix={repereSelectionne.poste.prix} />
                <button
                  type="button"
                  onClick={() => onVoirDetail(repereSelectionne.poste.id)}
                  className="shrink-0 rounded-full bg-cuivre px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
                >
                  Voir le détail →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Postes non situés */}
      {nonSitues.length > 0 && (
        <div className="mt-4 rounded-xl2 border border-noir/10 bg-white px-5 py-4 shadow-carte">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-noir/50">
            Non situés sur le plan
          </p>
          <ul className="flex flex-wrap gap-2">
            {nonSitues.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onVoirDetail(p.id)}
                  className="rounded-full border border-noir/15 px-3 py-1 text-sm transition hover:border-cuivre hover:text-cuivre"
                >
                  {p.identite.designation}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
