export default function CguPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="mb-8 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-500">
          Légal
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Conditions générales d&apos;utilisation (CGU)
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Les présentes Conditions générales d&apos;utilisation encadrent
          l&apos;accès et l&apos;usage du site et de la plateforme Magic Clock
          par les visiteurs, utilisateurs et créateurs de contenus. Elles
          complètent les Conditions générales de vente (CGV) et la Politique de
          confidentialité.
        </p>
        <p className="text-xs text-slate-500">
          Dernière mise à jour : 26 novembre 2025
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* 1. Acceptation */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Acceptation des CGU
          </h2>
          <p className="mt-2">
            En accédant au site, en naviguant dessus ou en utilisant la
            plateforme Magic Clock (y compris l&apos;application web et
            mobile), vous reconnaissez avoir lu, compris et accepté les
            présentes Conditions générales d&apos;utilisation. Si vous
            n&apos;acceptez pas ces CGU, vous ne devez pas utiliser la
            plateforme.
          </p>
          <p className="mt-2">
            Lorsque vous créez un compte Magic Clock, il peut vous être demandé
            de cocher une case de validation. Cette action vaut acceptation
            expresse des présentes CGU.
          </p>
        </section>

        {/* 2. Objet */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Objet de la plateforme
          </h2>
          <p className="mt-2">
            Magic Clock est une plateforme en ligne permettant notamment&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              de publier et partager des contenus visuels (photos, vidéos,
              avant/après, Magic Clock Display, etc.) ;
            </li>
            <li>
              de découvrir des créateurs, salons et professionnels de la
              beauté, en particulier dans le domaine de la coiffure et de la
              colorimétrie ;
            </li>
            <li>
              de monétiser certains contenus via des options gratuites,
              d&apos;abonnement ou de paiement à la séance (PPV) ;
            </li>
            <li>
              d&apos;échanger avec d&apos;autres membres via des fonctionnalités
              sociales (messages, commentaires, likes, etc.).
            </li>
          </ul>
          <p className="mt-2">
            Les fonctionnalités détaillées et les modalités de monétisation
            sont précisées dans les CGV, dans l&apos;interface Monétisation et
            sur la page dédiée{" "}
            <a
              href="/pricing"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              « Prix &amp; monétisation »
            </a>
            . À titre indicatif, les prix des abonnements et des contenus PPV
            peuvent être fixés par les créateurs dans une plage large (par
            exemple de <strong>0,99 à 999,99</strong>) dans la{" "}
            <strong>devise d&apos;achat de l&apos;Utilisateur</strong>, telle
            qu&apos;affichée au moment du paiement.
          </p>
        </section>

        {/* 3. Création de compte */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Création de compte et éligibilité
          </h2>
          <p className="mt-2">
            Pour accéder à certaines fonctionnalités (publication, messagerie,
            monétisation, etc.), vous devez créer un compte Magic Clock et
            fournir des informations exactes, complètes et à jour. Vous vous
            engagez à mettre à jour ces informations en cas de changement.
          </p>
          <p className="mt-2">
            L&apos;accès à la plateforme est en principe réservé aux personnes
            majeures selon la législation applicable dans leur pays de
            résidence, ou aux personnes mineures disposant de
            l&apos;autorisation de leur représentant légal. Des restrictions
            spécifiques peuvent s&apos;appliquer selon les pays et seront
            précisées par la suite.
          </p>
          <p className="mt-2">
            Vous êtes responsable du maintien de la confidentialité de vos
            identifiants et de toutes les activités effectuées à partir de votre
            compte. En cas de suspicion d&apos;utilisation frauduleuse, vous
            devez nous en informer dans les meilleurs délais.
          </p>
          <p className="mt-2">
            Lorsque la loi l&apos;exige ou que cela est approprié, Magic Clock
            peut mettre en place des mécanismes de{" "}
            <strong>vérification d&apos;âge</strong> ou demander des
            informations complémentaires afin de s&apos;assurer que
            l&apos;utilisateur remplit les conditions d&apos;âge minimum.
          </p>
          <p className="mt-2">
            Les contenus impliquant des <strong>mineurs</strong> (par exemple
            avant/après, tutos coiffure, etc.) ne peuvent être publiés que dans
            le respect strict du droit applicable, avec l&apos;autorisation
            nécessaire des représentants légaux et sans jamais sexualiser ou
            exploiter l&apos;image d&apos;un mineur.
          </p>
        </section>

        {/* 4. Utilisation acceptable */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Utilisation acceptable de la plateforme
          </h2>
          <p className="mt-2">
            Vous vous engagez à utiliser Magic Clock dans le respect des lois
            applicables, des bonnes pratiques professionnelles et des présentes
            CGU. À ce titre, il est notamment interdit&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              de publier des contenus illicites, discriminatoires, haineux,
              violents, diffamatoires, trompeurs ou portant atteinte à la
              dignité des personnes ;
            </li>
            <li>
              de publier des contenus violant les droits de propriété
              intellectuelle ou les droits à l&apos;image de tiers, sauf
              autorisation expresse ;
            </li>
            <li>
              d&apos;utiliser la plateforme pour spammer, harceler, menacer ou
              nuire à d&apos;autres utilisateurs ;
            </li>
            <li>
              de contourner les mesures techniques de protection, de tenter
              d&apos;accéder aux données ou comptes d&apos;autrui sans
              autorisation, ou de perturber le fonctionnement du service ;
            </li>
            <li>
              d&apos;utiliser Magic Clock pour toute activité interdite par la
              loi, y compris en matière de produits ou services réglementés.
            </li>
          </ul>
          <p className="mt-2">
            Magic Clock se réserve le droit de retirer tout contenu qui
            contreviendrait aux présentes règles ou qui serait signalé par la
            communauté, et de suspendre ou résilier les comptes concernés, dans
            le respect des lois applicables.
          </p>
          <p className="mt-2">
            Les règles détaillées de comportement, d&apos;inclusivité et de
            respect de la communauté sont précisées dans notre{" "}
            <a
              href="/legal/community-guidelines"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Charte de la communauté
            </a>
            . En cas de contradiction, les dispositions impératives de cette
            Charte complètent les présentes CGU.
          </p>
        </section>

        {/* 5. UGC */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Contenus générés par les utilisateurs (UGC)
          </h2>
          <p className="mt-2">
            Vous restez titulaire des droits de propriété intellectuelle
            attachés aux contenus que vous créez et publiez sur Magic Clock
            (photos, vidéos, textes, schémas Magic Clock, etc.), sous réserve
            des droits de tiers éventuellement applicables.
          </p>
          <p className="mt-2">
            En publiant un contenu sur la plateforme, vous accordez à Magic
            Clock une licence non exclusive, mondiale, libre de redevance et
            pouvant donner lieu à sous-licence, pour héberger, stocker,
            reproduire, représenter, adapter, traduire, distribuer et exploiter
            ce contenu dans le cadre du fonctionnement de la plateforme, de sa
            promotion et de sa mise à disposition des utilisateurs (y compris
            via les fonctionnalités de partage et de monétisation).
          </p>
          <p className="mt-2">
            Vous garantissez disposer de tous les droits nécessaires pour
            accorder cette licence, et que vos contenus ne portent pas atteinte
            aux droits de tiers. En cas de violation alléguée, Magic Clock peut
            être amenée à retirer le contenu en cause, voire à suspendre le
            compte, sous réserve des législations applicables (par exemple,
            procédures de type notice-and-takedown).
          </p>
        </section>

        {/* 6. PI Magic Clock */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Propriété intellectuelle de Magic Clock
          </h2>
          <p className="mt-2">
            L&apos;ensemble des éléments composant la plateforme Magic Clock
            (structure du site, charte graphique, logos, marque, interfaces,
            fonctionnalités logicielles, textes et éléments visuels créés par
            Magic Clock, etc.) est protégé par les droits de propriété
            intellectuelle et demeure la propriété exclusive de Magic Clock
            Holding SA et/ou de ses sociétés affiliées.
          </p>
          <p className="mt-2">
            Sauf autorisation écrite préalable, vous n&apos;êtes pas autorisé à
            reproduire, modifier, distribuer, louer, prêter, vendre ou créer
            des œuvres dérivées à partir de ces éléments, au-delà de votre
            usage strictement personnel de la plateforme.
          </p>
          <p className="mt-2">
            Pour plus de détails sur la manière dont nous gérons les marques,
            logos, contenus protégés et demandes de retrait pour atteinte aux
            droits, vous pouvez consulter notre{" "}
            <a
              href="/legal/ip-policy"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Politique de propriété intellectuelle
            </a>
            .
          </p>
        </section>

        {/* 7. Liens */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Liens externes
          </h2>
          <p className="mt-2">
            La plateforme peut contenir des liens vers des sites ou services
            tiers. Magic Clock ne contrôle pas ces ressources externes et
            n&apos;assume aucune responsabilité quant à leur contenu, leur
            fonctionnement ou leur conformité légale. L&apos;accès à ces sites
            se fait sous votre seule responsabilité.
          </p>
        </section>

        {/* 8. Suspension / résiliation */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Suspension et résiliation de compte
          </h2>
          <p className="mt-2">
            Magic Clock se réserve le droit de suspendre temporairement ou de
            résilier définitivement l&apos;accès à la plateforme de tout
            utilisateur qui ne respecterait pas les présentes CGU, la
            législation applicable ou les règles de la communauté, ou dont le
            comportement serait de nature à porter atteinte à la sécurité, à
            l&apos;intégrité ou à l&apos;image de la plateforme.
          </p>
          <p className="mt-2">
            Dans toute la mesure permise par la loi, Magic Clock pourra également
            supprimer ou limiter l&apos;accès à certains contenus, fonctionnalités
            ou options de monétisation en cas d&apos;abus ou de risque identifié.
          </p>
        </section>

        {/* 9. Responsabilité */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Responsabilité et absence de garantie
          </h2>
          <p className="mt-2">
            Magic Clock met en œuvre les moyens raisonnables pour assurer un
            fonctionnement sécurisé et continu de la plateforme, mais ne peut
            garantir une disponibilité permanente et exempte de toute erreur.
            Des interruptions temporaires peuvent survenir (maintenance,
            mises à jour, incidents techniques, etc.).
          </p>
          <p className="mt-2">
            Dans la limite autorisée par le droit applicable, Magic Clock ne
            saurait être tenue responsable des dommages indirects, pertes de
            données, pertes de chances ou préjudices immatériels résultant de
            l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser la
            plateforme, ni des contenus publiés par les utilisateurs eux-mêmes.
          </p>
          <p className="mt-2">
            Aucune information obtenue via la plateforme ne saurait être
            interprétée comme un conseil professionnel personnalisé (médical,
            financier, juridique, etc.). Les utilisateurs restent seuls
            responsables de leurs choix professionnels et commerciaux.
          </p>
        </section>

        {/* 10. Données perso / cookies / sécurité */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            10. Données personnelles, cookies et sécurité
          </h2>
          <p className="mt-2">
            Le traitement de vos données personnelles dans le cadre de
            l&apos;utilisation de Magic Clock est régi par notre{" "}
            <a
              href="/legal/privacy"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Politique de confidentialité
            </a>
            , qui décrit notamment les catégories de données collectées, les
            finalités des traitements et vos droits.
          </p>
          <p className="mt-2">
            L&apos;utilisation de cookies et technologies similaires est
            détaillée dans notre{" "}
            <a
              href="/legal/cookies"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Politique de cookies
            </a>
            .
          </p>
          <p className="mt-2">
            Un résumé de nos mesures techniques et organisationnelles pour
            protéger vos données, ainsi que de notre procédure en cas
            d&apos;incident, est disponible sur la page{" "}
            <a
              href="/legal/security"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Sécurité &amp; incidents
            </a>
            .
          </p>
        </section>

        {/* 11. Modifications */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            11. Modifications des CGU
          </h2>
          <p className="mt-2">
            Magic Clock peut adapter ou mettre à jour les présentes CGU afin de
            tenir compte de l&apos;évolution de la plateforme, des exigences
            légales ou des bonnes pratiques. La date de dernière mise à jour
            sera indiquée en tête de document.
          </p>
          <p className="mt-2">
            En cas de modification substantielle, les utilisateurs concernés
            pourront être informés par tout moyen approprié (notification sur la
            plateforme, e-mail, bannière d&apos;information, etc.). Le fait de
            continuer à utiliser la plateforme après l&apos;entrée en vigueur
            des nouvelles CGU vaudra acceptation de celles-ci.
          </p>
        </section>

        {/* 12. Droit applicable */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            12. Droit applicable et juridiction compétente
          </h2>
          <p className="mt-2">
            Sous réserve des règles impératives applicables, les présentes CGU
            sont soumises au <strong>droit suisse</strong>. En principe, tout
            litige relatif à leur interprétation, leur validité ou leur
            exécution sera soumis aux tribunaux compétents du siège de Magic
            Clock Holding SA, sous réserve d&apos;une autre juridiction imposée
            par des dispositions légales impératives (notamment pour les
            consommateurs).
          </p>
        </section>

        {/* 13. Contact & signalements */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            13. Contact et signalements
          </h2>
          <p className="mt-2">
            Pour toute question sur les présentes CGU, ou pour signaler un
            contenu ou un comportement que vous jugez contraire à la loi ou à
            nos règles, vous pouvez&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              utiliser les <strong>outils de signalement intégrés</strong> à la
              plateforme (boutons de signalement, formulaires dédiés) ; et/ou
            </li>
            <li>
              nous contacter à l&apos;adresse suivante&nbsp;:{" "}
              <a
                href="mailto:[email-legal-à-compléter]"
                className="font-medium text-violet-600 hover:text-violet-700"
              >
                [email-legal-à-compléter]
              </a>
              .
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Les informations relatives à l&apos;éditeur du site et aux
            coordonnées de contact figurent également sur la page{" "}
            <a
              href="/legal/mentions"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Mentions légales
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
