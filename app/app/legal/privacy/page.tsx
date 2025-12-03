// app/legal/privacy/page.tsx

export const metadata = {
  title: "Politique de confidentialité – Magic Clock",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Plateforme Magic Clock – Dernière mise à jour : 26 novembre 2025
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* 1. Responsable */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Responsable du traitement
          </h2>
          <p className="mt-2">
            La présente politique de confidentialité (ci-après la{" "}
            <strong>« Politique »</strong>) décrit la manière dont{" "}
            <strong>[Magic Clock SA]</strong>, société de droit suisse dont le
            siège social est situé à <strong>[adresse à compléter]</strong>{" "}
            (ci-après <strong>« Magic Clock »</strong>, <strong>« nous »</strong>
            ), traite les données personnelles des utilisateurs de la plateforme{" "}
            <strong>Magic Clock</strong> (ci-après la{" "}
            <strong>« Plateforme »</strong>).
          </p>
          <p className="mt-2">
            Magic Clock agit en qualité de{" "}
            <strong>responsable du traitement</strong> au sens :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>du droit suisse (LPD) pour les utilisateurs en Suisse ;</li>
            <li>
              du Règlement (UE) 2016/679 (RGPD) et des droits nationaux
              d’application pour les utilisateurs situés dans l’UE/EEE ;
            </li>
            <li>
              du UK GDPR et du Data Protection Act 2018 pour les utilisateurs
              situés au Royaume-Uni ;
            </li>
            <li>
              des lois fédérales ou étatiques applicables pour les utilisateurs
              situés aux États-Unis (par ex. CCPA/CPRA en Californie), le cas
              échéant.
            </li>
          </ul>
        </section>

        {/* 2. Données collectées */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Données personnelles que nous collectons
          </h2>
          <p className="mt-2">Nous pouvons collecter les catégories de données suivantes :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Données d’identification</strong> : nom, prénom (si fourni),
              nom d’utilisateur, photo de profil, identifiants de compte,
              préférences de langue.
            </li>
            <li>
              <strong>Coordonnées</strong> : adresse e-mail, pays, ville,
              éventuelles informations de contact partagées dans le profil.
            </li>
            <li>
              <strong>Données de contenu</strong> : photos, vidéos, contenus
              Magic Studio, Magic Display, descriptions, hashtags, commentaires,
              messages envoyés via la messagerie intégrée, métadonnées
              associées.
            </li>
            <li>
              <strong>Données de transaction</strong> : historique des achats,
              abonnements, contenus PPV, montants payés, devise, pays de
              facturation, informations liées au statut de paiement (réussi,
              échoué, remboursé). Les données complètes de carte bancaire sont
              traitées par notre prestataire de paiement et ne sont pas
              directement stockées par Magic Clock.
            </li>
            <li>
              <strong>Données techniques & de navigation</strong> : adresse IP,
              type et version du navigateur, identifiant de l’appareil, système
              d’exploitation, pages consultées, durée de visite, source de
              provenance, identifiants de cookies et technologies similaires.
            </li>
            <li>
              <strong>Données de support</strong> : contenu des demandes
              adressées au support, captures d’écran, échanges par e-mail ou via
              les canaux officiels.
            </li>
          </ul>
        </section>

        {/* 3. Finalités */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Finalités du traitement et bases légales
          </h2>
          <p className="mt-2">
            Nous traitons vos données personnelles pour les finalités suivantes,
            sur les bases légales indiquées :
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Fourniture de la Plateforme et des Services</strong> : création
              et gestion du compte, accès au contenu, messagerie, interactions
              sociales (likes, commentaires, follow), personnalisation basique
              de l’interface.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat (ou mesures précontractuelles).
              </span>
            </li>
            <li>
              <strong>Monétisation et paiements</strong> : gestion des abonnements,
              contenus PPV, reversement aux créateurs, facturation,
              comptabilité, prévention de la fraude.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat, respect d’obligations
                légales, intérêt légitime à sécuriser les transactions.
              </span>
            </li>
            <li>
              <strong>Modération, sécurité et prévention des abus</strong> : détection
              de contenus illicites ou contraires aux CGU/CGV, lutte contre le
              spam, violations de droits, atteintes à la sécurité.
              <br />
              <span className="text-slate-500">
                Base légale : intérêt légitime à garantir la sécurité de la
                Plateforme et le respect des lois.
              </span>
            </li>
            <li>
              <strong>Amélioration des Services et statistiques</strong> :
              analyse agrégée de l’utilisation de la Plateforme, mesure de
              performance, tests, correctifs, optimisation de l’expérience
              utilisateur.
              <br />
              <span className="text-slate-500">
                Base légale : intérêt légitime ; lorsque requis, consentement
                pour certains cookies/traceurs (voir Politique de cookies).
              </span>
            </li>
            <li>
              <strong>Communication et support</strong> : réponses aux demandes,
              notifications techniques, messages liés à la sécurité ou au
              fonctionnement du compte.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat, intérêt légitime.
              </span>
            </li>
            <li>
              <strong>Marketing et information facultative</strong> : envoi
              occasionnel d’e-mails d’information, nouveautés, contenus
              inspirants, dans les limites permises.
              <br />
              <span className="text-slate-500">
                Base légale : intérêt légitime ou consentement selon le droit
                applicable, avec possibilité de se désinscrire à tout moment.
              </span>
            </li>
            <li>
              <strong>Respect des obligations légales</strong> : obligations
              comptables, fiscales, réponses aux autorités, gestion des demandes
              liées aux droits des personnes.
              <br />
              <span className="text-slate-500">
                Base légale : respect d’obligations légales.
              </span>
            </li>
          </ul>
        </section>

        {/* 4. Durée de conservation */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Durée de conservation
          </h2>
          <p className="mt-2">
            Nous conservons vos données personnelles pendant une durée
            proportionnée aux finalités poursuivies :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Données de compte : pendant la durée d’utilisation de la
              Plateforme, puis pendant une période limitée après la fermeture du
              compte, pour des raisons de preuve ou conformément aux délais
              légaux.
            </li>
            <li>
              Données de transaction : pendant la durée requise par la législation
              comptable et fiscale applicable.
            </li>
            <li>
              Logs techniques et données de sécurité : pour une durée généralement
              limitée à quelques mois, sauf incident nécessitant une conservation
              plus longue.
            </li>
            <li>
              Cookies : selon la durée de vie indiquée dans la{" "}
              <a
                href="/legal/cookies"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Politique de cookies
              </a>
              .
            </li>
          </ul>
        </section>

        {/* 5. Partage des données */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Partage de vos données
          </h2>
          <p className="mt-2">Nous pouvons partager vos données avec :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Prestataires et sous-traitants</strong> : hébergement,
              envoi d’e-mails, prestataires de paiement, outils d’analyse,
              support technique, modération assistée.
            </li>
            <li>
              <strong>Autorités et organismes publics</strong> : lorsque la loi
              l’exige ou pour défendre nos droits, ceux des utilisateurs ou des
              tiers.
            </li>
            <li>
              <strong>Autres utilisateurs</strong> : dans la mesure où vos
              contenus et certaines informations de profil sont publics par
              nature (par ex. pseudo, avatar, statistiques publiques).
            </li>
          </ul>
          <p className="mt-2">
            Nous ne vendons pas vos données personnelles au sens des lois qui
            définissent la « vente » de données, sauf si cela devait être
            expressément prévu et soumis à votre consentement préalable.
          </p>
        </section>

        {/* 6. Transferts internationaux */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Transferts internationaux de données
          </h2>
          <p className="mt-2">
            Certains prestataires peuvent être situés en dehors de la Suisse, de
            l’UE/EEE ou du Royaume-Uni. Dans ce cas, nous veillons à ce que des{" "}
            <strong>garanties appropriées</strong> soient mises en place, par
            exemple :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>décisions d’adéquation de la Commission européenne ;</li>
            <li>clauses contractuelles types approuvées ;</li>
            <li>
              ou toute autre mesure prévue par la législation applicable en
              matière de protection des données.
            </li>
          </ul>
        </section>

        {/* 7. Vos droits */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Vos droits
          </h2>
          <p className="mt-2">
            Selon votre lieu de résidence et la législation applicable, vous
            pouvez disposer notamment des droits suivants :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>droit d’accès à vos données ;</li>
            <li>droit de rectification des données inexactes ou incomplètes ;</li>
            <li>droit à l’effacement (« droit à l’oubli ») dans certains cas ;</li>
            <li>droit à la limitation du traitement ;</li>
            <li>
              droit d’opposition au traitement fondé sur l’intérêt légitime ou à
              la prospection ;
            </li>
            <li>
              droit à la portabilité des données, lorsqu’il est applicable ;
            </li>
            <li>
              droit de retirer votre consentement à tout moment, sans remettre
              en cause la licéité des traitements antérieurs ;
            </li>
            <li>
              droit d’introduire une réclamation auprès d’une autorité de
              contrôle compétente.
            </li>
          </ul>
          <p className="mt-2">
            Pour exercer vos droits, vous pouvez nous contacter à l’adresse
            suivante :{" "}
            <a
              href="mailto:[email-dpo-à-compléter]"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              [email-dpo-à-compléter]
            </a>
            . Nous pourrons être amenés à vérifier votre identité avant de
            répondre à votre demande.
          </p>
        </section>

        {/* 8. Sécurité */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Sécurité des données
          </h2>
          <p className="mt-2">
            Nous mettons en œuvre des mesures techniques et organisationnelles
            raisonnables pour protéger vos données personnelles contre la perte,
            l’utilisation abusive, l’accès non autorisé ou la divulgation.
          </p>
          <p className="mt-2">
            Aucun système n’étant totalement sécurisé, nous vous invitons
            également à :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>choisir un mot de passe robuste et unique ;</li>
            <li>ne pas partager vos identifiants avec des tiers ;</li>
            <li>nous signaler sans délai toute suspicion de compromission.</li>
          </ul>
        </section>

        {/* 9. Mineurs */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Utilisation par des mineurs
          </h2>
          <p className="mt-2">
            La Plateforme n’est pas destinée aux enfants en dessous de l’âge
            minimum indiqué dans nos CGU/CGV. Lorsque la loi l’exige, certaines
            fonctionnalités peuvent nécessiter le consentement ou l’autorisation
            d’un représentant légal.
          </p>
        </section>

        {/* 10. Cookies */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            10. Cookies et technologies similaires
          </h2>
          <p className="mt-2">
            Pour plus d’informations sur l’utilisation des cookies et
            technologies similaires (tags, pixels, SDK, etc.), ainsi que sur vos
            choix, veuillez consulter notre{" "}
            <a
              href="/legal/cookies"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de cookies
            </a>
            .
          </p>
        </section>

        {/* 11. Modifications */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            11. Modifications de la présente Politique
          </h2>
          <p className="mt-2">
            Nous pouvons mettre à jour la présente Politique pour refléter
            l’évolution de nos pratiques ou des exigences légales. En cas de
            modification importante, nous vous en informerons par des moyens
            appropriés (notification dans l’app, e-mail, bannière…).
          </p>
        </section>

        {/* 12. Contact */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            12. Contact
          </h2>
          <p className="mt-2">
            Pour toute question concernant la présente Politique ou le traitement
            de vos données, vous pouvez nous contacter à :{" "}
            <a
              href="mailto:[email-dpo-à-compléter]"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              [email-dpo-à-compléter]
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
