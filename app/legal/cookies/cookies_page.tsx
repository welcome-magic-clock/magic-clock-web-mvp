// app/legal/cookies/page.tsx
// ✅ v2.0 — Date 6 mars 2026 · Magic Clock Maldonado-Verger RI · support@magic-clock.com
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
          <h2 className="text-base font-semibold text-slate-900">1. À propos de cette Politique</h2>
          <p className="mt-2">
            La présente politique de cookies explique comment{" "}
            <strong>Magic Clock Maldonado-Verger RI</strong> utilise des cookies et
            technologies similaires (tags, pixels, SDK, stockage local, etc.) sur la
            Plateforme <strong>Magic Clock</strong>.
          </p>
          <p className="mt-2">
            Elle doit être lue conjointement avec notre{" "}
            <a href="/legal/privacy" className="font-medium text-indigo-600 hover:text-indigo-700">
              Politique de confidentialité
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">2. Qu'est-ce qu'un cookie ?</h2>
          <p className="mt-2">
            Un <strong>cookie</strong> est un petit fichier texte enregistré sur votre appareil
            lorsque vous consultez un site web. Il permet de reconnaître votre appareil, de
            mémoriser vos préférences et d'améliorer votre expérience.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">3. Types de cookies utilisés</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Cookies strictement nécessaires</strong> : indispensables au fonctionnement
              de la Plateforme (connexion, sécurité, gestion des sessions).
            </li>
            <li>
              <strong>Cookies de performance et de statistiques</strong> : mesure d'audience,
              détection d'erreurs. Les données sont généralement agrégées.
            </li>
            <li>
              <strong>Cookies de fonctionnalité</strong> : mémorisation de certaines préférences
              (mode sombre, langue, filtres).
            </li>
            <li>
              <strong>Cookies de marketing / suivi</strong> (facultatifs) : activés uniquement
              après votre consentement lorsqu'il est requis.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            À ce stade, Magic Clock fonctionne principalement avec des cookies strictement
            nécessaires. L'introduction de cookies marketing fera l'objet d'un choix clair.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">4. Cookies de tiers</h2>
          <p className="mt-2">Certains cookies sont déposés par des services tiers intégrés :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>prestataires d'hébergement (Vercel, Supabase, Cloudflare) ;</li>
            <li>prestataire de paiement (Stripe) ;</li>
            <li>outils de mesure d'audience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">5. Durée de vie des cookies</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Cookies de session</strong> : supprimés à la fermeture du navigateur.</li>
            <li>
              <strong>Cookies persistants</strong> : conservés pendant une durée limitée
              (généralement de quelques minutes à 12 mois).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">6. Comment gérer vos cookies ?</h2>
          <p className="mt-2">
            Lors de votre première visite, une bannière vous permet d'accepter, refuser ou
            personnaliser l'utilisation de certains cookies. Vous pouvez modifier vos choix
            via le module <strong>« Préférences cookies »</strong> en pied de page.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">7. Cookies et données personnelles</h2>
          <p className="mt-2">
            Lorsque les cookies permettent d'identifier une personne physique, les informations
            collectées sont traitées comme des données personnelles et soumises à notre{" "}
            <a href="/legal/privacy" className="font-medium text-indigo-600 hover:text-indigo-700">
              Politique de confidentialité
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">8. Mise à jour</h2>
          <p className="mt-2">
            Nous pouvons mettre à jour la présente Politique. La date de dernière mise à jour
            figure en haut de page.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">9. Contact</h2>
          <p className="mt-2">
            Pour toute question :{" "}
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
