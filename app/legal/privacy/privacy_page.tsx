// app/legal/privacy/page.tsx
// ✅ v2.0 — Date 6 mars 2026 · Magic Clock Maldonado-Verger RI · support@magic-clock.com
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
          Plateforme Magic Clock – Dernière mise à jour : 6 mars 2026
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
            <strong>Magic Clock Maldonado-Verger RI</strong>, entreprise
            individuelle de droit suisse dont le siège est situé à{" "}
            <strong>Rue des Saars 6, 2000 Neuchâtel – Suisse</strong>{" "}
            (ci-après <strong>« Magic Clock »</strong>,{" "}
            <strong>« nous »</strong>), traite les données personnelles des
            utilisateurs de la plateforme <strong>Magic Clock</strong>.
          </p>
          <p className="mt-2">
            Magic Clock agit en qualité de{" "}
            <strong>responsable du traitement</strong> au sens :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>du droit suisse (LPD) pour les utilisateurs en Suisse ;</li>
            <li>
              du Règlement (UE) 2016/679 (RGPD) pour les utilisateurs dans
              l'UE/EEE ;
            </li>
            <li>
              du UK GDPR et du Data Protection Act 2018 pour les utilisateurs
              au Royaume-Uni ;
            </li>
            <li>
              des lois fédérales ou étatiques applicables pour les utilisateurs
              aux États-Unis (par ex. CCPA/CPRA en Californie).
            </li>
          </ul>
        </section>

        {/* 2. Données collectées */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Données personnelles que nous collectons
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Données d'identification</strong> : nom d'utilisateur,
              photo de profil, identifiants de compte, préférences de langue.
            </li>
            <li>
              <strong>Coordonnées</strong> : adresse e-mail, pays, ville.
            </li>
            <li>
              <strong>Données de contenu</strong> : photos, vidéos, contenus
              Magic Studio, Magic Display, commentaires, messages.
            </li>
            <li>
              <strong>Données de transaction</strong> : historique des achats,
              abonnements, contenus PPV. Les données complètes de carte
              bancaire sont traitées par Stripe et ne sont pas stockées par
              Magic Clock.
            </li>
            <li>
              <strong>Données techniques & de navigation</strong> : adresse IP,
              type de navigateur, identifiant de l'appareil, pages consultées,
              identifiants de cookies.
            </li>
            <li>
              <strong>Données de support</strong> : contenu des demandes
              adressées au support, échanges par e-mail.
            </li>
          </ul>
        </section>

        {/* 3. Finalités */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Finalités du traitement et bases légales
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Fourniture de la Plateforme</strong> : création et
              gestion du compte, accès au contenu, messagerie, interactions
              sociales.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat.
              </span>
            </li>
            <li>
              <strong>Monétisation et paiements</strong> : gestion des
              abonnements, contenus PPV, reversement aux créateurs, facturation.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat, obligations légales.
              </span>
            </li>
            <li>
              <strong>Modération et sécurité</strong> : détection de contenus
              illicites, lutte contre le spam.
              <br />
              <span className="text-slate-500">
                Base légale : intérêt légitime.
              </span>
            </li>
            <li>
              <strong>Amélioration des Services</strong> : analyse agrégée,
              mesure de performance, correctifs.
              <br />
              <span className="text-slate-500">
                Base légale : intérêt légitime.
              </span>
            </li>
            <li>
              <strong>Communication et support</strong> : réponses aux
              demandes, notifications techniques.
              <br />
              <span className="text-slate-500">
                Base légale : exécution du contrat, intérêt légitime.
              </span>
            </li>
            <li>
              <strong>Respect des obligations légales</strong> : obligations
              comptables, fiscales, réponses aux autorités.
              <br />
              <span className="text-slate-500">
                Base légale : obligations légales.
              </span>
            </li>
          </ul>
        </section>

        {/* 4. Durée de conservation */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Durée de conservation
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Données de compte</strong> : pendant la durée
              d'utilisation, puis une période limitée après fermeture.
            </li>
            <li>
              <strong>Données de transaction</strong> : durée requise par la
              législation comptable et fiscale applicable.
            </li>
            <li>
              <strong>Logs techniques</strong> : quelques mois, sauf incident
              nécessitant une conservation plus longue.
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
              <strong>Prestataires techniques</strong> : hébergement, envoi
              d'e-mails, traitement des paiements, support technique (voir
              section 6 pour la liste complète).
            </li>
            <li>
              <strong>Autorités et organismes publics</strong> : lorsque la loi
              l'exige ou pour défendre nos droits.
            </li>
            <li>
              <strong>Autres utilisateurs</strong> : dans la mesure où vos
              contenus et informations de profil sont publics par nature.
            </li>
          </ul>
          <p className="mt-2">
            Nous ne vendons pas vos données personnelles.
          </p>
        </section>

        {/* 6. Prestataires techniques */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Prestataires techniques principaux
          </h2>
          <p className="mt-2">
            La Plateforme repose sur les prestataires suivants, qui sont
            susceptibles de traiter vos données dans le cadre de leur service :
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Supabase</strong> — base de données, authentification et
              stockage des données utilisateurs (serveurs pouvant être situés
              dans l'UE ou aux États-Unis).
            </li>
            <li>
              <strong>Cloudflare</strong> — réseau de diffusion de contenu
              (CDN), stockage de médias (R2) et protection des accès.
            </li>
            <li>
              <strong>Vercel</strong> — hébergement et déploiement de
              l'application web (serveurs pouvant être situés dans l'UE ou aux
              États-Unis).
            </li>
            <li>
              <strong>Stripe</strong> — traitement des paiements. Les données
              de carte bancaire sont gérées exclusivement par Stripe et ne
              transitent pas par les serveurs Magic Clock.
            </li>
            <li>
              <strong>GitHub</strong> — hébergement du code source et gestion
              des versions (infrastructure de développement uniquement, pas de
              données utilisateurs).
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Chacun de ces prestataires dispose de sa propre politique de
            confidentialité. Nous veillons à ce que des garanties contractuelles
            appropriées (clauses types, décisions d'adéquation) encadrent les
            transferts de données vers des pays tiers.
          </p>
        </section>

        {/* 7. Transferts internationaux */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Transferts internationaux de données
          </h2>
          <p className="mt-2">
            Certains prestataires peuvent être situés en dehors de la Suisse,
            de l'UE/EEE ou du Royaume-Uni. Dans ce cas, nous veillons à ce que
            des <strong>garanties appropriées</strong> soient mises en place
            (décisions d'adéquation, clauses contractuelles types, etc.).
          </p>
        </section>

        {/* 8. Vos droits */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Vos droits
          </h2>
          <p className="mt-2">
            Selon votre lieu de résidence, vous pouvez disposer notamment des
            droits suivants : accès, rectification, effacement, limitation,
            opposition, portabilité, retrait du consentement et réclamation
            auprès d'une autorité de contrôle.
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
        </section>

        {/* 9. Sécurité */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Sécurité des données
          </h2>
          <p className="mt-2">
            Nous mettons en œuvre des mesures techniques et organisationnelles
            raisonnables pour protéger vos données (HTTPS/TLS, contrôles
            d'accès, séparation des environnements). Aucun système n'étant
            totalement sécurisé, nous vous invitons à choisir un mot de passe
            robuste et à nous signaler sans délai toute suspicion de
            compromission.
          </p>
        </section>

        {/* 10. Mineurs */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            10. Utilisation par des mineurs
          </h2>
          <p className="mt-2">
            La Plateforme n'est pas destinée aux enfants en dessous de l'âge
            minimum indiqué dans nos CGU/CGV. Certaines fonctionnalités peuvent
            nécessiter le consentement d'un représentant légal.
          </p>
        </section>

        {/* 11. Cookies */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            11. Cookies et technologies similaires
          </h2>
          <p className="mt-2">
            Pour plus d'informations, consultez notre{" "}
            <a
              href="/legal/cookies"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de cookies
            </a>
            .
          </p>
        </section>

        {/* 12. Modifications */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            12. Modifications de la présente Politique
          </h2>
          <p className="mt-2">
            Nous pouvons mettre à jour la présente Politique. En cas de
            modification importante, nous vous en informerons par notification
            dans l'app ou par e-mail.
          </p>
        </section>

        {/* 13. Contact */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            13. Contact
          </h2>
          <p className="mt-2">
            Pour toute question :{" "}
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
