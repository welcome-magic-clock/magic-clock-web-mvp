// app/legal/faq/page.tsx
// ✅ v2.0 — Date 6 mars 2026 · PostFinance/Adyen → Stripe · support@magic-clock.com
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
          <strong>versements créateurs</strong> et sur l'expérience des{" "}
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
        {/* SECTION A – CRÉATEURS */}
        <section aria-labelledby="faq-creators-heading">
          <h2
            id="faq-creators-heading"
            className="text-lg font-semibold text-slate-900"
          >
            A. FAQ pour les créateurs
          </h2>

          <section className="mt-4">
            <h3 className="text-base font-semibold text-slate-900">
              1. À quelle fréquence suis-je payé&nbsp;?
            </h3>
            <p className="mt-2">
              Les versements sont effectués <strong>une fois par mois</strong>,
              en règle générale autour du <strong>15 du mois</strong>.
            </p>
            <p className="mt-1">
              Le versement porte sur les revenus du{" "}
              <strong>mois civil précédent</strong>, après déduction de la TVA,
              des frais de paiement et de la commission Magic Clock.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              2. Y a-t-il un seuil minimum de versement&nbsp;?
            </h3>
            <p className="mt-2">
              Oui. Le versement est déclenché lorsque ton{" "}
              <strong>montant net à payer</strong> atteint au moins{" "}
              <strong>50&nbsp;CHF (ou équivalent)</strong>. En dessous, le
              solde est reporté au mois suivant.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              3. Dans quelle devise suis-je payé&nbsp;?
            </h3>
            <p className="mt-2">
              La devise principale est le{" "}
              <strong>franc suisse (CHF)</strong>. Des versements en{" "}
              <strong>EUR</strong> via virement SEPA pourront être proposés
              selon ton pays de résidence.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              4. Quels sont les délais après la fin du mois&nbsp;?
            </h3>
            <p className="mt-2">
              Quelques jours sont nécessaires pour consolider les ventes,
              traiter les remboursements éventuels et appliquer la TVA, les
              frais de paiement et la commission. Le virement est ensuite
              déclenché autour du <strong>15 du mois</strong>. Si le 15 tombe
              un week-end ou un jour férié, le paiement est effectué le{" "}
              <strong>jour ouvrable précédent</strong>.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              5. Comment sont gérés la TVA, les devises et les frais de
              paiement&nbsp;?
            </h3>
            <p className="mt-2">
              Avant de calculer ton versement net, nous déduisons :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                la <strong>TVA</strong> applicable selon le pays de
                l'utilisateur ;
              </li>
              <li>
                les <strong>frais de paiement</strong> (Stripe) ;
              </li>
              <li>
                la <strong>commission Magic Clock</strong> (20–30 %).
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              6. Que se passe-t-il si un paiement est remboursé ou contesté
              (chargeback)&nbsp;?
            </h3>
            <p className="mt-2">
              Le montant est retiré du calcul de ton versement. Si le litige
              intervient après le versement, la somme pourra être{" "}
              <strong>compensée sur tes versements suivants</strong>.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              7. Résumé rapide
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Versement <strong>une fois par mois</strong>, autour du 15.
              </li>
              <li>
                <strong>Seuil minimum :</strong> 50&nbsp;CHF (ou équivalent).
              </li>
              <li>
                Versement par <strong>virement bancaire</strong> (IBAN CH ou
                SEPA).
              </li>
              <li>
                <strong>Commission plateforme :</strong> entre{" "}
                <strong>20&nbsp;% et 30&nbsp;%</strong> selon ton profil
                créateur.
              </li>
              <li>
                <strong>Plage de prix :</strong> de 0,99 à 999,99 dans la
                devise d&apos;achat.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              8. Exemple concret de calcul
            </h3>
            <p className="mt-2">
              Exemple <strong>purement indicatif</strong> avec 100 abonnés à
              10&nbsp;CHF/mois :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                Montant total TTC : <strong>1'000&nbsp;CHF</strong>
              </li>
              <li>
                TVA 8&nbsp;% : <strong>80&nbsp;CHF</strong> réservés
              </li>
              <li>
                Base HT : <strong>920&nbsp;CHF</strong>
              </li>
              <li>
                Commission 25&nbsp;% : <strong>230&nbsp;CHF</strong>
              </li>
              <li>
                Frais Stripe ~3&nbsp;% : <strong>28&nbsp;CHF</strong>
              </li>
            </ul>
            <p className="mt-2 font-semibold text-slate-900">
              Montant net estimé :{" "}
              <strong>≈ 662&nbsp;CHF</strong>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Cet exemple est simplifié. Les pourcentages peuvent varier selon
              ton pays, ton statut et les conditions définitives.
            </p>
          </section>
        </section>

        <hr className="my-8 border-slate-200" />

        {/* SECTION B – UTILISATEURS */}
        <section aria-labelledby="faq-users-heading">
          <h2
            id="faq-users-heading"
            className="text-lg font-semibold text-slate-900"
          >
            B. FAQ pour les utilisateurs (abonnements &amp; contenus PPV)
          </h2>

          <section className="mt-4">
            <h3 className="text-base font-semibold text-slate-900">
              1. Comment m'abonner à un créateur&nbsp;?
            </h3>
            <p className="mt-2">
              Sur la page d'un créateur, clique sur{" "}
              <strong>« S'abonner »</strong>. Le prix mensuel TTC dans ta
              devise d&apos;achat est affiché clairement avant la validation.
              L'abonnement est <strong>mensuel</strong> et se renouvelle
              automatiquement jusqu'à résiliation.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              2. Que se passe-t-il si je résilie mon abonnement&nbsp;?
            </h3>
            <p className="mt-2">
              Tu peux annuler à tout moment.{" "}
              <strong>Pas d'engagement de durée minimale.</strong> Tu gardes
              l'accès jusqu'à la fin de la période déjà payée. Sauf exception
              légale, pas de remboursement au prorata.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              3. Qu'est-ce qu'un contenu PPV («&nbsp;Pay-Per-View&nbsp;»)&nbsp;?
            </h3>
            <p className="mt-2">
              Un contenu <strong>PPV</strong> est acheté{" "}
              <strong>à l'unité</strong>. Le prix TTC dans ta devise
              d&apos;achat est affiché avant paiement. Une fois confirmé, tu
              obtiens un droit d'accès permanent à ce contenu.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              4. Quels moyens de paiement sont acceptés&nbsp;?
            </h3>
            <p className="mt-2">
              Les paiements sont traités via <strong>Stripe</strong>. Selon ton
              pays et ta banque, tu peux notamment payer par :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <strong>Cartes bancaires</strong> : Visa, Mastercard.
              </li>
              <li>
                <strong>Wallets</strong> : Apple Pay, Google Pay{" "}
                <span className="text-xs text-slate-500">
                  (si disponibles sur ton appareil).
                </span>
              </li>
              <li>
                <strong>TWINT</strong> (Suisse){" "}
                <span className="text-xs text-slate-500">
                  selon disponibilité via Stripe.
                </span>
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Les moyens de paiement disponibles peuvent varier selon ton pays
              et seront complétés progressivement.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              5. Que se passe-t-il si mon paiement est refusé&nbsp;?
            </h3>
            <p className="mt-2">
              L'abonnement ou l'achat PPV{" "}
              <strong>n'est pas activé</strong>. Tu peux réessayer avec une
              autre méthode. Aucun montant n'est facturé tant que le paiement
              n'est pas validé.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              6. Où trouver mes reçus ou factures&nbsp;?
            </h3>
            <p className="mt-2">
              Un <strong>reçu électronique</strong> est généré par Stripe pour
              chaque paiement réussi. Il est envoyé à l'adresse e-mail de ton
              compte et sera progressivement accessible dans{" "}
              <strong>« Historique des paiements »</strong>.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              7. Puis-je demander un remboursement&nbsp;?
            </h3>
            <p className="mt-2">
              Les contenus numériques peuvent être exclus du droit de
              rétractation lorsque fournis immédiatement avec ton accord. En
              cas de problème technique majeur, contacte-nous à{" "}
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
