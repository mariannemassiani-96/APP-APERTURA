import Link from 'next/link';

// Enregistre les secteurs (ontologies + offres seed) auprès du moteur.
import '@/sectors';
import { repository } from '@/core/data';

export default async function Accueil() {
  const offres = await repository.listOffres();

  return (
    <main className="fond-marque min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-maquis">
          Projet Lumen
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Votre devis, enfin&nbsp;lisible.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-noir/70">
          Un devis technique n’a pas à rester un PDF incompréhensible. Lumen le
          transforme en une page vivante : chaque ligne se déplie pour expliquer,
          en langage clair, ce que vous obtenez et pourquoi.
        </p>

        <div className="mt-10 space-y-3">
          {offres.map((offre) => (
            <Link
              key={offre.id}
              href={`/offre/${offre.id}`}
              className="group flex items-center justify-between rounded-xl2 border border-noir/10 bg-white/70 px-6 py-5 shadow-carte transition hover:shadow-carteHover"
            >
              <span>
                <span className="block text-lg font-semibold">
                  Devis {offre.pro.nom}
                </span>
                <span className="block text-sm text-noir/60">
                  {offre.postes.length} postes · {offre.client.nom}
                  {offre.exemple ? ' · exemple' : ''}
                </span>
              </span>
              <span
                aria-hidden
                className="text-cuivre transition group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-xs text-noir/40">
          Démo — les valeurs affichées sont des exemples à remplacer par la base
          de faits réelle.
        </p>
      </div>
    </main>
  );
}
