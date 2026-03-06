// app/legal/ip-policy/page.tsx
// ✅ v2.0 — Date 6 mars 2026 · support@magic-clock.com · BackButton retiré (géré par layout)
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Propriété intellectuelle & procédure de retrait – Magic Clock",
};

export default function IpPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Propriété intellectuelle &amp; procédure de retrait
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Règles relatives aux contenus créés sur Magic Clock, aux droits
            d'auteur et à la procédure en cas d'atteinte présumée.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Dernière mise à jour : 6 mars 2026
          </p>
        </div>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Titularité des droits sur les contenus utilisateurs
          </h2>
          <p className="mt-2">
            Les contenus que vous créez et publiez sur Magic Clock restent en
            principe votre propriété, sous réserve des droits concédés à Magic
            Clock dans les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Licence accordée à Magic Clock
          </h2>
          <p className="mt-2">
            En publiant un contenu, vous accordez à Magic Clock une licence
            mondiale, non exclusive, transférable et gratuite pour&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>héberger, reproduire et représenter vos contenus ;</li>
            <li>
              les diffuser sur la Plateforme, y compris via les flux publics ;
            </li>
            <li>
              les adapter techniquement (compression, encodage, vignettes) pour
              des raisons de compatibilité ;
            </li>
            <li>
              les utiliser pour la promotion raisonnable de la Plateforme, sauf
              retrait spécifique.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Cette licence n'affecte pas vos droits en tant que créateur.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Contenus interdits au regard de la propriété intellectuelle
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              reproduire ou utiliser sans autorisation des œuvres protégées
              (photos, vidéos, musiques, textes, logiciels, etc.) ;
            </li>
            <li>
              reprendre des marques, logos ou designs protégés sans
              autorisation ;
            </li>
            <li>
              intégrer l'image de personnes sans leur consentement lorsqu'il
              est requis ;
            </li>
            <li>usurper l'identité d'un tiers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Procédure de notification &amp; de retrait (takedown)
          </h2>
          <p className="mt-2">
            Si vous estimez qu'un contenu porte atteinte à vos droits, envoyez
            une notification à&nbsp;:
          </p>
          <p className="mt-2">
            E-mail&nbsp;:{" "}
            <a
              href="mailto:support@magic-clock.com"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              support@magic-clock.com
            </a>
          </p>
          <p className="mt-2">Votre notification doit contenir :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>vos nom, prénom (ou raison sociale) et coordonnées ;</li>
            <li>
              l'URL ou tout identifiant permettant de localiser le contenu
              litigieux ;
            </li>
            <li>
              une description des droits invoqués et la preuve de votre qualité
              de titulaire ou d'ayant droit ;
            </li>
            <li>
              une déclaration sur l'honneur attestant l'exactitude des
              informations ;
            </li>
            <li>votre signature (manuscrite ou électronique).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Sanctions en cas de violation répétée
          </h2>
          <p className="mt-2">
            Les utilisateurs publiant de manière répétée des contenus violant
            des droits de propriété intellectuelle pourront voir leur compte
            restreint, suspendu ou fermé, conformément aux{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>{" "}
            et à la{" "}
            <Link
              href="/legal/community-guidelines"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Charte de la communauté
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
