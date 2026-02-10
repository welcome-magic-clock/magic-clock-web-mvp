// app/legal/cgv/page.tsx
import { PaymentMethodsSection } from "@/components/legal/PaymentMethodsSection";

export const metadata = {
  title: "CGV – Magic Clock",
};

export default function LegalCGVPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Conditions générales d’utilisation et de vente
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Plateforme Magic Clock – Dernière mise à jour : 26 novembre 2025
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* 1. Objet */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Objet des CGU/CGV
          </h2>
          <p className="mt-2">
            Les présentes conditions générales d’utilisation et de vente
            (ci-après les <strong>« CGU/CGV »</strong>) ont pour objet de
            définir les règles d’accès et d’utilisation de la plateforme{" "}
            <strong>Magic Clock</strong> (ci-après la{" "}
            <strong>« Plateforme »</strong>) ainsi que les conditions
            applicables à la vente de contenus numériques et d’abonnements
            proposés par les créateurs via la Plateforme.
          </p>
          <p className="mt-2">
            La Plateforme est éditée par{" "}
            <strong>[Magic Clock SA]</strong>, société de droit suisse, dont le
            siège social est situé à <strong>[adresse à compléter]</strong>{" "}
            (ci-après l’<strong>« Éditeur »</strong>, <strong>« nous »</strong>
            ).
          </p>
          <p className="mt-2">
            En accédant à la Plateforme, en créant un compte ou en achetant un
            contenu ou un abonnement, l’utilisateur (ci-après{" "}
            <strong>« vous »</strong> ou l’<strong>« Utilisateur »</strong>)
            reconnaît avoir lu, compris et accepté les présentes CGU/CGV.
          </p>
        </section>

        {/* 2. Définitions */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Définitions
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Utilisateur</strong> : toute personne disposant d’un
              compte Magic Clock (créateur ou simple membre inscrit).
            </li>
            <li>
              <strong>Créateur</strong> : Utilisateur qui publie des contenus
              (photos, vidéos, Magic Studio, Magic Display, textes, etc.) sur la
              Plateforme.
            </li>
            <li>
              <strong>Contenu</strong> : tout élément publié par un Utilisateur
              via la Plateforme (images, vidéos, textes, commentaires, profils,
              etc.).
            </li>
            <li>
              <strong>Abonnement</strong> : formule payante permettant d’accéder
              à certains contenus d’un Créateur pour une période déterminée.
            </li>
            <li>
              <strong>Contenu PPV (« Pay-Per-View »)</strong> : contenu payant
              accessible après achat unitaire.
            </li>
            <li>
              <strong>Services</strong> : ensemble des fonctionnalités proposées
              par la Plateforme (Amazing, Meet me, My Magic Clock, Monétisation,
              messagerie, etc.).
            </li>
          </ul>
        </section>

        {/* 3. Champ d’application */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Champ d’application géographique
          </h2>
          <p className="mt-2">
            La Plateforme est accessible aux Utilisateurs situés en Suisse, dans
            l’Union européenne / EEE, au Royaume-Uni, aux États-Unis et, plus
            largement, dans tout pays où son utilisation n’est pas contraire au
            droit local.
          </p>
          <p className="mt-2">
            En cas de conflit entre le droit local impératif du pays de
            résidence habituelle de l’Utilisateur et les présentes CGU/CGV, les
            règles impératives locales prévalent.
          </p>
        </section>

        {/* 4. Inscription & compte */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Inscription et compte
          </h2>
          <h3 className="mt-2 font-medium text-slate-900">4.1. Âge minimum</h3>
          <p className="mt-1">
            La Plateforme est réservée aux personnes :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>âgées d’au moins 16 ans dans l’UE/EEE et au Royaume-Uni ;</li>
            <li>âgées d’au moins 13 ans en Suisse et aux États-Unis ;</li>
          </ul>
          <p className="mt-1">
            ou disposant de l’autorisation de leur représentant légal lorsque
            cela est requis par le droit applicable.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            4.2. Création du compte
          </h3>
          <p className="mt-1">
            Vous vous engagez à fournir des informations exactes, complètes et à
            jour, à ne pas usurper l’identité d’un tiers et à garder vos
            identifiants confidentiels. Vous nous informez sans délai de toute
            utilisation non autorisée de votre compte.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            4.3. Suspension et fermeture
          </h3>
          <p className="mt-1">
            Nous pouvons suspendre ou fermer un compte en cas de :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>violation des présentes CGU/CGV ;</li>
            <li>comportement illicite, trompeur, haineux ou abusif ;</li>
            <li>non-respect des lois applicables.</li>
          </ul>
                    <h3 className="mt-3 font-medium text-slate-900">
            4.4. Vérification de l&apos;âge et protection des mineurs
          </h3>
          <p className="mt-1">
            Nous pouvons mettre en place, lorsque cela est requis ou approprié,
            des mécanismes de <strong>vérification d&apos;âge</strong> ou
            demander des informations complémentaires afin de nous assurer que
            l&apos;Utilisateur remplit les conditions d&apos;âge minimum
            indiquées ci-dessus.
          </p>
          <p className="mt-1">
            Il est interdit de créer un compte pour le compte d&apos;un mineur
            sans l&apos;autorisation requise d&apos;un représentant légal ou en
            fournissant des informations fausses ou trompeuses sur l&apos;âge.
            Tout compte créé en violation de cette règle pourra être suspendu ou
            fermé, et les contenus concernés supprimés.
          </p>
          <p className="mt-1">
            Les contenus impliquant des <strong>mineurs</strong> (par exemple
            avant/après, tutos coiffure, etc.) ne peuvent être publiés que dans
            le respect strict du droit applicable, avec l&apos;autorisation
            nécessaire des représentants légaux et sans jamais sexualiser ou
            exploiter l&apos;image d&apos;un mineur.
          </p>
        </section>

        {/* 5. Rôle de la Plateforme */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Rôle de la Plateforme
          </h2>
          <p className="mt-2">
            Magic Clock est une <strong>plateforme UGC</strong> permettant à des
            créateurs indépendants de publier, monétiser et partager leurs
            contenus avec une communauté.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Nous ne sommes pas partie au contrat qui lie un Créateur et ses
              abonnés ou acheteurs.
            </li>
            <li>
              Nous fournissons l’infrastructure technique, les outils de
              publication et de paiement, ainsi que des mécanismes de
              modération.
            </li>
          </ul>
        </section>

        {/* 6. Contenus & licence */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Contenus et licence accordée à Magic Clock
          </h2>

          <h3 className="mt-2 font-medium text-slate-900">
            6.1. Responsabilité des contenus
          </h3>
          <p className="mt-1">
            Vous restez seul responsable des contenus que vous publiez. Vous
            garantissez notamment que :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              vous disposez de tous les droits nécessaires (droits d’auteur,
              droit à l’image, droits voisins, etc.) ;
            </li>
            <li>
              le contenu ne viole aucun droit de tiers ni aucune loi applicable
              ;
            </li>
            <li>
              le contenu respecte nos règles de communauté et de modération.
            </li>
          </ul>

          <h3 className="mt-3 font-medium text-slate-900">
            6.2. Licence accordée à la Plateforme
          </h3>
          <p className="mt-1">
            En publiant un contenu sur Magic Clock, vous accordez à l’Éditeur,
            pour le monde entier et pour la durée légale des droits, une{" "}
            <strong>
              licence non exclusive, transférable, sous-licenciable et gratuite
            </strong>{" "}
            afin de :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>héberger, stocker, reproduire et adapter le contenu ;</li>
            <li>
              le représenter et le communiquer au public via la Plateforme et
              ses supports associés ;
            </li>
            <li>
              réaliser des actions raisonnables de promotion de la Plateforme,
              dans le respect de vos droits moraux.
            </li>
          </ul>
          <p className="mt-1">
            Cette licence est limitée au fonctionnement et à la promotion de la
            Plateforme. Nous ne revendons pas vos contenus à des tiers
            indépendants sans votre accord spécifique.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            6.3. Suppression des contenus
          </h3>
          <p className="mt-1">
            Vous pouvez supprimer vos contenus à tout moment. Certains contenus
            peuvent cependant être conservés :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>en raison d’obligations légales de conservation ;</li>
            <li>
              pour la gestion de litiges ou la protection de nos droits ; et/ou
            </li>
            <li>
              pour les utilisateurs ayant déjà acquis un droit d’accès au
              contenu.
            </li>
          </ul>
        </section>

        {/* 7. Comportements interdits */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Comportements interdits
          </h2>
          <p className="mt-2">
            Sont strictement interdits, notamment, les contenus ou
            comportements :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              violents, haineux, discriminatoires, diffamatoires, harcelants ou
              pornographiques ;
            </li>
            <li>
              portant atteinte à la dignité humaine, aux mineurs, ou incitant à
              des activités illégales ;
            </li>
            <li>
              portant atteinte aux droits de propriété intellectuelle ou aux
              données personnelles de tiers ;
            </li>
            <li>
              relevant de la fraude, de la manipulation de paiements ou de
              statistiques ;
            </li>
            <li>
              visant à dégrader la sécurité ou le fonctionnement de la
              Plateforme.
            </li>
          </ul>
          <p className="mt-2">
            Nous pouvons supprimer tout contenu et prendre des mesures à
            l’encontre du compte concerné, y compris la fermeture et, le cas
            échéant, le signalement aux autorités.
          </p>
        </section>

        {/* 8. Monétisation & paiements */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Monétisation, prix et paiements
          </h2>
          <h3 className="mt-2 font-medium text-slate-900">
            8.1. Fixation des prix
          </h3>
          <p className="mt-1">
            Les Créateurs fixent librement le prix de leurs abonnements et de
            leurs contenus PPV, dans les limites techniques définies par la
            Plateforme. Par défaut, les prix peuvent aller de{" "}
            <strong>0,99 à 999,99</strong>, toujours dans la{" "}
            <strong>devise d&apos;achat</strong> de l&apos;Utilisateur (par
            exemple CHF, EUR ou USD), telle qu&apos;affichée au moment du
            paiement.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            8.2. Commission de la Plateforme
          </h3>
          <p className="mt-1">
            En contrepartie des Services (hébergement, outils, paiement,
            support, etc.), l’Éditeur perçoit une <strong>commission</strong> sur
            chaque transaction. Le pourcentage applicable est indiqué dans
            l’interface Monétisation et peut être modifié pour l’avenir avec
            information préalable.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            8.3. Taxes et TVA
          </h3>
          <p className="mt-1">
            Les prix affichés sont, lorsque la loi l’exige, indiqués{" "}
            <strong>TTC (toutes taxes comprises)</strong> dans la{" "}
            <strong>devise d&apos;achat</strong> de l&apos;Utilisateur, en
            fonction de sa localisation et du moyen de paiement utilisé. La part
            correspondant à la TVA et aux autres taxes applicables est gérée par
            la Plateforme et/ou le prestataire de paiement conformément au droit
            en vigueur.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            8.4. Paiements et prestataire de paiement
          </h3>
          <p className="mt-1">
            Les paiements sont traités par un prestataire de services de
            paiement tiers (par exemple Stripe ou équivalent). En utilisant les
            Services payants, vous acceptez également les conditions de ce
            prestataire.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            8.5. Droit de rétractation
          </h3>
          <p className="mt-1">
            Pour les consommateurs résidant dans l’UE/EEE ou au Royaume-Uni, le
            droit de rétractation peut être limité ou exclu pour les contenus
            numériques fournis immédiatement après l’achat, lorsque
            l’Utilisateur a expressément consenti à l’exécution immédiate et
            reconnu qu’il perdait son droit de rétractation. Cette section
            pourra être ajustée par notre conseil juridique selon l’offre
            définitive.
          </p>
        </section>

        {/* 8 bis. Moyens de paiement disponibles (section réutilisable) */}
        <PaymentMethodsSection />

        {/* 9. Rémunération des créateurs */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Rémunération des Créateurs
          </h2>

          <p className="mt-2">
            Le montant dû à un Créateur correspond aux sommes effectivement
            encaissées auprès des Utilisateurs pour ses abonnements et contenus
            PPV, déduction faite de la commission de la Plateforme, des taxes
            applicables et des frais de paiement et de change.
          </p>

                    <h3 className="mt-3 font-medium text-slate-900">
            9.1. Statut et obligations des Créateurs rémunérés
          </h3>
          <p className="mt-1">
            Tout Utilisateur qui active les fonctionnalités de monétisation
            (abonnements, contenus PPV, pourboires, etc.) devient un{" "}
            <strong>Créateur rémunéré</strong>. Il lui appartient de vérifier si
            cette activité doit être déclarée comme activité indépendante,
            activité salariée complémentaire ou autre statut auprès des
            autorités fiscales et sociales compétentes de son pays de
            résidence.
          </p>
          <p className="mt-1">
            Le Créateur rémunéré reste seul responsable de{" "}
            <strong>toutes les déclarations fiscales et sociales</strong>{" "}
            liées aux revenus perçus via Magic Clock, ainsi que du paiement des
            impôts, cotisations et contributions éventuellement dus.
          </p>

          <p className="mt-1">
            Pour des raisons de conformité (par exemple lutte contre le
            blanchiment d&apos;argent et financement du terrorisme), des
            procédures de <strong>vérification d&apos;identité (KYC)</strong>{" "}
            peuvent être exigées. Magic Clock ou son prestataire de paiement
            peut suspendre ou bloquer des paiements tant que ces vérifications
            n&apos;ont pas abouti.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            9.2. Utilisation autorisée de la Plateforme par les Créateurs
          </h3>
          <p className="mt-1">
            Les Créateurs rémunérés s&apos;engagent à utiliser la Plateforme
            uniquement pour proposer des contenus conformes aux présentes
            CGU/CGV, à la{" "}
            <a
              href="/legal/community-guidelines"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Charte de la communauté
            </a>{" "}
            et au droit applicable. Il est notamment interdit d&apos;utiliser
            Magic Clock pour organiser :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>la vente de services illégaux ou réglementés sans autorisation ;</li>
            <li>
              des prestations hors ligne qui violeraient la loi ou les droits de
              tiers ;
            </li>
            <li>
              des systèmes de fraude, de détournement de moyens de paiement ou
              de manipulation artificielle des statistiques.
            </li>
          </ul>

          <h3 className="mt-3 font-medium text-slate-900">
            9.3. Blocage préventif et litiges
          </h3>
          <p className="mt-1">
            En cas de suspicion raisonnable de fraude, de litige important ou de
            non-respect grave des présentes CGU/CGV, nous pouvons{" "}
            <strong>bloquer temporairement</strong> tout ou partie des sommes
            dues à un Créateur, le temps de procéder aux vérifications
            nécessaires ou de traiter les demandes des autorités compétentes.
          </p>
          <p className="mt-1">
            Lorsque cela est possible, le Créateur est informé des raisons
            principales de ce blocage et peut fournir des explications ou
            pièces justificatives. Les sommes injustement perçues ou frauduleuses
            peuvent être compensées avec les revenus futurs ou remboursées aux
            Utilisateurs concernés.
          </p>

          <p className="mt-2">
            La commission de la Plateforme est comprise entre{" "}
            <strong>20% et 30%</strong>, en fonction de la{" "}
            <strong>catégorie du Créateur</strong> (notamment déterminée sur la
            base de la performance globale de son contenu, par exemple le nombre
            de likes sur l’ensemble de ses créations). Le pourcentage applicable
            peut évoluer pour l’avenir ; toute modification sera communiquée de
            manière claire dans l’interface Monétisation.
          </p>

          <p className="mt-2">
            Les revenus sont regroupés et, sauf indication contraire dans
            l’interface Monétisation, versés en principe autour du{" "}
            <strong>15 de chaque mois</strong> pour les ventes du mois
            précédent. Lorsque cette date tombe un week-end ou un jour férié
            bancaire, le versement peut être effectué le{" "}
            <strong>jour ouvrable précédent</strong>.
          </p>

          <p className="mt-2">
            Un <strong>seuil minimum de versement</strong> peut être appliqué
            (par exemple <strong>50</strong> dans la{" "}
            <strong>devise de versement</strong>, comme 50&nbsp;CHF ou
            50&nbsp;EUR) afin de limiter les frais bancaires et
            administratifs. Lorsque le solde d’un Créateur est inférieur à ce
            seuil au moment du paiement, il est automatiquement reporté sur la
            période suivante jusqu’à ce que le seuil soit atteint.
          </p>

          <p className="mt-2">
            Les paiements sont réalisés par <strong>virement bancaire</strong>{" "}
            (notamment via les réseaux SEPA lorsque cela est possible), sur le
            compte communiqué par le Créateur. Il lui appartient de fournir des
            coordonnées bancaires exactes et à jour. Des vérifications d’identité
            (procédures KYC, lutte contre le blanchiment d’argent, etc.) peuvent
            être exigées avant tout premier versement ou au-delà de certains
            seuils.
          </p>

          <p className="mt-2">
            En cas de remboursements, de litiges, de chargebacks ou de suspicion
            de fraude, les montants concernés peuvent être{" "}
            <strong>déduits</strong> des revenus à venir ou faire l’objet
            d’ajustements sur les versements futurs, conformément aux présentes
            CGU/CGV et au droit applicable.
          </p>
        </section>

        {/* 10. Modération */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            10. Modération et signalements
          </h2>
          <p className="mt-2">
            Les Utilisateurs peuvent signaler un contenu ou un comportement via
            les outils prévus à cet effet. Nous pouvons, de bonne foi et à
            notre seule appréciation raisonnable :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>retirer ou restreindre l’accès à un contenu ;</li>
            <li>limiter certaines fonctionnalités d’un compte ;</li>
            <li>
              suspendre ou fermer un compte et, le cas échéant, informer les
              autorités compétentes.
            </li>
          </ul>
        </section>

               {/* 11. Données personnelles */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            11. Données personnelles
          </h2>
          <p className="mt-2">
            Le traitement de vos données personnelles est régi par notre{" "}
            <a
              href="/legal/privacy"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de confidentialité
            </a>
            . Les présentes CGU/CGV renvoient à ce document pour tous les
            aspects liés à la protection des données.
          </p>

          <p className="mt-2">
            Conformément à cette Politique et au droit applicable, nous
            mettrons progressivement à disposition dans votre espace compte ou
            via nos formulaires dédiés des outils permettant notamment de :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>consulter et mettre à jour certaines informations de profil ;</li>
            <li>
              télécharger une copie de certaines données associées à votre
              compte, lorsque cela est techniquement possible ;
            </li>
            <li>
              demander la suppression de votre compte et de vos données, sous
              réserve de nos obligations légales de conservation ;
            </li>
            <li>
              gérer vos préférences en matière de cookies et de notifications
              marketing.
            </li>
          </ul>
        </section>

        {/* 12. Propriété intellectuelle */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            12. Propriété intellectuelle de Magic Clock
          </h2>
          <p className="mt-2">
            Tous les éléments de la Plateforme (marques, logos, interfaces,
            designs, textes, code, fonctionnalités, etc.) sont protégés par des
            droits de propriété intellectuelle. Sauf autorisation écrite
            préalable, toute reproduction, modification ou exploitation est
            interdite.
          </p>
        </section>

        {/* 13. Responsabilité */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            13. Responsabilité
          </h2>
          <p className="mt-2">
            Dans les limites autorisées par la loi applicable :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              l’Éditeur n’est pas responsable des contenus publiés par les
              Utilisateurs ;
            </li>
            <li>
              l’Éditeur ne garantit pas l’absence totale d’erreurs ni la
              disponibilité ininterrompue des Services ;
            </li>
            <li>
              l’Éditeur ne peut être tenu responsable des dommages indirects,
              pertes de données ou manque à gagner.
            </li>
          </ul>
          <p className="mt-2">
            Rien dans cette clause ne limite les droits impératifs des
            consommateurs, notamment dans l’UE/EEE, au Royaume-Uni, en Suisse ou
            dans les États où une telle limitation est interdite.
          </p>
        </section>

        {/* 14. Droit applicable */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            14. Droit applicable et juridiction compétente
          </h2>
          <p className="mt-2">
            Sauf disposition impérative contraire, les présentes CGU/CGV sont
            soumises au <strong>droit suisse</strong>.
          </p>
          <p className="mt-2">
            Tout litige sera soumis aux tribunaux compétents du siège de
            l’Éditeur. Pour les consommateurs résidant dans l’UE/EEE ou au
            Royaume-Uni, ceux-ci peuvent également saisir les tribunaux de leur
            lieu de résidence habituelle, conformément aux règles applicables.
          </p>
        </section>

        {/* 15. Contact */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            15. Contact
          </h2>
          <p className="mt-2">
            Pour toute question concernant les présentes CGU/CGV, vous pouvez
            nous écrire à :{" "}
            <a
              href="mailto:[email-légal-à-compléter]"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              [email-légal-à-compléter]
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
