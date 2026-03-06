// app/legal/page.tsx
// ✅ v2.1 — BackButton dynamique : "Retour à l'accueil" (visiteur) / "Retour à My Magic" (connecté)
// Fix : cookies() sans await (Next.js 15 App Router)
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import BackButton from "@/components/navigation/BackButton";

export const metadata: Metadata = {
  title: "Légal – Magic Clock",
};

async function getIsLoggedIn(): Promise<boolean> {
  try {
    // Next.js 15 : cookies() est synchrone (pas de await)
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {
            // read-only dans un Server Component
          },
        },
      }
    );
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  } catch {
    return false;
  }
}

export default async function LegalIndexPage() {
  const isLoggedIn = await getIsLoggedIn();
  const backHref = isLoggedIn ? "/mymagic" : "/";
  const backLabel = isLoggedIn ? "Retour à My Magic" : "Retour à l'accueil";

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* Header avec back button bien visible */}
      <header className="mb-10 space-y-4">
        <BackButton fallbackHref={backHref} label={backLabel} />
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Légal
          </h1>
          <p className="text-sm text-slate-700">
            Retrouve ici les principaux documents juridiques qui encadrent
            l'utilisation de la plateforme Magic Clock. Les versions définitives
            seront validées avec notre cabinet d'avocats spécialisé.
          </p>
        </div>
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
              CGV – Conditions générales de vente &amp; monétisation
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
              CGU – Conditions générales d'utilisation
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

        {/* Politique de confidentialité / cookies / sécurité */}
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

        {/* Autres documents */}
        <section className="mt-10 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">
            Propriété intellectuelle, communauté &amp; sécurité
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/legal/ip-policy"
              className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Propriété intellectuelle &amp; retrait
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                Règles relatives aux droits d'auteur, à l'utilisation des
                contenus et à la procédure de retrait en cas d'atteinte
                présumée.
              </p>
              <p className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                Voir la politique IP →
              </p>
            </Link>

            <Link
              href="/legal/community-guidelines"
              className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Charte de la communauté
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                Lignes directrices pour publier des contenus pédagogiques,
                respectueux et conformes aux règles de Magic Clock.
              </p>
              <p className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                Lire la charte →
              </p>
            </Link>

            <Link
              href="/legal/security"
              className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Sécurité &amp; incidents
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                Résumé des mesures de sécurité, gestion des incidents et
                conseils pour protéger ton compte.
              </p>
              <p className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                Voir le résumé sécurité →
              </p>
            </Link>

            <Link
              href="/legal/mentions"
              className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Mentions légales / Impressum
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                Informations sur l'éditeur de Magic Clock, l'adresse de contact
                et les principaux prestataires techniques.
              </p>
              <p className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                Voir les mentions légales →
              </p>
            </Link>
          </div>
        </section>
      </section>

      {/* Bloc complémentaire */}
      <section className="mt-10 space-y-2 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">
          Prix, monétisation &amp; FAQ
        </h2>
        <p>
          Pour mieux comprendre comment fonctionnent les modèles{" "}
          <strong>FREE / SUB / PPV</strong>, les commissions et les versements
          créateurs, tu peux aussi consulter&nbsp;:
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
            (vue d'ensemble des modèles pour utilisateurs et créateurs) ;
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
          collaboration avec notre cabinet d'avocats avant le lancement
          commercial.
        </p>
      </section>
    </main>
  );
}
