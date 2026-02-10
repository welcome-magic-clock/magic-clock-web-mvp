// app/legal/security/page.tsx

export const metadata = {
  title: "Sécurité & incidents – Magic Clock",
};

export default function SecurityPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Sécurité &amp; gestion des incidents
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Ce document résume les mesures minimales que nous mettons en place
          pour protéger vos données et la Plateforme Magic Clock, ainsi que
          la façon dont nous gérons les incidents de sécurité.
        </p>
      </header>

      <section className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Objectif du plan
          </h2>
          <p className="mt-2">
            Le plan de sécurité de Magic Clock vise à réduire au minimum le
            risque d&apos;accès non autorisé, de perte ou de divulgation de
            données, et à garantir une réaction rapide et structurée en cas
            d&apos;incident.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Protection des données
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Hébergement chez des fournisseurs cloud reconnus, avec centres
              de données situés en Europe ou en Suisse (selon l&apos;environnement).
            </li>
            <li>
              Accès aux systèmes limité aux membres autorisés de l&apos;équipe,
              protégés par authentification forte (mot de passe robuste, 2FA
              lorsque disponible).
            </li>
            <li>
              Séparation des environnements (développement / test / production)
              autant que possible, pour limiter l&apos;impact d&apos;une erreur
              ou d&apos;un incident.
            </li>
            <li>
              Journalisation des événements importants (connexions, actions
              sensibles, erreurs critiques) pour faciliter l&apos;analyse en
              cas de problème.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Gestion des incidents de sécurité
          </h2>
          <p className="mt-2">
            En cas d&apos;incident de sécurité suspecté ou confirmé
            (compte compromis, fuite de données, comportement anormal du
            système, etc.), nous appliquons au minimum les étapes suivantes :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Identification et confinement rapide de l&apos;incident.</li>
            <li>
              Analyse technique pour comprendre l&apos;origine et l&apos;ampleur
              du problème.
            </li>
            <li>
              Correction ou mise en place de mesures de mitigation
              (ex. blocage de compte, rotation des clés, correctifs).
            </li>
            <li>
              Documentation de l&apos;incident dans un rapport interne et
              amélioration de nos contrôles si nécessaire.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Notification des utilisateurs
          </h2>
          <p className="mt-2">
            Si un incident de sécurité a un impact significatif sur vos
            données personnelles, nous vous en informerons dans un délai
            raisonnable, conformément au droit applicable, avec les
            informations disponibles au moment de la notification.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Nous contacter en cas de suspicion
          </h2>
          <p className="mt-2">
            Si vous pensez avoir détecté un problème de sécurité ou un usage
            anormal de votre compte, vous pouvez nous contacter à
            l&apos;adresse suivante :
          </p>
          <p className="mt-1 font-medium text-slate-900">
            security@magic-clock.com
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Cette page est un résumé. Le plan détaillé de sécurité et de gestion
            des incidents est documenté en interne pour l&apos;équipe Magic
            Clock et mis à jour régulièrement.
          </p>
        </section>
      </section>
    </main>
  );
}
