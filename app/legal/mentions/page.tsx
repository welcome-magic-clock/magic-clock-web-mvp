// app/legal/mentions/page.tsx
// ✅ v2.1 — 6 mars 2026 · Magic Clock Maldonado-Verger RI · support@magic-clock.com
// BackButton géré par app/legal/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales – Magic Clock",
};

export default function LegalMentionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Mentions légales / Impressum
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Informations relatives à l’éditeur de la plateforme Magic Clock et
            aux principaux moyens de contact.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Dernière mise à jour : 6 mars 2026
          </p>
        </div>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Éditeur de la plateforme
          </h2>
          <p className="mt-2">
            La plateforme <strong>Magic Clock</strong> est exploitée par
            l’entreprise individuelle :
          </p>
          <p className="mt-2">
            <strong>Magic Clock Maldonado-Verger RI</strong>
            <br />
            Rue des Saars 6
            <br />
            2000 Neuchâtel – Suisse
            <br />
            IDE : <strong>CHE-202.752.000</strong>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Contact
          </h2>
          <p className="mt-2">
            Pour toute question relative à la plateforme, à son fonctionnement
            ou aux documents juridiques :
          </p>
          <p className="mt-2">
            E-mail :{" "}
            <a
              href="mailto:support@magic-clock.com"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              support@magic-clock.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Hébergement et prestataires techniques
          </h2>
          <p className="mt-2">
            La plateforme s’appuie notamment sur les prestataires techniques
            suivants :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Vercel Inc.</strong> — hébergement et déploiement de
              l’application web
            </li>
            <li>
              <strong>Supabase Inc.</strong> — base de données,
              authentification et stockage
            </li>
            <li>
              <strong>Cloudflare Inc.</strong> — diffusion de contenu,
              optimisation réseau et stockage média
            </li>
            <li>
              <strong>Stripe, Inc. et/ou ses affiliés</strong> — traitement
              sécurisé des paiements
            </li>
            <li>
              <strong>GitHub, Inc.</strong> — infrastructure de développement et
              hébergement du code source
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Selon les services utilisés, certaines données peuvent être traitées
            en Suisse, dans l’Union européenne ou dans d’autres pays, dans le
            respect des mécanismes juridiques applicables en matière de
            protection des données.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Propriété intellectuelle
          </h2>
          <p className="mt-2">
            La structure générale de la plateforme, son identité visuelle, ses
            textes, marques, logos, éléments graphiques, interfaces et contenus
            propres à Magic Clock sont protégés par le droit applicable de la
            propriété intellectuelle.
          </p>
          <p className="mt-2">
            Toute reproduction, représentation, extraction, réutilisation ou
            exploitation non autorisée de tout ou partie de ces éléments peut
            constituer une atteinte aux droits de Magic Clock ou de tiers.
          </p>
          <p className="mt-2">
            Les contenus publiés par les utilisateurs et créateurs sont régis
            par les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>{" "}
            ainsi que par la{" "}
            <Link
              href="/legal/ip-policy"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              politique relative à la propriété intellectuelle
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Réclamations et litiges
          </h2>
          <p className="mt-2">
            En cas de question, réclamation ou différend, nous invitons d’abord
            les utilisateurs à prendre contact avec Magic Clock par e-mail afin
            de rechercher une solution amiable.
          </p>
          <p className="mt-2">
            Les conditions applicables à l’utilisation de la plateforme, aux
            ventes, aux paiements et à la monétisation sont précisées dans les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>{" "}
            et les{" "}
            <Link
              href="/legal/cgv"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGV
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
