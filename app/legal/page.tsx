// app/legal/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Légal – Magic Clock",
};

export default function LegalIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Légal
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Retrouve ici les principaux documents juridiques qui encadrent
          l’utilisation de la plateforme Magic Clock. Les versions définitives
          seront validées par notre cabinet d’avocats spécialisé.
        </p>
      </header>

      {/* Cards container */}
      <section className="grid gap-4 sm:grid-cols-2">
        {/* CGV */}
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">CGV</h2>
          <p className="mt-1 text-xs text-slate-500">
            Conditions générales de vente et de monétisation sur Magic Clock
            (créateurs, abonnements, contenus payants).
          </p>
          <Link
            href="/legal/cgv"
            className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Voir les CGV
          </Link>
        </article>

        {/* CGU */}
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">CGU</h2>
          <p className="mt-1 text-xs text-slate-500">
            Conditions générales d’utilisation de la plateforme&nbsp;:
            création de compte, contenus UGC, règles de la communauté.
          </p>
          <Link
            href="/legal/cgu"
            className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Voir les CGU
          </Link>
        </article>

        {/* Privacy */}
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Politique de confidentialité
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Comment nous collectons, utilisons et protégeons les données
            personnelles sur Magic Clock.
          </p>
          <Link
            href="/legal/privacy"
            className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Lire la politique
          </Link>
        </article>

        {/* Cookies */}
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Politique de cookies
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Informations sur les cookies et technologies similaires utilisés
            pour le fonctionnement, les statistiques et, le cas échéant,
            le marketing.
          </p>
          <Link
            href="/legal/cookies"
            className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Gérer et comprendre les cookies
          </Link>
        </article>
      </section>

      {/* Petit rappel en bas */}
      <p className="mt-8 text-[11px] leading-relaxed text-slate-400">
        Ces documents sont fournis à titre de base de travail pour la version
        bêta de Magic Clock. Ils pourront être ajustés et complétés en
        collaboration avec le cabinet d’avocats mandaté avant le lancement
        commercial.
      </p>
    </main>
  );
}
