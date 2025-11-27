// app/legal/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Légal – Magic Clock",
};

export default function LegalIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Légal
        </h1>
        <p className="text-sm text-slate-700">
          Retrouve ici les principaux documents juridiques qui encadrent
          l’utilisation de la plateforme Magic Clock. Les versions définitives
          seront validées avec notre cabinet d’avocats spécialisé.
        </p>
      </header>

      {/* Bloc principal de cartes */}
      <section className="space-y-8">
        {/* CGV / CGU */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* CGV */}
          <Link
            href="/legal/cgv"
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              CGV – Conditions générales de vente & monétisation
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Règles de vente et de monétisation sur Magic Clock&nbsp;:
              abonnements, contenus PPV, commission plateforme, versements
              créateurs, TVA, remboursements, etc.
            </p>
            <p className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
              Voir les CGV →
            </p>
          </Link>

          {/* CGU */}
          <Link
            href="/legal/cgu"
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              CGU – Conditions générales d’utilisation
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Création de compte, règles de communauté, contenus UGC,
              modération, comportements interdits, responsabilité de la
              plateforme et des utilisateurs.
            </p>
            <p className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
              Voir les CGU →
            </p>
          </Link>
        </div>

        {/* Politique de confidentialité / cookies */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Privacy */}
          <Link
            href="/legal/privacy"
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              Politique de confidentialité
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Comment nous collectons, utilisons et protégeons les données
              personnelles sur Magic Clock (version bêta).
            </p>
            <p className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
              Lire la politique →
            </p>
          </Link>

          {/* Cookies */}
          <Link
            href="/legal/cookies"
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              Politique de cookies
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              Informations sur les cookies et technologies similaires utilisés
              pour le fonctionnement, les statistiques et, le cas échéant, le
              marketing.
            </p>
            <p className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
              Gérer et comprendre les cookies →
            </p>
          </Link>
        </div>
      </section>

      {/* Bloc complémentaire : lien vers pricing + FAQ */}
      <section className="mt-10 space-y-2 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">
          Prix, monétisation & FAQ
        </h2>
        <p>
          Pour mieux comprendre comment fonctionnent les modèles{" "}
          <strong>FREE / SUB / PPV</strong>, les commissions et les
          versements créateurs, tu peux aussi consulter&nbsp;:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            la page{" "}
            <Link
              href="/pricing"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Prix &amp; monétisation
            </Link>{" "}
            (vue d’ensemble des modèles pour utilisateurs et créateurs) ;
          </li>
          <li>
            la{" "}
            <Link
              href="/legal/faq"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              FAQ créateurs &amp; utilisateurs
            </Link>{" "}
            (détails pratiques sur les versements, paiements, abonnements et
            contenus PPV).
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          Ces documents sont fournis à titre de base de travail pour la version
          bêta de Magic Clock. Ils pourront être ajustés et complétés en
          collaboration avec notre cabinet d’avocats avant le lancement
          commercial.
        </p>
      </section>
    </main>
  );
}
