// app/legal/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Légal – Magic Clock",
};

export default function LegalIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Légal
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Retrouve ici les principaux documents juridiques qui encadrent
          l’utilisation de la plateforme Magic Clock. Les versions définitives
          seront validées par notre cabinet d’avocats avant le lancement
          commercial.
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* Bloc CGV / CGU */}
        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">CGV</h2>
            <p className="mt-2 text-sm text-slate-600">
              Conditions générales de vente et de monétisation sur Magic Clock
              (créateurs, abonnements, contenus payants).
            </p>
            <Link
              href="/legal/cgv"
              className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Voir les CGV
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">CGU</h2>
            <p className="mt-2 text-sm text-slate-600">
              Conditions générales d’utilisation de la plateforme : création de
              compte, contenus UGC, règles de la communauté.
            </p>
            <Link
              href="/legal/cgu"
              className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Voir les CGU
            </Link>
          </article>
        </section>

        {/* Bloc FAQ créateurs */}
        <section>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              FAQ créateurs
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Questions fréquentes sur la rémunération des créateurs, les
              versements, les seuils minimums et la fréquence des paiements.
            </p>
            <Link
              href="/legal/faq"
              className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Consulter la FAQ
            </Link>
          </article>
        </section>

        {/* Privacy & cookies */}
        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Politique de confidentialité
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Comment nous collectons, utilisons et protégeons les données
              personnelles sur Magic Clock.
            </p>
            <Link
              href="/legal/privacy"
              className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Lire la politique
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Politique de cookies
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Informations sur les cookies et technologies similaires utilisés
              pour le fonctionnement, les statistiques et, le cas échéant, le
              marketing.
            </p>
            <Link
              href="/legal/cookies"
              className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Gérer et comprendre les cookies
            </Link>
          </article>
        </section>

        <p className="text-xs text-slate-400">
          Ces documents sont fournis à titre de base de travail pour la version
          bêta de Magic Clock et pourront être ajustés avec notre cabinet
          d’avocats avant le lancement commercial.
        </p>
      </div>
    </main>
  );
}
