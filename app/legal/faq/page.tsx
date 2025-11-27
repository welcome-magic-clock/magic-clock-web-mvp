// app/legal/faq/page.tsx

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
          <strong>utilisateurs (abonnements & contenus PPV)</strong> dans la
          version bêta de Magic Clock.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Pour un aperçu global des modèles tarifaires et du fonctionnement de
          la monétisation, tu peux aussi consulter la page{" "}
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

          {/* 1. Fréquence */}
          <section className="mt-4">
            <h3 className="text-base font-semibold text-slate-900">
              1. À quelle fréquence suis-je payé&nbsp;?
            </h3>
            <p className="mt-2">
              Les versements sont effectués <strong>une fois par mois</strong>,
              en règle générale autour du <strong>15 du mois</strong>.
            </p>
            <p className="mt-1">
              Le versement porte sur les revenus (abonnements + PPV) du{" "}
              <strong>mois civil précédent</strong>, après déduction de la TVA,
              des frais de paiement et de la commission Magic Clock.
            </p>
          </section>

          {/* 2. Seuil */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              2. Y a-t-il un seuil minimum de versement&nbsp;?
            </h3>
            <p className="mt-2">
              Oui. Le versement est déclenché lorsque ton{" "}
              <strong>montant net à payer</strong> atteint au moins{" "}
              <strong>50&nbsp;CHF (ou équivalent)</strong>.
            </p>
            <p className="mt-1">
              Si ton solde net du mois est inférieur à ce seuil, il est
              simplement <strong>reporté sur le mois suivant</strong> jusqu’à
              atteindre ou dépasser 50&nbsp;CHF.
            </p>
          </section>

          {/* 3. Devise */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              3. Dans quelle devise suis-je payé&nbsp;?
            </h3>
            <p className="mt-2">
              La devise de versement principale est le{" "}
              <strong>franc suisse (CHF)</strong>.
            </p>
            <p className="mt-1">
              Si tu es situé dans l’UE / EEE, au Royaume-Uni ou dans un autre
              pays, des versements en <strong>EUR</strong> (ou dans une autre
              devise adaptée) pourront être proposés via{" "}
              <strong>virement bancaire SEPA</strong>, en fonction de ton pays
              de résidence et des solutions bancaires disponibles.
            </p>
          </section>

          {/* 4. Délais */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              4. Quels sont les délais après la fin du mois&nbsp;?
            </h3>
            <p className="mt-2">
              Une fois le mois terminé, nous avons besoin de quelques jours
              pour :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>consolider les ventes (abonnements, PPV) ;</li>
              <li>traiter les remboursements éventuels ;</li>
              <li>
                appliquer la <strong>TVA</strong>, les{" "}
                <strong>frais de paiement</strong> et la{" "}
                <strong>commission Magic Clock</strong>.
              </li>
            </ul>
            <p className="mt-2">
              Le virement est ensuite déclenché autour du{" "}
              <strong>15 du mois</strong>. Si le 15 tombe un{" "}
              <strong>week-end ou un jour férié</strong>, le paiement est
              effectué le <strong>jour ouvrable précédent</strong>.
            </p>
          </section>

          {/* 5. TVA & frais */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              5. Comment sont gérés la TVA et les frais de paiement&nbsp;?
            </h3>
            <p className="mt-2">
              Le montant que tu vois dans ton espace créateur correspond
              généralement au <strong>montant TTC payé par les abonnés</strong>.
            </p>
            <p className="mt-1">
              Avant de calculer ton versement net, nous déduisons :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                la <strong>TVA</strong> applicable (en fonction du pays de
                l’utilisateur, des règles fiscales et de ton statut) ;
              </li>
              <li>
                les <strong>frais de paiement</strong> (cartes bancaires, TWINT,
                PostFinance, etc.) ;
              </li>
              <li>
                la <strong>commission Magic Clock</strong>.
              </li>
            </ul>
          </section>

          {/* 6. Remboursements / litiges */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              6. Que se passe-t-il si un paiement est remboursé ou contesté
              (chargeback)&nbsp;?
            </h3>
            <p className="mt-2">
              Si un abonnement ou un contenu PPV est{" "}
              <strong>remboursé</strong> ou fait l’objet d’un{" "}
              <strong>chargeback</strong> (contestation bancaire), le montant
              correspondant est retiré du calcul de ton versement.
            </p>
            <p className="mt-1">
              Si le litige intervient après le versement, la somme pourra être{" "}
              <strong>compensée sur tes versements suivants</strong>. Les
              détails pratiques seront précisés dans l’interface Monétisation et
              dans les CGV définitives.
            </p>
          </section>

          {/* 7. Résumé rapide */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              7. Résumé rapide
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Versement <strong>une fois par mois</strong>, autour du 15.
              </li>
              <li>
                <strong>Seuil minimum de versement :</strong> 50&nbsp;CHF (ou
                équivalent).
              </li>
              <li>
                Versement par <strong>virement bancaire</strong> (IBAN CH ou
                SEPA).
              </li>
              <li>
                <strong>Commission plateforme :</strong> entre{" "}
                <strong>20&nbsp;% et 30&nbsp;%</strong> selon ton profil
                créateur (classification basée sur l’engagement global, par
                exemple le nombre total de likes sur l’ensemble de tes
                contenus).
              </li>
              <li>
                TVA et frais de paiement déduits avant calcul de ton{" "}
                <strong>montant net</strong>.
              </li>
            </ul>
          </section>

          {/* 8. Exemple concret */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              8. Exemple concret de calcul
            </h3>
            <p className="mt-2">
              Voici un exemple <strong>purement indicatif</strong> pour t’aider
              à visualiser comment ton gain net peut être calculé. Les chiffres
              exacts dépendront de la commission, de la TVA applicable et des
              frais de paiement réels.
            </p>

            <p className="mt-3 font-medium text-slate-900">
              Scénario&nbsp;: un mois avec 100 abonnés actifs
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                Prix de ton abonnement : <strong>10&nbsp;CHF / mois</strong>.
              </li>
              <li>
                Nombre d’abonnés payants : <strong>100</strong>.
              </li>
              <li>
                Montant total payé par les abonnés (TTC) :{" "}
                <strong>1’000&nbsp;CHF</strong>.
              </li>
            </ul>

            <p className="mt-3 font-medium text-slate-900">
              Étapes (exemple simplifié)
            </p>
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              <li>
                <strong>TVA</strong> (exemple 8&nbsp;% sur 1’000&nbsp;CHF) :{" "}
                <strong>80&nbsp;CHF</strong> sont réservés pour la TVA à
                reverser.
              </li>
              <li>
                <strong>Base hors taxes</strong> : 1’000&nbsp;CHF – 80&nbsp;CHF
                = <strong>920&nbsp;CHF</strong>.
              </li>
              <li>
                <strong>Commission Magic Clock</strong> (exemple 25&nbsp;%) : 25
                % de 920&nbsp;CHF ≈ <strong>230&nbsp;CHF</strong>.
              </li>
              <li>
                <strong>Frais de paiement</strong> (exemple 3&nbsp;% sur
                920&nbsp;CHF) : ≈ <strong>28&nbsp;CHF</strong>.
              </li>
            </ol>

            <p className="mt-3">
              Montant qui reste pour toi dans cet exemple :
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              920&nbsp;CHF – 230&nbsp;CHF – 28&nbsp;CHF ={" "}
              <strong>≈ 662&nbsp;CHF nets</strong>{" "}
              <span className="font-normal">
                (avant ta propre fiscalité personnelle).
              </span>
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Cet exemple est volontairement simplifié pour la compréhension.
              Les pourcentages (TVA, commission, frais) peuvent varier selon ton
              pays, ton statut et les conditions définitives de Magic Clock.
            </p>
          </section>
        </section>

        {/* SEPARATEUR */}
        <hr className="my-8 border-slate-200" />

        {/* SECTION B – UTILISATEURS (ABONNÉS & PPV) */}
        <section aria-labelledby="faq-users-heading">
          <h2
            id="faq-users-heading"
            className="text-lg font-semibold text-slate-900"
          >
            B. FAQ pour les utilisateurs (abonnements & contenus PPV)
          </h2>

          {/* U1 – Abonnements */}
          <section className="mt-4">
            <h3 className="text-base font-semibold text-slate-900">
              1. Comment m’abonner à un créateur&nbsp;?
            </h3>
            <p className="mt-2">
              Sur la page d’un créateur, tu peux cliquer sur le bouton{" "}
              <strong>« S’abonner »</strong>. Le prix mensuel et les éventuels
              avantages inclus (contenus exclusifs, accès prioritaire, etc.)
              sont affichés clairement avant la validation.
            </p>
            <p className="mt-1">
              L’abonnement est généralement <strong>mensuel</strong> et se
              renouvelle automatiquement jusqu’à ce que tu le résilies.
            </p>
          </section>

          {/* U2 – Résiliation */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              2. Que se passe-t-il si je résilie mon abonnement&nbsp;?
            </h3>
            <p className="mt-2">
              Tu peux annuler ton abonnement à tout moment depuis ton
              espace&nbsp;:{" "}
              <strong>il n’y a pas d’engagement de durée minimale</strong>.
            </p>
            <p className="mt-1">
              Lorsque tu résilies, tu gardes en principe l’accès aux contenus
              de ce créateur jusqu’à la <strong>fin de la période déjà payée</strong>
              . L’abonnement ne sera simplement pas renouvelé pour le mois
              suivant.
            </p>
            <p className="mt-1">
              Sauf exception prévue par la loi locale, il n’y a pas de
              remboursement au prorata pour la période déjà entamée.
            </p>
          </section>

          {/* U3 – PPV */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              3. Qu’est-ce qu’un contenu PPV («&nbsp;Pay-Per-View&nbsp;»)&nbsp;?
            </h3>
            <p className="mt-2">
              Un contenu <strong>PPV</strong> est un contenu payant acheté{" "}
              <strong>à l’unité</strong> (par exemple une masterclass, une
              transformation détaillée, un tutoriel avancé, etc.).
            </p>
            <p className="mt-1">
              Une fois l’achat effectué et le paiement confirmé, tu obtiens un{" "}
              <strong>droit d’accès</strong> à ce contenu depuis ton compte
              Magic Clock, selon les conditions définies par le créateur et par
              nos CGV.
            </p>
          </section>

          {/* U4 – Moyens de paiement */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              4. Quels moyens de paiement sont acceptés&nbsp;?
            </h3>
            <p className="mt-2">
              Les paiements sont traités via{" "}
              <strong>PostFinance Checkout</strong> (offre groupée eCom). Selon
              ton pays et ta banque, tu peux notamment payer par :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <strong>Cartes bancaires</strong> : Visa, Mastercard.
              </li>
              <li>
                <strong>Paiements suisses</strong> : PostFinance Pay, TWINT.
              </li>
              <li>
                <strong>Wallets</strong> : Apple Pay, Click to Pay{" "}
                <span className="text-xs text-slate-500">
                  (si disponibles sur ton appareil).
                </span>
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Les moyens de paiement disponibles peuvent varier selon ton pays
              de résidence et seront complétés progressivement au fur et à
              mesure du déploiement international de Magic Clock.
            </p>
          </section>

          {/* U5 – Paiement refusé */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              5. Que se passe-t-il si mon paiement est refusé&nbsp;?
            </h3>
            <p className="mt-2">
              Si le paiement est refusé (carte expirée, fonds insuffisants,
              problème de 3-D Secure, etc.) :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                l’abonnement ou l’achat PPV <strong>n’est pas activé</strong> ;
              </li>
              <li>
                tu peux <strong>réessayer</strong> avec la même carte ou une
                autre méthode de paiement ;
              </li>
              <li>
                si le problème persiste, nous te recommandons de{" "}
                <strong>contacter ta banque</strong> ou ton émetteur de carte.
              </li>
            </ul>
            <p className="mt-2">
              Aucun montant ne t’est facturé tant que le paiement n’a pas été
              validé.
            </p>
          </section>

          {/* U6 – Reçus & factures */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              6. Où trouver mes reçus ou factures&nbsp;?
            </h3>
            <p className="mt-2">
              Pour chaque paiement réussi, un{" "}
              <strong>reçu électronique</strong> est généré par notre
              prestataire de paiement. Dans la version bêta, ces reçus peuvent
              être envoyés :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>par e-mail à l’adresse associée à ton compte ;</li>
              <li>
                et, progressivement, dans une rubrique{" "}
                <strong>« Historique des paiements »</strong> de ton compte
                Magic Clock.
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              La présentation des reçus et des factures pourra être ajustée
              selon les exigences légales des différents pays (TVA, mentions
              obligatoires, etc.).
            </p>
          </section>

          {/* U7 – Remboursements */}
          <section className="mt-6">
            <h3 className="text-base font-semibold text-slate-900">
              7. Puis-je demander un remboursement&nbsp;?
            </h3>
            <p className="mt-2">
              Les abonnements et contenus PPV concernent des{" "}
              <strong>contenus numériques</strong>. Conformément au droit
              applicable, le droit de rétractation peut être{" "}
              <strong>limité ou exclu</strong> lorsque le contenu est fourni
              immédiatement après l’achat, avec ton accord explicite.
            </p>
            <p className="mt-1">
              En cas de problème technique majeur ou d’erreur manifeste, tu peux
              toutefois contacter notre support. Chaque demande sera étudiée{" "}
              <strong>au cas par cas</strong>, dans le respect des lois locales
              et de nos CGV.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}
