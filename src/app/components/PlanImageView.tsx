'use client';

import { useMemo, useState } from 'react';

import type { Offre } from '@/core/model/offre';

import { PrixTag } from './PrixTag';

/**
 * Vue client sur plans « image ».
 *
 * Affiche les vrais plans importés (onglets RDC / R+1…) et les repères placés
 * (données `offre.reperes`, en % du plan). Chaque repère est cliquable : bulle
 * d'infos + « Voir le détail » (bascule liste + dépliage, comme le schématique).
 *
 * Générique : lit `offre.plansImages` + `offre.reperes`, aucun code métier.
 */
export function PlanImageView({
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
  const plans = offre.plansImages ?? [];
  const reperes = offre.reperes ?? [];
  const [planActif, setPlanActif] = useState(plans[0]?.id ?? '');
  const [selection, setSelection] = useState<number | null>(null);

  // Index d'affichage (numéro) par poste, comme dans la liste.
  const numeroParPoste = useMemo(() => {
    const m = new Map<string, number>();
    offre.postes.forEach((p, i) => m.set(p.id, i + 1));
    return m;
  }, [offre.postes]);

  const posteById = (id: string) => offre.postes.find((p) => p.id === id);

  if (plans.length === 0) return null;

  const reperesDuPlan = reperes.filter((r) => r.planId === planActif);
  const selRepere = selection !== null ? reperesDuPlan[selection] : null;
  const selPoste = selRepere ? posteById(selRepere.posteId) : null;

  return (
    <div>
      <p className="mb-3 text-center text-sm text-noir/55">
        Vos menuiseries sur le plan. Touchez un repère pour voir de quoi il s’agit.
      </p>

      {/* Onglets de plans (RDC / R+1…) */}
      {plans.length > 1 && (
        <div className="mb-3 flex justify-center">
          <div className="inline-flex rounded-full border border-noir/10 bg-white p-1 shadow-carte">
            {plans.map((pl) => (
              <button
                key={pl.id}
                onClick={() => {
                  setPlanActif(pl.id);
                  setSelection(null);
                }}
                aria-pressed={planActif === pl.id}
                className={[
                  'rounded-full px-4 py-1.5 text-sm font-medium transition',
                  planActif === pl.id ? 'bg-cuivre text-white' : 'text-noir/60 hover:text-noir',
                ].join(' ')}
              >
                {pl.nom}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl2 border border-noir/10 bg-white shadow-carte">
        <div className="relative">
          {plans.map(
            (pl) =>
              pl.id === planActif && (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={pl.id} src={pl.image} alt={`Plan ${pl.nom}`} className="block w-full" />
              ),
          )}

          {/* Repères */}
          {reperesDuPlan.map((r, i) => {
            const num = numeroParPoste.get(r.posteId) ?? '•';
            const vu = consultes.has(r.posteId);
            const actif = selection === i;
            return (
              <button
                key={`${r.posteId}-${i}`}
                type="button"
                onClick={() => {
                  setSelection(actif ? null : i);
                  if (!actif) onConsulter(r.posteId);
                }}
                aria-label={`Menuiserie : ${posteById(r.posteId)?.identite.designation ?? ''}`}
                className={[
                  'absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[12px] font-bold shadow-carte ring-2 ring-white transition',
                  actif ? 'scale-125 bg-maquis text-creme' : vu ? 'bg-maquis/80 text-creme' : 'bg-cuivre text-white',
                  'hover:scale-125',
                ].join(' ')}
                style={{ left: `${r.x}%`, top: `${r.y}%` }}
              >
                {num}
              </button>
            );
          })}

          {/* Bulle d'infos */}
          {selRepere && selPoste && (
            <div
              className="absolute z-20 w-60 max-w-[80vw] rounded-xl2 border border-noir/10 bg-white p-4 shadow-carteHover"
              style={{
                left: `${Math.min(Math.max(selRepere.x, 20), 80)}%`,
                top: `${selRepere.y}%`,
                transform: selRepere.y < 40 ? 'translate(-50%, 16px)' : 'translate(-50%, calc(-100% - 16px))',
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
              {selPoste.localisation?.piece && (
                <span className="text-[11px] font-medium uppercase tracking-wide text-maquis">
                  {selPoste.localisation.piece}
                </span>
              )}
              <h4 className="mt-0.5 pr-4 font-titre text-base font-semibold leading-tight">
                {selPoste.identite.designation}
              </h4>
              <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-noir/60">
                {selPoste.benefice.texte}
              </p>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <PrixTag prix={selPoste.prix} />
                <button
                  type="button"
                  onClick={() => onVoirDetail(selPoste.id)}
                  className="shrink-0 rounded-full bg-cuivre px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
                >
                  Voir le détail →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
