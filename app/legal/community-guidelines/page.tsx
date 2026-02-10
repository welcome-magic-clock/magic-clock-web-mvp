// app/legal/community-guidelines/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/navigation/BackButton";

export const metadata: Metadata = {
  title: "Charte de la communauté – Magic Clock",
};

export default function CommunityGuidelinesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <BackButton fallbackHref="/legal" label="Retour à la section Légal" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Charte de la communauté
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Les règles essentielles pour que Magic Clock reste un espace
            pédagogique, bienveillant et inspirant pour tous.
          </p>
        </div>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* 1. Esprit général */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Esprit de Magic Clock
          </h2>
          <p className="mt-2">
            Magic Clock est une plateforme dédiée à la <strong>création</strong>{" "}
            et au <strong>partage de contenus pédagogiques</strong>, notamment
            dans le domaine de la beauté, de la coiffure et des transformations
            visuelles. Nous voulons favoriser une culture de{" "}
            <strong>respect</strong>, de <strong>sécurité</strong> et de{" "}
            <strong>transparence</strong>.
          </p>
        </section>

        {/* 2. Contenus encouragés */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Contenus encouragés
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>tutoriels et explications pédagogiques (Magic Display) ;</li>
            <li>avant / après (Magic Studio) honnêtes et non trompeurs ;</li>
            <li>conseils professionnels, astuces, bonnes pratiques ;</li>
            <li>
              contenus respectueux des personnes filmées ou photographiées.
            </li>
          </ul>
        </section>

        {/* 3. Contenus interdits */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Contenus et comportements interdits
          </h2>
          <p className="mt-2">
            Sont notamment interdits sur Magic Clock (liste non exhaustive)&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              discours haineux, harcèlement, menaces, intimidation ou
              humiliation ciblée ;
            </li>
            <li>
              discrimination fondée sur la race, la religion, le genre,
              l’orientation sexuelle, le handicap ou tout autre critère protégé
              par la loi ;
            </li>
            <li>
              nudité explicite ou contenus à caractère sexuel destinés à
              l’excitation ou enfreignant les lois applicables ;
            </li>
            <li>
              contenus glorifiant l’automutilation, les troubles alimentaires ou
              des comportements dangereux sans message de prévention ;
            </li>
            <li>
              diffusion de données personnelles sensibles d’autrui (doxxing) ;
            </li>
            <li>
              fraudes, arnaques, systèmes pyramidaux, publicité trompeuse ;
            </li>
            <li>
              contenus violant les droits de propriété intellectuelle de tiers,
              tels que définis dans la{" "}
              <Link
                href="/legal/ip-policy"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                politique IP
              </Link>
              .
            </li>
          </ul>
        </section>

        {/* 4. Mineurs et âge minimum */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Utilisation par des mineurs
          </h2>
          <p className="mt-2">
            La Plateforme n’est pas destinée aux personnes en dessous de l’âge
            minimum indiqué dans nos{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>
            . Nous pourrons demander des justificatifs ou suspendre un compte en
            cas de doute sérieux sur l’âge déclaré.
          </p>
        </section>

        {/* 5. Signalement */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Signaler un contenu ou un comportement
          </h2>
          <p className="mt-2">
            Si vous voyez un contenu ou un comportement qui semble violer cette
            Charte, vous pouvez utiliser la fonction <strong>“Signaler”</strong>{" "}
            prévue dans l’app (lorsqu’elle est disponible) ou nous écrire à{" "}
            <a
              href="mailto:[email-support-à-compléter]"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              [email-support-à-compléter]
            </a>
            .
          </p>
        </section>

        {/* 6. Sanctions */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Mesures possibles
          </h2>
          <p className="mt-2">
            En cas de violation de la présente Charte ou des{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>
            , Magic Clock peut notamment&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>retirer ou limiter la visibilité d’un contenu ;</li>
            <li>restreindre certaines fonctionnalités du compte ;</li>
            <li>suspendre ou fermer un compte utilisateur ;</li>
            <li>
              bloquer les versements liés à des contenus manifestement illicites,
              conformément aux CGV.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
