// app/legal/cgv/page.tsx
// ✅ v2.4 — 12 mars 2026
// Harmonisation : Magic Clock SA · clarification marketplace / paiements / reversements
// Ajout 8.6 : modification du prix des abonnements avec préavis de 30 jours
import { PaymentMethodsSection } from "@/components/legal/PaymentMethodsSection";

export const metadata = {
  title: "CGV – Magic Clock",
};

export default function LegalCGVPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Conditions générales d&apos;utilisation et de vente
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Plateforme Magic Clock – Dernière mise à jour : 12 mars 2026
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Objet des CGU/CGV
          </h2>
          <p className="mt-2">
            Les présentes conditions générales d&apos;utilisation et de vente
            (ci-après les <strong>« CGU/CGV »</strong>) définissent les règles
            d&apos;accès et d&apos;utilisation de la plateforme{" "}
            <strong>Magic Clock</strong> (ci-après la{" "}
            <strong>« Plateforme »</strong>), ainsi que les conditions
            applicables à l&apos;achat de contenus numériques, de contenus PPV
            et d&apos;abonnements proposés via la Plateforme.
          </p>
          <p className="mt-2">
            La Plateforme est éditée par <strong>Magic Clock SA</strong>, société
            de droit suisse, dont le siège est situé à{" "}
            <strong>Rue des Saars 6, 2000 Neuchâtel – Suisse</strong> (ci-après
            l&apos;<strong>« Éditeur »</strong>, <strong>« nous »</strong>).
          </p>
          <p className="mt-2">
            En accédant à la Plateforme, en créant un compte ou en achetant un
            contenu ou un abonnement, l&apos;utilisateur (ci-après{" "}
            <strong>« vous »</strong> ou l&apos;<strong>« Utilisateur »</strong>)
            reconnaît avoir lu, compris et accepté les présentes CGU/CGV.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">2. Définitions</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Utilisateur</strong> : toute personne disposant
              d&apos;un compte Magic Clock, qu&apos;elle soit créateur ou membre
              inscrit.
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
              <strong>Abonnement</strong> : formule payante permettant
              d&apos;accéder à certains contenus d&apos;un Créateur pendant une
              période déterminée, selon les conditions affichées lors de
              l&apos;achat.
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

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Champ d&apos;application géographique
          </h2>
          <p className="mt-2">
            La Plateforme est accessible aux Utilisateurs situés en Suisse, dans
            l&apos;Union européenne / EEE, au Royaume-Uni, aux États-Unis et,
            plus largement, dans tout pays où son utilisation n&apos;est pas
            contraire au droit local.
          </p>
          <p className="mt-2">
            En cas de conflit entre une règle impérative du pays de résidence
            habituelle de l&apos;Utilisateur et les présentes CGU/CGV, la règle
            impérative applicable prévaut.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Inscription et compte
          </h2>

          <h3 className="mt-2 font-medium text-slate-900">4.1. Âge minimum</h3>
          <p className="mt-1">
            La Plateforme est réservée aux personnes ayant l&apos;âge minimum
            requis par la loi applicable dans leur pays de résidence ou
            disposant, lorsque cela est requis, de l&apos;autorisation valable de
            leur représentant légal.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">4.2. Création du compte</h3>
          <p className="mt-1">
            Vous vous engagez à fournir des informations exactes, complètes et à
            jour, à ne pas usurper l&apos;identité d&apos;un tiers et à garder
            vos identifiants confidentiels. Vous nous informez sans délai de toute
            utilisation non autorisée de votre compte.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">4.3. Suspension et fermeture</h3>
          <p className="mt-1">Nous pouvons suspendre ou fermer un compte en cas de :</p>
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
            l&apos;Utilisateur remplit les conditions d&apos;accès applicables.
          </p>
          <p className="mt-1">
            Tout compte créé en violation de ces règles pourra être suspendu ou
            fermé.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Rôle de la Plateforme
          </h2>
          <p className="mt-2">
            Magic Clock est une <strong>plateforme UGC</strong> permettant à des
            créateurs indépendants de publier, partager et monétiser leurs
            contenus auprès d&apos;une communauté.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              La Plateforme fournit l&apos;infrastructure technique, les outils
              de publication, les fonctions de paiement activées, les mécanismes
              de modération et les interfaces de reversement.
            </li>
            <li>
              Selon la configuration de paiement active, la nature du produit, la
              juridiction concernée et le flux Stripe Connect retenu, Magic Clock
              peut intervenir comme opérateur de plateforme, encaisseur technique,
              intermédiaire de paiement et/ou entité responsable de certaines
              obligations fiscales ou de facturation.
            </li>
            <li>
              Sauf disposition légale impérative contraire ou indication expresse
              au moment du paiement, le Créateur demeure responsable de son offre,
              de la fixation de son prix et du contenu vendu à l&apos;Utilisateur.
            </li>
          </ul>
        </section>

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
              vous disposez de tous les droits nécessaires (droits
              d&apos;auteur, droit à l&apos;image, droits voisins, etc.) ;
            </li>
            <li>le contenu ne viole aucun droit de tiers ni aucune loi applicable ;</li>
            <li>le contenu respecte nos règles de communauté et de modération.</li>
          </ul>

          <h3 className="mt-3 font-medium text-slate-900">
            6.2. Licence accordée à la Plateforme
          </h3>
          <p className="mt-1">
            En publiant un contenu sur Magic Clock, vous accordez à l&apos;Éditeur,
            pour le monde entier et pour la durée légale des droits, une{" "}
            <strong>licence non exclusive, transférable, sous-licenciable et gratuite</strong>{" "}
            afin de :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>héberger, stocker, reproduire et adapter le contenu ;</li>
            <li>
              le représenter et le communiquer au public via la Plateforme et ses
              supports associés ;
            </li>
            <li>
              réaliser des actions raisonnables de promotion de la Plateforme,
              dans le respect de vos droits moraux lorsque ceux-ci sont
              applicables.
            </li>
          </ul>

          <h3 className="mt-3 font-medium text-slate-900">6.3. Suppression des contenus</h3>
          <p className="mt-1">
            Vous pouvez supprimer vos contenus à tout moment. Certains contenus
            peuvent toutefois être conservés pendant une durée limitée pour des
            raisons légales, techniques, de sécurité, de sauvegarde ou de gestion
            de litiges.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            6.4. Nature des contenus pédagogiques
          </h3>
          <p className="mt-1">
            Les contenus proposés par les Créateurs ont pour finalité de{" "}
            <strong>partager une méthode, un savoir-faire ou un retour d&apos;expérience</strong>.
            L&apos;achat d&apos;un contenu ne comporte aucune promesse de résultat
            garanti.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Comportements interdits
          </h2>
          <p className="mt-2">
            Sont strictement interdits, notamment, les contenus ou comportements :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>violents, haineux, discriminatoires, diffamatoires, harcelants ou pornographiques ;</li>
            <li>portant atteinte à la dignité humaine, aux mineurs, ou incitant à des activités illégales ;</li>
            <li>portant atteinte aux droits de propriété intellectuelle ou aux données personnelles de tiers ;</li>
            <li>relevant de la fraude, de la manipulation de paiements ou de statistiques ;</li>
            <li>visant à dégrader la sécurité ou le fonctionnement de la Plateforme.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Monétisation, prix et paiements
          </h2>

          <h3 className="mt-2 font-medium text-slate-900">8.1. Fixation des prix</h3>
          <p className="mt-1">
            Les Créateurs fixent librement le prix de leurs abonnements et de
            leurs contenus PPV, dans les limites techniques définies par la
            Plateforme.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">8.2. Commission de la Plateforme</h3>
          <p className="mt-1">
            L&apos;Éditeur perçoit une <strong>commission</strong> dont le taux
            applicable est affiché dans l&apos;interface Monétisation au moment de
            la mise en vente ou de l&apos;activation de l&apos;offre concernée.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">8.3. Taxes et TVA</h3>
          <p className="mt-1">
            Les prix affichés sont présentés dans la devise d&apos;achat de
            l&apos;Utilisateur. Lorsque la loi l&apos;exige, les taxes
            applicables, y compris la TVA ou taxes indirectes assimilées, sont
            calculées, collectées et affichées selon le rôle fiscal de la
            Plateforme ou du Créateur dans la transaction concernée.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            8.4. Paiements et prestataire de paiement
          </h3>
          <p className="mt-1">
            Les paiements sont traités par <strong>Stripe</strong> ou par tout
            autre prestataire de services de paiement que la Plateforme pourrait
            activer ultérieurement. En utilisant les Services payants, vous
            acceptez également les conditions du prestataire de paiement
            concerné.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">8.5. Droit de rétractation</h3>
          <p className="mt-1">
            Lorsque le droit applicable le prévoit, certains Utilisateurs
            consommateurs peuvent bénéficier d&apos;un droit de rétractation.
            Toutefois, pour les contenus numériques fournis sans support matériel,
            ce droit peut être exclu ou perdu lorsque l&apos;exécution commence
            immédiatement après l&apos;achat, sous réserve du recueil préalable
            des consentements et confirmations requis par la loi applicable.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            8.6. Modification du prix des abonnements
          </h3>
          <p className="mt-1">
            Un Créateur peut modifier le prix de ses abonnements pour les périodes futures.
            Tout changement de prix est notifié à l&apos;abonné concerné au moins
            <strong> 30 jours </strong>
            avant son entrée en vigueur.
          </p>
          <p className="mt-1">
            Le nouveau prix ne s&apos;applique jamais rétroactivement à une période déjà payée.
            L&apos;abonné peut résilier son abonnement à tout moment avant la date
            d&apos;entrée en vigueur du nouveau prix.
          </p>
          <p className="mt-1">
            À défaut de résiliation avant cette date, l&apos;abonnement se poursuit au
            nouveau tarif à compter du cycle de facturation suivant, sous réserve du droit
            applicable et des éventuelles exigences du prestataire de paiement.
          </p>
        </section>

        <PaymentMethodsSection />

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Rémunération des Créateurs
          </h2>
          <p className="mt-2">
            Le montant dû à un Créateur correspond aux sommes effectivement
            encaissées et définitivement disponibles, après déduction notamment
            de la commission de la Plateforme, des taxes applicables, des frais
            de paiement, remboursements, rétrofacturations, contestations,
            réserves, retenues de sécurité ou ajustements applicables.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">9.1. Statut et obligations</h3>
          <p className="mt-1">
            Le Créateur rémunéré reste seul responsable de ses déclarations
            fiscales, sociales, comptables et administratives liées aux revenus
            perçus via Magic Clock, sauf disposition légale contraire imposant un
            rôle spécifique à la Plateforme.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">9.2. Versements</h3>
          <p className="mt-1">
            Les reversements aux Créateurs sont effectués via le compte de
            paiement connecté, sous réserve de la bonne configuration du compte,
            du respect des obligations de vérification d&apos;identité (KYC/KYB),
            de la disponibilité effective des fonds et des paramètres techniques
            du prestataire de paiement.
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong>Calendrier :</strong> les reversements peuvent être manuels,
              hebdomadaires, mensuels ou selon tout autre calendrier compatible
              avec les paramètres du prestataire de paiement et la configuration
              de la Plateforme.
            </li>
            <li>
              <strong>Seuil minimum :</strong> un seuil minimum de reversement
              peut être appliqué et affiché dans l&apos;interface ou communiqué au
              Créateur.
            </li>
            <li>
              <strong>Délai de disponibilité :</strong> les fonds peuvent rester
              indisponibles pendant un certain délai après encaissement afin de
              couvrir les risques de remboursement, contestation, fraude, frais ou
              obligations réglementaires.
            </li>
            <li>
              <strong>Méthode :</strong> la méthode de versement dépend du pays du
              Créateur, du compte connecté, des capacités disponibles et du
              prestataire de paiement activé.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Les paramètres de reversement peuvent être modifiés pour des raisons
            légales, opérationnelles, de conformité, de risque ou d&apos;évolution
            du prestataire de paiement, sous réserve d&apos;une information
            raisonnable des Créateurs concernés.
          </p>

          <h3 className="mt-3 font-medium text-slate-900">
            9.3. Blocage préventif et litiges
          </h3>
          <p className="mt-1">
            En cas de suspicion raisonnable de fraude, de contestation de
            paiement, de non-respect grave des présentes CGU/CGV, de demande
            d&apos;une autorité compétente ou d&apos;obligation de conformité,
            nous pouvons suspendre temporairement tout ou partie des sommes dues,
            le temps des vérifications nécessaires.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            10. Modération et signalements
          </h2>
          <p className="mt-2">
            Les Utilisateurs peuvent signaler un contenu ou un comportement via
            les outils prévus à cet effet. Nous pouvons retirer ou restreindre
            l&apos;accès à un contenu, limiter certaines fonctionnalités ou fermer
            un compte, conformément aux présentes CGU/CGV et à nos règles de
            communauté.
          </p>
        </section>

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
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            12. Propriété intellectuelle de Magic Clock
          </h2>
          <p className="mt-2">
            Tous les éléments de la Plateforme (marques, logos, interfaces,
            designs, textes, code, fonctionnalités, etc.) sont protégés par des
            droits de propriété intellectuelle. Sauf autorisation écrite
            préalable, toute reproduction ou exploitation est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">13. Responsabilité</h2>
          <p className="mt-2">
            Dans les limites autorisées par la loi applicable, l&apos;Éditeur
            n&apos;est pas responsable des contenus publiés par les Utilisateurs,
            ne garantit pas la disponibilité ininterrompue des Services, et ne
            peut être tenu responsable des dommages indirects, pertes de données,
            pertes d&apos;exploitation ou pertes d&apos;opportunité.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            14. Droit applicable et juridiction compétente
          </h2>
          <p className="mt-2">
            Sauf disposition impérative contraire, les présentes CGU/CGV sont
            soumises au <strong>droit suisse</strong>. Tout litige sera soumis
            aux tribunaux compétents du siège de l&apos;Éditeur à Neuchâtel.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">15. Contact</h2>
          <p className="mt-2">
            Pour toute question concernant les présentes CGU/CGV :{" "}
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
