// app/legal/privacy/page.tsx
// ✅ v2.2 — 12 mars 2026 · Magic Clock SA · support@magic-clock.com
// Prestataires listés : Supabase · Cloudflare · Vercel · Stripe · GitHub
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
          Plateforme Magic Clock – Dernière mise à jour : 12 mars 2026
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Responsable du traitement
          </h2>
          <p className="mt-2">
            La présente politique de confidentialité (ci-après la{" "}
            <strong>« Politique »</strong>) décrit la manière dont{" "}
            <strong>Magic Clock SA</strong>, société de droit suisse dont le
            siège est situé à{" "}
            <strong>Rue des Saars 6, 2000 Neuchâtel – Suisse</strong>{" "}
            (ci-après <strong>« Magic Clock »</strong>, <strong>« nous »</strong>)
            traite les données personnelles des utilisateurs de la plateforme{" "}
            <strong>Magic Clock</strong>.
          </p>
          <p className="mt-2">
            Magic Clock agit en qualité de{" "}
            <strong>responsable du traitement</strong> au sens du droit
            applicable, notamment :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>de la LPD suisse pour les utilisateurs situés en Suisse ;</li>
            <li>
              du Règlement (UE) 2016/679 (RGPD) pour les utilisateurs situés
              dans l’UE/EEE ;
            </li>
            <li>
              du UK GDPR et du Data Protection Act 2018 pour les utilisateurs
              situés au Royaume-Uni ;
            </li>
            <li>
              des lois fédérales ou étatiques applicables pour les utilisateurs
              situés aux États-Unis, lorsque ces lois sont applicables.
            </li>
          </ul>
          <p className="mt-2">
            Lorsque le droit applicable l’exige, Magic Clock désignera un{" "}
            <strong>représentant dans l’UE/EEE et/ou au Royaume-Uni</strong>,
            dont les coordonnées seront alors communiquées dans la présente
            Politique ou par tout autre moyen approprié.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Données personnelles que nous collectons
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Données d’identification</strong> : nom d’utilisateur,
              photo de profil, identifiants de compte, préférences de langue.
            </li>
            <li>
              <strong>Coordonnées</strong> : adresse e-mail, pays, ville ou
              informations de localisation générale fournies par l’utilisateur.
            </li>
            <li>
              <strong>Données de contenu</strong> : photos, vidéos, contenus
              Magic Studio, Magic Display, commentaires, messages et autres
              contenus publiés ou transmis via la plateforme.
            </li>
            <li>
              <strong>Données de transaction</strong> : historique des achats,
              abonnements, contenus PPV, informations relatives aux paiements et
              aux versements. Les données complètes de carte bancaire sont
              traitées par Stripe ou par le prestataire de paiement concerné et
              ne sont pas stockées par Magic Clock.
            </li>
            <li>
              <strong>Données techniques et de navigation</strong> : adresse IP,
              type de navigateur, système d’exploitation, identifiant
              d’appareil, pages consultées, journaux techniques, identifiants de
              cookies et données de session.
            </li>
            <li>
              <strong>Données de support</strong> : contenu des demandes
              adressées au support et échanges par e-mail ou via d’autres canaux
              de contact.
            </li>
            <li>
              <strong>Données de conformité</strong> : lorsque cela est requis,
              données nécessaires à la vérification d’identité, à la prévention
              de la fraude, à la sécurité des paiements ou aux obligations
              réglementaires liées aux versements et à la monétisation.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Finalités du traitement et bases légales
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Fourniture de la plateforme</strong> : création et gestion
              du compte, accès au contenu, messagerie, interactions sociales,
              gestion des préférences utilisateur.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat ou mesures précontractuelles.
              </span>
            </li>
            <li>
              <strong>Monétisation et paiements</strong> : gestion des
              abonnements, contenus PPV, reversements aux créateurs,
              justificatifs, traitement des paiements et gestion des litiges de
              paiement.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat et obligations légales.
              </span>
            </li>
            <li>
              <strong>Modération et sécurité</strong> : détection de contenus
              illicites, prévention des abus, lutte contre le spam, sécurisation
              des comptes, détection de fraude.
              <br />
              <span className="text-slate-500">
                Base légale : intérêt légitime et, lorsque nécessaire,
                obligations légales.
              </span>
            </li>
            <li>
              <strong>Amélioration des services</strong> : analyses agrégées,
              statistiques, mesure de performance, corrections de bugs,
              amélioration de l’expérience utilisateur.
              <br />
              <span className="text-slate-500">
                Base légale : intérêt légitime ou consentement lorsque requis.
              </span>
            </li>
            <li>
              <strong>Communication et support</strong> : réponse aux demandes,
              notifications techniques, informations liées au compte, au service
              ou à la sécurité.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat, intérêt légitime ou
                consentement selon le cas.
              </span>
            </li>
            <li>
              <strong>Respect des obligations légales</strong> : obligations
              comptables, fiscales, réglementaires, conformité et réponses aux
              autorités compétentes.
              <br />
              <span className="text-slate-500">
                Base légale : obligations légales.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Durée de conservation
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Données de compte</strong> : pendant la durée
              d’utilisation du compte, puis pendant une période limitée
              nécessaire à la gestion administrative, à la sécurité, à la
              défense de nos droits ou aux litiges éventuels.
            </li>
            <li>
              <strong>Données de transaction</strong> : pendant la durée requise
              par la législation comptable, fiscale, réglementaire ou de lutte
              contre la fraude applicable.
            </li>
            <li>
              <strong>Logs techniques et sécurité</strong> : pour une durée
              limitée compatible avec les besoins de sécurité, de maintenance,
              d’audit ou d’investigation, sauf nécessité de conservation plus
              longue.
            </li>
            <li>
              <strong>Données de support</strong> : pendant la durée nécessaire
              au traitement de la demande puis, si nécessaire, pendant une
              période limitée pour le suivi, la preuve ou l’amélioration du
              service.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Partage de vos données
          </h2>
          <p className="mt-2">Nous pouvons partager vos données avec :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Prestataires techniques et sous-traitants</strong> :
              hébergement, infrastructure, authentification, traitement des
              paiements, stockage, sécurité, support technique et outils
              nécessaires au fonctionnement de la plateforme.
            </li>
            <li>
              <strong>Autorités et organismes publics</strong> : lorsque la loi
              l’exige, lorsqu’une demande valable nous est adressée ou lorsque
              cela est nécessaire pour défendre nos droits, respecter nos
              obligations ou prévenir la fraude et les abus.
            </li>
            <li>
              <strong>Autres utilisateurs</strong> : dans la mesure où certaines
              informations de profil, contenus ou interactions sont rendus
              publics ou partagés selon les paramètres de visibilité de la
              plateforme.
            </li>
            <li>
              <strong>Partenaires liés aux paiements et reversements</strong> :
              dans la mesure nécessaire au traitement d’un paiement, d’un
              remboursement, d’un litige, d’une vérification d’identité ou d’un
              versement à un créateur.
            </li>
          </ul>
          <p className="mt-2">
            Nous ne vendons pas vos données personnelles à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Prestataires techniques principaux
          </h2>
          <p className="mt-2">
            La plateforme s’appuie notamment sur les prestataires suivants, qui
            peuvent traiter certaines données dans le cadre de leurs services :
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Supabase</strong> — base de données, authentification et
              stockage de certaines données utilisateurs.
            </li>
            <li>
              <strong>Cloudflare</strong> — diffusion de contenu, optimisation
              réseau, sécurité, protection des accès et éventuellement stockage
              média.
            </li>
            <li>
              <strong>Vercel</strong> — hébergement et déploiement de
              l’application web.
            </li>
            <li>
              <strong>Stripe</strong> — traitement des paiements, gestion de
              certaines données de transaction et, selon les cas, vérifications
              de conformité liées aux paiements ou aux versements.
            </li>
            <li>
              <strong>GitHub</strong> — infrastructure de développement et
              gestion du code source. GitHub n’est pas destiné à héberger les
              données utilisateurs opérationnelles de la plateforme.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Chacun de ces prestataires dispose de sa propre politique de
            confidentialité. Lorsque cela est requis, nous mettons en place des
            garanties contractuelles, techniques ou organisationnelles
            appropriées pour encadrer les traitements et transferts de données.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Transferts internationaux de données
          </h2>
          <p className="mt-2">
            Certains prestataires ou traitements peuvent impliquer un transfert
            de données en dehors de la Suisse, de l’UE/EEE ou du Royaume-Uni.
            Dans ce cas, nous veillons à mettre en place des{" "}
            <strong>garanties appropriées</strong> lorsque cela est nécessaire,
            telles que des décisions d’adéquation, des clauses contractuelles
            types ou d’autres mécanismes reconnus par le droit applicable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Vos droits
          </h2>
          <p className="mt-2">
            Selon votre lieu de résidence et le droit applicable, vous pouvez
            disposer notamment des droits suivants : accès, rectification,
            effacement, limitation, opposition, portabilité, retrait du
            consentement lorsque le traitement repose sur celui-ci, et
            réclamation auprès d’une autorité compétente.
          </p>
          <p className="mt-2">
            Pour exercer vos droits :{" "}
            <a
              href="mailto:support@magic-clock.com"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              support@magic-clock.com
            </a>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Avant de contacter l’autorité compétente, nous vous invitons, lorsque
            cela est possible, à nous contacter d’abord afin de tenter de résoudre
            votre demande directement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Sécurité des données
          </h2>
          <p className="mt-2">
            Nous mettons en œuvre des mesures techniques et organisationnelles
            raisonnables pour protéger vos données, notamment le chiffrement des
            communications, les contrôles d’accès, la gestion des droits, la
            séparation des environnements, la journalisation, la surveillance et
            des mesures de sécurité adaptées au niveau de risque.
          </p>
          <p className="mt-2">
            Aucun système n’étant totalement exempt de risque, nous vous
            invitons à choisir un mot de passe robuste, à protéger l’accès à vos
            appareils et à nous signaler sans délai toute suspicion de
            compromission.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            10. Utilisation par des mineurs
          </h2>
          <p className="mt-2">
            La plateforme n’est pas destinée aux personnes ne remplissant pas les
            conditions d’âge minimum prévues par nos CGU/CGV et par le droit
            applicable. Certaines fonctionnalités peuvent être limitées ou
            nécessiter l’autorisation d’un représentant légal lorsque la loi
            applicable l’exige.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            11. Cookies et technologies similaires
          </h2>
          <p className="mt-2">
            Nous utilisons des cookies et technologies similaires pour assurer le
            fonctionnement de la plateforme, mémoriser certaines préférences,
            sécuriser les accès, mesurer l’audience lorsque cela est autorisé et
            améliorer l’expérience utilisateur.
          </p>
          <p className="mt-2">
            Pour plus d’informations, consultez notre{" "}
            <a
              href="/legal/cookies"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de cookies
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            12. Modifications de la présente Politique
          </h2>
          <p className="mt-2">
            Nous pouvons mettre à jour la présente Politique afin de refléter les
            évolutions légales, techniques, organisationnelles ou liées à nos
            services. En cas de modification importante, nous pourrons vous en
            informer par notification dans l’application, par e-mail ou par tout
            autre moyen approprié.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            13. Contact
          </h2>
          <p className="mt-2">
            Pour toute question relative à la présente Politique :{" "}
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
