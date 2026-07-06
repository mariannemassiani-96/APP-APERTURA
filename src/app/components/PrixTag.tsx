import type { Prix } from '@/core/model/offre';

const formatteur = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

/** Affiche un prix avec son statut (proposé / ferme). */
export function PrixTag({ prix }: { prix: Prix }) {
  const montant = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: prix.devise ?? 'EUR',
    maximumFractionDigits: 0,
  }).format(prix.montant);

  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="text-lg font-semibold tabular-nums">{montant}</span>
      <span
        className={
          prix.statut === 'ferme'
            ? 'text-[11px] font-semibold uppercase tracking-wide text-maquis'
            : 'text-[11px] font-medium uppercase tracking-wide text-noir/45'
        }
      >
        {prix.statut === 'ferme' ? 'Prix ferme' : 'Prix proposé'}
      </span>
    </span>
  );
}

/** Formate un montant en euros (utilitaire pour les totaux). */
export function formaterEuros(montant: number): string {
  return formatteur.format(montant);
}
