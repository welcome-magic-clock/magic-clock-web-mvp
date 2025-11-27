// app/legal/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ créateurs – Magic Clock",
};

export default function LegalFAQPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          FAQ créateurs – Paiements & versements
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Cette page répond aux principales questions des créateurs sur les
          gains, les versements, la TVA et les pays couverts. Elle pourra être
          ajustée avant le lancement commercial définitif de Magic Clock.
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* 1. Versements */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Quand et comment suis-je payé&nbsp;?
          </h2>

          <p className="mt-2">
            Tes gains (abonnements + contenus PPV) sont calculés chaque mois
            pour la période du <strong>1er au dernier jour du mois</strong>.
          </p>

          <p className="mt-2">
            <strong>Date de versement</strong> : le paiement est effectué{" "}
            <strong>une fois par mois</strong>, autour du{" "}
            <strong>15 du mois suivant</strong>. Si le 15 tombe un week-end ou
            un jour férié, le versement est effectué le{" "}
            <strong>dernier jour ouvrable d&apos;avant</strong>.
          </p>

          <p className="mt-2">
            <strong>Seuil minimum de versement</strong> : dès que ton solde net
            atteint <strong>50&nbsp;CHF (ou équivalent)</strong>, il est
            programmé pour le prochain cycle de paiement. Si tu es en dessous de
            ce seuil, ton solde est simplement reporté sur le mois suivant.
          </p>

          <p className="mt-2">
            <strong>Mode de paiement</strong> : les gains sont versés par{" "}
            <strong>virement bancaire</strong> sur ton IBAN (compte suisse ou
            SEPA) après les vérifications d’identité nécessaires.
          </p>
        </section>

        {/* 2. Commission & montant net */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Quelle commission prend Magic Clock&nbsp;?
          </h2>

          <p className="mt-2">
            Sur chaque vente (abonnement ou contenu PPV), Magic Clock retient
            une <strong>commission plateforme</strong> qui couvre les frais
            techniques, les coûts de paiement et le développement du produit.
          </p>

          <p className="mt-2">
            Cette commission est comprise <strong>entre 20&nbsp;% et 30&nbsp;%</strong>{" "}
            selon ta <strong>catégorie de créateur</strong> (basée notamment sur
            l’engagement global de ton contenu, par exemple le nombre total de
            likes). Le pourcentage exact applicable à ton profil est indiqué
            dans l’interface Monétisation lorsque la fonctionnalité sera
            disponible.
          </p>

          <p className="mt-2">
            Le montant qui t’est versé correspond donc à{" "}
            <strong>tes ventes TTC</strong> (prix payé par l’utilisateur),{" "}
            <strong>moins</strong> :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>la commission Magic Clock (20–30&nbsp;%) ;</li>
            <li>les taxes éventuelles (TVA, selon le pays de l’acheteur) ;</li>
            <li>les frais de paiement et de change, le cas échéant.</li>
          </ul>
        </section>

        {/* 3. Devise & pays */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Dans quelle devise et dans quels pays suis-je payé&nbsp;?
          </h2>

          <p className="mt-2">
            <strong>Devise de référence</strong> : la devise de base de Magic
            Clock est le <strong>CHF</strong>. Pour les comptes bancaires SEPA,
            le versement peut être effectué en <strong>EUR</strong> ou converti
            par ta banque selon la devise de ton compte.
          </p>

          <p className="mt-2">
            <strong>Zone géographique</strong> : la plateforme vise en priorité
            les créateurs basés en <strong>Suisse</strong>, dans l’
            <strong>UE / EEE</strong>, au <strong>Royaume-Uni</strong> et aux{" "}
            <strong>États-Unis</strong>. D’autres pays pourront être ajoutés
            progressivement, sous réserve de conformité bancaire et fiscale.
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Remarque : les créateurs restent responsables de vérifier que la
            réception de paiements en provenance de l’étranger est compatible
            avec la législation et la fiscalité de leur pays de résidence.
          </p>
        </section>

        {/* 4. TVA & fiscalité */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Comment est gérée la TVA et ma fiscalité&nbsp;?
          </h2>

          <p className="mt-2">
            Magic Clock prend en charge, autant que possible, la{" "}
            <strong>collecte de la TVA</strong> sur les ventes aux
            utilisateurs, en fonction du pays de l’acheteur et des règles
            applicables. La TVA (et autres taxes) est déduite avant calcul de
            ton montant net.
          </p>

          <p className="mt-2">
            En parallèle, <strong>tu restes responsable</strong> de ta propre
            situation fiscale (déclaration de revenus, éventuelle TVA locale,
            statut indépendant, etc.) auprès de ton administration fiscale.
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Cette FAQ ne constitue pas un conseil fiscal. Pour des questions
            précises (TVA, statuts, charges sociales), il est recommandé de
            consulter un·e fiduciaire ou conseiller·ère fiscal·e dans ton pays.
          </p>
        </section>

        {/* 5. Paiements refusés, remboursements */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Que se passe-t-il si le paiement d’un abonné est refusé ou
            remboursé&nbsp;?
          </h2>

          <p className="mt-2">
            <strong>Paiement refusé ou échoué</strong> : si la carte ou le
            moyen de paiement de l’utilisateur est refusé,{" "}
            <strong>aucun gain n’est comptabilisé</strong> pour toi. L’accès au
            contenu payant n’est pas accordé tant que le paiement n’est pas
            validé.
          </p>

          <p className="mt-2">
            <strong>Remboursement ou chargeback</strong> : si un paiement est
            remboursé ou contesté (chargeback), le montant correspondant est{" "}
            <strong>déduit</strong> de ton solde créateur. Si le remboursement
            intervient après le versement, le montant pourra être compensé sur
            les paiements suivants.
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Magic Clock pourra te contacter en cas d’activité anormale
            (remboursements répétés, fraude suspectée, etc.).
          </p>
        </section>

        {/* 6. Mise à jour du compte bancaire */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Comment changer mon IBAN ou mes informations de paiement&nbsp;?
          </h2>

          <p className="mt-2">
            Tu pourras modifier ton <strong>IBAN</strong> et tes informations de
            paiement dans l’onglet <strong>Monétisation &gt; Paramètres de
            versement</strong> (interface en cours de développement).
          </p>

          <p className="mt-2">
            Pour des raisons de sécurité et de conformité, un{" "}
            <strong>contrôle d’identité</strong> pourra être demandé (copie de
            pièce d’identité, justificatif de domicile, etc.) avant validation
            d’un nouveau compte bancaire.
          </p>
        </section>

        {/* 7. Résumé rapide */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Résumé rapide
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Versement <strong>une fois par mois</strong>, autour du 15.</li>
            <li>
              <strong>Seuil minimum</strong> de versement&nbsp;: 50&nbsp;CHF (ou
              équivalent).
            </li>
            <li>
              Versement par <strong>virement bancaire</strong> (IBAN CH ou
              SEPA).
            </li>
            <li>
              Commission plateforme : <strong>20–30&nbsp;%</strong> selon ton
              profil créateur.
            </li>
            <li>
              TVA et frais de paiement déduits avant calcul de ton{" "}
              <strong>montant net</strong>.
            </li>
          </ul>
        </section>

        {/* 8. Exemple concret */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Exemple concret de calcul
          </h2>

          <p className="mt-2">
            Voici un exemple <strong>purement indicatif</strong> pour t’aider à
            visualiser comment ton gain net peut être calculé. Les chiffres
            exacts dépendront de ta commission, de la TVA applicable et des
            frais de paiement réels.
          </p>

          <p className="mt-2 font-medium text-slate-900">
            Scénario : un mois avec 100 abonnés actifs
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Prix de ton abonnement : <strong>10&nbsp;CHF / mois</strong>.</li>
            <li>Nombre d’abonnés payants : <strong>100</strong>.</li>
            <li>
              Montant total payé par les abonnés (TTC) :{" "}
              <strong>1’000&nbsp;CHF</strong>.
            </li>
          </ul>

          <p className="mt-2 font-medium text-slate-900">Étapes (exemple)</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>
              <strong>TVA</strong> (exemple 8&nbsp;% sur 1’000&nbsp;CHF) :{" "}
              80&nbsp;CHF sont réservés pour la TVA à reverser.
            </li>
            <li>
              <strong>Base hors taxes</strong> : 1’000&nbsp;CHF – 80&nbsp;CHF ={" "}
              <strong>920&nbsp;CHF</strong>.
            </li>
            <li>
              <strong>Commission Magic Clock</strong> (exemple 25&nbsp;%) :{" "}
              25&nbsp;% de 920&nbsp;CHF ≈ <strong>230&nbsp;CHF</strong>.
            </li>
            <li>
              <strong>Frais de paiement</strong> (exemple 3&nbsp;% sur 920&nbsp;CHF) :{" "}
              ≈ <strong>28&nbsp;CHF</strong>.
            </li>
          </ol>

          <p className="mt-2">
            Montant qui reste pour toi dans cet exemple&nbsp;:
          </p>
          <p className="mt-1 font-medium">
            920&nbsp;CHF – 230&nbsp;CHF – 28&nbsp;CHF ≈{" "}
            <strong>662&nbsp;CHF nets</strong> (avant ta propre fiscalité
            personnelle).
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Cet exemple est volontairement simplifié pour la compréhension. Les
            pourcentages (TVA, commission, frais) peuvent varier selon ton
            pays, ton statut et les conditions définitives de Magic Clock.
          </p>
        </section>
      </div>
    </main>
  );
}
