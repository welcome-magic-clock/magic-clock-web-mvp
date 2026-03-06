// app/legal/cookies/page.tsx
// ✅ v2.1 — 6 mars 2026 · Magic Clock Maldonado-Verger RI · support@magic-clock.com
export const metadata = {
  title: "Politique de cookies – Magic Clock",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Politique de cookies
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Plateforme Magic Clock – Dernière mise à jour : 6 mars 2026
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. À propos de cette Politique
          </h2>
          <p className="mt-2">
            La présente politique de cookies explique comment{" "}
            <strong>Magic Clock Maldonado-Verger RI</strong> utilise des cookies
            et technologies similaires (par exemple tags, pixels, stockage
            local, identifiants de session et autres technologies comparables)
            sur la plateforme <strong>Magic Clock</strong>.
          </p>
          <p className="mt-2">
            Elle doit être lue conjointement avec notre{" "}
            <a
              href="/legal/privacy"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de confidentialité
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Qu&apos;est-ce qu&apos;un cookie ?
          </h2>
          <p className="mt-2">
            Un <strong>cookie</strong> est un petit fichier texte enregistré sur
            votre appareil lorsque vous consultez un site web ou utilisez un
            service en ligne. Il permet notamment de reconnaître votre appareil,
            de mémoriser certaines préférences, de sécuriser votre session et
            d’améliorer votre expérience d’utilisation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Types de cookies et technologies similaires utilisés
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Cookies strictement nécessaires</strong> : indispensables
              au fonctionnement de la plateforme, à l’authentification, à la
              sécurité, à la gestion des sessions et à l’accès à certaines
              fonctionnalités essentielles.
            </li>
            <li>
              <strong>Cookies de performance et de statistiques</strong> :
              utilisés pour mesurer l’audience, détecter des erreurs,
              comprendre l’usage de certaines fonctionnalités et améliorer les
              performances globales du service.
            </li>
            <li>
              <strong>Cookies de fonctionnalité</strong> : permettent de
              mémoriser certaines préférences, comme la langue, certains filtres
              ou d’autres choix d’interface.
            </li>
            <li>
              <strong>Cookies de marketing ou de suivi</strong> : utilisés
              uniquement lorsqu’ils sont activés et lorsque votre consentement
              est requis par la loi applicable.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Magic Clock utilise en priorité les cookies strictement nécessaires
            au fonctionnement du service. Les autres catégories peuvent dépendre
            des fonctionnalités activées, des services tiers utilisés et des
            choix exprimés par l’utilisateur.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Cookies et technologies de tiers
          </h2>
          <p className="mt-2">
            Certains cookies ou technologies similaires peuvent être déposés ou
            exploités par des services tiers intégrés à la plateforme, par
            exemple :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              des prestataires d’hébergement, d’infrastructure ou de sécurité
              comme Vercel, Supabase ou Cloudflare ;
            </li>
            <li>
              un prestataire de paiement comme Stripe dans le cadre des flux de
              paiement ou de vérification liés à une transaction ;
            </li>
            <li>
              des outils de mesure d’audience, de performance ou de détection
              d’erreurs lorsqu’ils sont activés.
            </li>
          </ul>
          <p className="mt-2">
            Ces tiers peuvent traiter certaines données selon leurs propres
            conditions et politiques de confidentialité.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Durée de vie des cookies
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Cookies de session</strong> : supprimés à la fermeture du
              navigateur ou à la fin de la session.
            </li>
            <li>
              <strong>Cookies persistants</strong> : conservés pendant une durée
              limitée, variable selon leur finalité, la configuration technique
              et les obligations applicables.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Comment gérer vos cookies ?
          </h2>
          <p className="mt-2">
            Lors de votre première visite, une bannière ou un module de
            préférences peut vous permettre d’accepter, de refuser ou de
            personnaliser l’utilisation de certaines catégories de cookies,
            lorsque cela est requis.
          </p>
          <p className="mt-2">
            Vous pouvez également modifier vos préférences ultérieurement via
            les outils mis à disposition sur la plateforme, lorsqu’ils sont
            disponibles, ou via les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Cookies et données personnelles
          </h2>
          <p className="mt-2">
            Lorsque les cookies ou technologies similaires permettent
            d’identifier directement ou indirectement une personne physique, les
            informations collectées sont traitées comme des données
            personnelles et soumises à notre{" "}
            <a
              href="/legal/privacy"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de confidentialité
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Mise à jour de la présente Politique
          </h2>
          <p className="mt-2">
            Nous pouvons mettre à jour la présente Politique afin de refléter
            les évolutions légales, techniques, organisationnelles ou liées aux
            services proposés. La date de dernière mise à jour figure en haut de
            page.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Contact
          </h2>
          <p className="mt-2">
            Pour toute question relative à la présente Politique :{" "}
            <a
              href="mailto:support@magic-clock.com"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              support@magic-clock.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
