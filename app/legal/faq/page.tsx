// app/legal/faq/page.tsx
// ✅ v2.1 — 6 mars 2026 · Stripe · support@magic-clock.com
export const metadata = {
  title: "FAQ – Magic Clock",
};

export default function LegalFAQPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Foire aux questions (FAQ)
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Cette page répond aux questions fréquentes sur les{" "}
          <strong>versements créateurs</strong> et sur l’expérience des{" "}
          <strong>utilisateurs (abonnements &amp; contenus PPV)</strong>.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Dernière mise à jour : 6 mars 2026 · En cas de divergence, les{" "}
          <a
            href="/legal/cgv"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            CGU/CGV
          </a>{" "}
          prévalent.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Pour un aperçu global, consulte la page{" "}
          <a
            href="/pricing"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Prix &amp; monétisation
          </a>
          .
        </p>
      </header>

      <div className="space-y-10 text-sm leading-relaxed text-slate-700">
        <section aria-labelledby="faq-creators-heading">
          <h2
            id="faq-creators-heading"
            className="text-lg font-semibold text-slate-900"
          >
            A. FAQ pour les créateurs
          </h2>

          <section className="mt-4">
            <h3 className="text-base font-semibold text-slate-900">
              1. À quelle fréquence suis-je payé ?
            </h3>
            <p className="mt-2">
              Les versements sont effectués selon les{" "}
              <strong>modalités de règlement actives sur la plateforme</strong>,
              sous réserve des délais de traitement, des exigences de
              conformité, des éventuels remboursements, contestations et du bon
              fonctionnement du compte de paiement connecté.
            </p>
            <p className="mt-1">
              Le montant versé correspond aux revenus effectivement encaissés,
              après déduction des taxes applicables, des frais de paiement, de
              la commission Magic Clock et, le cas échéant, des ajustements
              applicables.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              2. Y a-t-il un seuil minimum de versement ?
            </h3>
            <p className="mt-2">
              Un <strong>seuil minimum de versement</strong> peut s’appliquer
              selon le pays, la devise, le moyen de paiement ou la
              configuration active de la plateforme. Lorsqu’un seuil
              s’applique et n’est pas atteint, le solde peut être reporté sur
              la période suivante.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              3. Dans quelle devise suis-je payé ?
            </h3>
            <p className="mt-2">
              La devise de versement dépend du <strong>pays du créateur</strong>,
              du <strong>compte de paiement connecté</strong> et des options
              activées sur la plateforme. Selon les cas, le versement peut être
              effectué dans une devise locale ou compatible avec le compte de
              règlement utilisé.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              4. Quels sont les délais après la fin du mois ?
            </h3>
            <p className="mt-2">
              Un délai de traitement peut être nécessaire pour consolider les
              ventes, intégrer les remboursements éventuels, traiter les
              contestations, appliquer les taxes et finaliser les contrôles de
              conformité avant le versement.
            </p>
            <p className="mt-1">
              Les délais exacts peuvent varier selon le pays, le moyen de
              paiement utilisé, Stripe et la configuration active de la
              plateforme.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              5. Comment sont gérés la TVA, les devises et les frais de
              paiement ?
            </h3>
            <p className="mt-2">
              Avant de calculer ton versement net, les éléments suivants peuvent
              être pris en compte :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                les <strong>taxes applicables</strong>, y compris la TVA selon
                le pays, la nature du contenu et la configuration juridique du
                flux de vente ;
              </li>
              <li>
                les <strong>frais de paiement</strong> liés au traitement via
                Stripe ou au moyen de paiement utilisé ;
              </li>
              <li>
                la <strong>commission Magic Clock</strong> (
                <strong>20 % à 35 %</strong> selon le prix, le type d’offre et
                la configuration active).
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              6. Que se passe-t-il si un paiement est remboursé ou contesté
              (chargeback) ?
            </h3>
            <p className="mt-2">
              Le montant concerné peut être retiré du calcul du versement ou
              faire l’objet d’un <strong>ajustement ultérieur</strong>. Si le
              litige intervient après un versement, la somme concernée pourra
              être compensée sur les versements suivants, dans la mesure
              permise par la loi et les conditions applicables.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              7. Résumé rapide
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Les versements dépendent des <strong>modalités actives</strong>{" "}
                sur la plateforme.
              </li>
              <li>
                Un <strong>seuil minimum</strong> peut s’appliquer selon le
                pays, la devise ou le compte de paiement.
              </li>
              <li>
                Le versement dépend du <strong>compte de paiement connecté</strong>{" "}
                et des options de règlement disponibles.
              </li>
              <li>
                <strong>Commission plateforme :</strong> entre{" "}
                <strong>20 % et 35 %</strong> selon le prix, le type d’offre et
                la configuration active.
              </li>
              <li>
                <strong>Plage de prix :</strong> de 0,99 à 999,99 dans la
                devise d’achat disponible.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              8. Exemple concret de calcul
            </h3>
            <p className="mt-2">
              Exemple <strong>purement indicatif</strong> avec 100 abonnés à
              10 CHF/mois :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                Montant total encaissé : <strong>1&apos;000 CHF</strong>
              </li>
              <li>
                Taxes applicables éventuelles : <strong>selon le pays et le
                flux de vente</strong>
              </li>
              <li>
                Commission Magic Clock : <strong>selon la grille active</strong>
              </li>
              <li>
                Frais de paiement : <strong>selon le moyen de paiement
                utilisé</strong>
              </li>
            </ul>
            <p className="mt-2 font-semibold text-slate-900">
              Montant net estimé : <strong>variable selon la configuration
              applicable</strong>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Cet exemple est simplifié. Le montant réellement versé dépend
              notamment du pays, de la devise, des taxes, du moyen de paiement,
              des éventuels remboursements et de la configuration technique et
              juridique active.
            </p>
          </section>
        </section>

        <hr className="my-8 border-slate-200" />

        <section aria-labelledby="faq-users-heading">
          <h2
            id="faq-users-heading"
            className="text-lg font-semibold text-slate-900"
          >
            B. FAQ pour les utilisateurs (abonnements &amp; contenus PPV)
          </h2>

          <section className="mt-4">
            <h3 className="text-base font-semibold text-slate-900">
              1. Comment m&apos;abonner à un créateur ?
            </h3>
            <p className="mt-2">
              Sur la page d’un créateur, clique sur{" "}
              <strong>« S&apos;abonner »</strong>. Le prix affiché dans ta devise
              d’achat, ainsi que les informations de paiement applicables,
              apparaissent avant validation.
            </p>
            <p className="mt-1">
              Selon le modèle proposé par le créateur, l’abonnement peut être
              mensuel et renouvelable jusqu’à résiliation, conformément aux
              informations affichées lors de la souscription.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              2. Que se passe-t-il si je résilie mon abonnement ?
            </h3>
            <p className="mt-2">
              Tu peux résilier selon les fonctionnalités disponibles dans ton
              espace Magic Clock. Sauf disposition légale contraire ou geste
              commercial exceptionnel, la résiliation prend effet à la fin de la
              période déjà payée et n’ouvre pas droit à un remboursement
              prorata temporis.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              3. Qu&apos;est-ce qu&apos;un contenu PPV (« Pay-Per-View ») ?
            </h3>
            <p className="mt-2">
              Un contenu <strong>PPV</strong> est acheté{" "}
              <strong>à l’unité</strong>. Le prix affiché dans ta devise
              d’achat apparaît avant paiement. Une fois le paiement confirmé,
              tu obtiens le droit d’accès au contenu selon les modalités
              précisées sur la plateforme.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              4. Quels moyens de paiement sont acceptés ?
            </h3>
            <p className="mt-2">
              Les paiements sont traités via <strong>Stripe</strong>. Les
              moyens de paiement disponibles varient selon ton pays, ta devise,
              ton appareil et la configuration active de la plateforme.
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <strong>Cartes bancaires</strong> : Visa, Mastercard et autres
                cartes compatibles selon disponibilité.
              </li>
              <li>
                <strong>Wallets</strong> : par exemple Apple Pay, Google Pay ou
                autres moyens compatibles, lorsqu’ils sont disponibles.
              </li>
              <li>
                <strong>Moyens de paiement locaux</strong> : par exemple TWINT
                ou autres solutions compatibles selon le pays.
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              La liste exacte des moyens de paiement disponibles est affichée au
              moment du paiement.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              5. Que se passe-t-il si mon paiement est refusé ?
            </h3>
            <p className="mt-2">
              L’abonnement ou l’achat PPV <strong>n’est pas activé</strong> tant
              que le paiement n’a pas été validé. Tu peux réessayer avec une
              autre méthode de paiement compatible.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              6. Où trouver mes reçus ou justificatifs de paiement ?
            </h3>
            <p className="mt-2">
              Un justificatif de paiement peut être généré par le prestataire de
              paiement ou rendu disponible dans l’interface Magic Clock, selon
              la configuration active. Les informations applicables sont
              communiquées après validation du paiement.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              7. Puis-je demander un remboursement ?
            </h3>
            <p className="mt-2">
              Les contenus numériques peuvent être exclus du droit de
              rétractation lorsqu’ils sont fournis immédiatement avec ton accord
              et dans les conditions prévues par la loi applicable. En cas de
              problème technique majeur ou de difficulté d’accès avérée,
              contacte-nous à{" "}
              <a
                href="mailto:support@magic-clock.com"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                support@magic-clock.com
              </a>
              . Chaque demande est étudiée au cas par cas.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}
