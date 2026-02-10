// app/legal/ip-policy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/navigation/BackButton";

export const metadata: Metadata = {
  title: "Propriété intellectuelle & procédure de retrait – Magic Clock",
};

export default function IpPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <BackButton fallbackHref="/legal" label="Retour à la section Légal" />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Propriété intellectuelle &amp; procédure de retrait
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Règles relatives aux contenus créés sur Magic Clock, aux droits
            d’auteur et à la procédure en cas d’atteinte présumée.
          </p>
        </div>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* 1. Titularité des droits */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Titularité des droits sur les contenus utilisateurs
          </h2>
          <p className="mt-2">
            Les contenus que vous créez et publiez sur Magic Clock (photos,
            vidéos, Magic Studio, Magic Display, descriptions, etc.) restent
            en principe la propriété de leurs auteurs, sous réserve des droits
            concédés à Magic Clock dans les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>
            .
          </p>
          <p className="mt-2">
            En publiant un contenu sur la Plateforme, vous déclarez disposer de
            tous les droits nécessaires (droits d’auteur, droits de la
            personnalité, droits sur les marques, etc.) et vous garantissez que
            ce contenu ne viole pas les droits de tiers.
          </p>
        </section>

        {/* 2. Licence accordée à Magic Clock */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Licence accordée à Magic Clock
          </h2>
          <p className="mt-2">
            En téléversant ou en publiant un contenu sur Magic Clock, vous
            accordez à Magic Clock une licence mondiale, non exclusive,
            transférable, sous-licenciable, gratuite, pour la durée légale de
            protection des droits, afin de&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>héberger, reproduire et représenter vos contenus ;</li>
            <li>
              les diffuser sur la Plateforme et dans l’app, y compris via les
              flux publics (Amazing) et vos pages créateur ;
            </li>
            <li>
              les adapter techniquement (compression, encodage, recadrage,
              vignettes, extraits) pour des raisons de compatibilité et de
              performance ;
            </li>
            <li>
              les utiliser pour la promotion raisonnable de la Plateforme
              (exemples visuels, extraits anonymisés), sauf retrait ou
              paramétrage spécifique lorsqu’il sera proposé.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Cette licence n’affecte pas vos droits en tant que créateur&nbsp;:
            vous restez libre d’exploiter vos contenus sur d’autres plateformes
            ou supports.
          </p>
        </section>

        {/* 3. Contenus interdits */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Contenus interdits au regard de la propriété intellectuelle
          </h2>
          <p className="mt-2">
            Il est interdit de publier sur Magic Clock des contenus qui&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              reproduisent ou utilisent sans autorisation des œuvres protégées
              (photos, vidéos, musiques, tutoriels, textes, logiciels, etc.) ;
            </li>
            <li>
              reprennent des marques, logos, chartes graphiques ou designs
              protégés sans autorisation suffisante ;
            </li>
            <li>
              intègrent l’image de personnes qui n’ont pas consenti à cette
              utilisation, lorsque le consentement est requis ;
            </li>
            <li>
              usurpent l’identité d’un tiers ou donnent une fausse impression de
              partenariat officiel.
            </li>
          </ul>
        </section>

        {/* 4. Procédure de notification & retrait */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Procédure de notification &amp; de retrait (takedown)
          </h2>
          <p className="mt-2">
            Si vous estimez qu’un contenu disponible sur Magic Clock porte
            atteinte à vos droits de propriété intellectuelle ou à vos droits de
            personnalité, vous pouvez nous adresser une notification écrite
            contenant au minimum&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>vos nom, prénom (ou raison sociale) et coordonnées ;</li>
            <li>
              l’URL ou tout identifiant permettant de localiser précisément le
              contenu litigieux ;
            </li>
            <li>
              une description des droits que vous invoquez (par exemple droits
              d’auteur, marque, image) et, si possible, la preuve de votre
              qualité de titulaire ou d’ayant droit ;
            </li>
            <li>
              une déclaration sur l’honneur indiquant que les informations
              fournies sont exactes et que vous êtes autorisé à agir ;
            </li>
            <li>votre signature (manuscrite ou électronique).</li>
          </ul>
          <p className="mt-2">
            La notification peut être envoyée à l’adresse suivante&nbsp;:
          </p>
          <p className="mt-2">
            E-mail&nbsp;:{" "}
            <a
              href="mailto:[email-ip-à-compléter]"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              [email-ip-à-compléter]
            </a>
          </p>
          <p className="mt-2">
            Après réception, nous pourrons{" "}
            <strong>retirer temporairement le contenu</strong>, demander des
            informations complémentaires au créateur concerné et, le cas
            échéant, supprimer définitivement le contenu ou prendre des mesures
            supplémentaires prévues par les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>
            .
          </p>
        </section>

        {/* 5. Sanctions */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Sanctions en cas de violation répétée
          </h2>
          <p className="mt-2">
            Les utilisateurs qui publient de manière répétée des contenus
            violant les droits de propriété intellectuelle de tiers pourront
            voir leur compte restreint, suspendu ou fermé, conformément aux{" "}
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
