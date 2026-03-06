// app/legal/community-guidelines/page.tsx
// ✅ v2.1 — 6 mars 2026 · support@magic-clock.com · BackButton géré par layout
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Charte de la communauté – Magic Clock",
};

export default function CommunityGuidelinesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Charte de la communauté
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Les règles essentielles pour que Magic Clock reste un espace
            pédagogique, respectueux, sûr et inspirant pour tous.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Dernière mise à jour : 6 mars 2026
          </p>
        </div>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Esprit de Magic Clock
          </h2>
          <p className="mt-2">
            Magic Clock est une plateforme dédiée à la{" "}
            <strong>création</strong>, au <strong>partage</strong> et à la
            <strong> transmission de contenus pédagogiques</strong>. Nous
            souhaitons favoriser une culture de <strong>respect</strong>, de{" "}
            <strong>sécurité</strong>, de <strong>bonne foi</strong> et de{" "}
            <strong>transparence</strong>.
          </p>
          <p className="mt-2">
            Chaque utilisateur contribue à la qualité de la plateforme par la
            manière dont il publie, échange, commente et signale les contenus.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Contenus encouragés
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>tutoriels, démonstrations et explications pédagogiques ;</li>
            <li>avant / après honnêtes, clairs et non trompeurs ;</li>
            <li>conseils professionnels, astuces, bonnes pratiques ;</li>
            <li>
              contenus respectueux des personnes filmées, photographiées ou
              mentionnées ;
            </li>
            <li>
              publications utiles, inspirantes ou informatives pour la
              communauté.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Contenus et comportements interdits
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              discours haineux, harcèlement, menaces, intimidation ou
              humiliation ciblée ;
            </li>
            <li>
              discrimination fondée sur l’origine, la nationalité, la religion,
              le sexe, le genre, l’orientation sexuelle, le handicap ou tout
              autre critère protégé ;
            </li>
            <li>
              contenus violents, choquants, sexuellement explicites ou
              contraires aux lois applicables ;
            </li>
            <li>
              contenus faisant la promotion de comportements dangereux,
              d’automutilation, d’activités illicites ou de pratiques
              manifestement risquées sans cadre approprié ;
            </li>
            <li>
              diffusion de données personnelles d’autrui sans autorisation
              (doxxing, divulgation abusive, atteinte à la vie privée) ;
            </li>
            <li>
              fraudes, arnaques, systèmes pyramidaux, manipulations de
              paiement, faux témoignages ou publicité trompeuse ;
            </li>
            <li>
              contenus portant atteinte aux droits de propriété intellectuelle
              de tiers, tels que définis dans la{" "}
              <Link
                href="/legal/ip-policy"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                politique relative à la propriété intellectuelle
              </Link>
              ;
            </li>
            <li>
              usurpation d’identité, faux comptes ou comportements destinés à
              tromper la communauté.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Utilisation par des mineurs
          </h2>
          <p className="mt-2">
            La plateforme n’est pas destinée aux personnes n’ayant pas atteint
            l’âge minimum indiqué dans nos{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>
            . Les contenus impliquant des mineurs doivent respecter strictement
            les lois applicables et les autorisations nécessaires.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Signaler un contenu ou un comportement
          </h2>
          <p className="mt-2">
            Si vous estimez qu’un contenu, un profil ou un comportement enfreint
            la présente Charte, les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>{" "}
            ou la loi applicable, vous pouvez utiliser la fonction{" "}
            <strong>« Signaler »</strong> disponible sur la plateforme ou nous
            écrire à{" "}
            <a
              href="mailto:support@magic-clock.com"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              support@magic-clock.com
            </a>
            .
          </p>
          <p className="mt-2">
            Les signalements doivent être faits de bonne foi et avec un niveau
            de précision suffisant pour permettre leur examen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Mesures possibles en cas de violation
          </h2>
          <p className="mt-2">
            En cas de violation de la présente Charte, des{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>
            , des{" "}
            <Link
              href="/legal/cgv"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGV
            </Link>{" "}
            ou de la loi applicable, Magic Clock peut notamment :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>retirer un contenu ou en limiter la visibilité ;</li>
            <li>restreindre certaines fonctionnalités d’un compte ;</li>
            <li>suspendre temporairement un compte ;</li>
            <li>fermer définitivement un compte ;</li>
            <li>
              bloquer ou différer certains versements lorsqu’un contenu ou une
              activité paraît manifestement illicite, frauduleux ou contraire
              aux règles applicables.
            </li>
          </ul>
          <p className="mt-2">
            Les mesures prises dépendent de la gravité des faits, de leur
            répétition, des éléments disponibles et des obligations légales de
            la plateforme.
          </p>
        </section>
      </div>
    </main>
  );
}
