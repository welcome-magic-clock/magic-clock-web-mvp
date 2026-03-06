// app/legal/cgu/page.tsx
// ✅ v2.0 — Date 6 mars 2026 · Magic Clock Maldonado-Verger RI · support@magic-clock.com
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
          Dernière mise à jour : 6 mars 2026
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
            plateforme Magic Clock, vous reconnaissez avoir lu, compris et
            accepté les présentes CGU. Si vous n&apos;acceptez pas ces CGU,
            vous ne devez pas utiliser la plateforme.
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
              de publier et partager des contenus visuels et pédagogiques
              (photos, vidéos, avant/après, Magic Clock Display, etc.) ;
            </li>
            <li>
              de présenter des méthodes, tutoriels et retours d&apos;expérience
              dans <strong>différents domaines d&apos;activité</strong> ;
            </li>
            <li>
              de monétiser certains contenus via des options gratuites,
              d&apos;abonnement ou de paiement à la séance (PPV) ;
            </li>
            <li>
              d&apos;échanger avec d&apos;autres membres via des
              fonctionnalités sociales.
            </li>
          </ul>
          <p className="mt-2">
            Les contenus pédagogiques ont pour objectif de partager une{" "}
            <strong>méthodologie ou une expérience</strong>. Ils ne constituent
            en aucun cas une <strong>garantie de résultat</strong>.
          </p>
        </section>

        {/* 3. Création de compte */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Création de compte et éligibilité
          </h2>
          <p className="mt-2">
            Pour accéder à certaines fonctionnalités, vous devez créer un
            compte Magic Clock et fournir des informations exactes, complètes
            et à jour.
          </p>
          <p className="mt-2">
            L&apos;accès à la plateforme est réservé aux personnes majeures
            selon la législation applicable, ou aux mineurs disposant de
            l&apos;autorisation de leur représentant légal.
          </p>
          <p className="mt-2">
            Les contenus impliquant des <strong>mineurs</strong> ne peuvent
            être publiés que dans le respect strict du droit applicable, avec
            l&apos;autorisation nécessaire des représentants légaux.
          </p>
        </section>

        {/* 4. Utilisation acceptable */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Utilisation acceptable de la plateforme
          </h2>
          <p className="mt-2">
            Il est notamment interdit&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              de publier des contenus illicites, discriminatoires, haineux,
              violents ou diffamatoires ;
            </li>
            <li>
              de publier des contenus violant les droits de propriété
              intellectuelle ou les droits à l&apos;image de tiers ;
            </li>
            <li>
              d&apos;utiliser la plateforme pour spammer, harceler ou nuire à
              d&apos;autres utilisateurs ;
            </li>
            <li>
              de contourner les mesures techniques de protection ou de tenter
              d&apos;accéder aux données d&apos;autrui.
            </li>
          </ul>
        </section>

        {/* 5. UGC */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Contenus générés par les utilisateurs (UGC)
          </h2>
          <p className="mt-2">
            Vous restez titulaire des droits attachés aux contenus que vous
            créez. En publiant, vous accordez à Magic Clock une licence non
            exclusive, mondiale et libre de redevance pour héberger, stocker,
            reproduire, représenter et distribuer ce contenu dans le cadre de
            la Plateforme.
          </p>
        </section>

        {/* 6. PI Magic Clock */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Propriété intellectuelle de Magic Clock
          </h2>
          <p className="mt-2">
            L&apos;ensemble des éléments composant la Plateforme (charte
            graphique, logos, marque, interfaces, fonctionnalités logicielles,
            etc.) est protégé par les droits de propriété intellectuelle et
            demeure la propriété exclusive de{" "}
            <strong>Magic Clock Maldonado-Verger RI</strong>.
          </p>
        </section>

        {/* 7. Liens */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Liens externes
          </h2>
          <p className="mt-2">
            La plateforme peut contenir des liens vers des sites ou services
            tiers. Magic Clock ne contrôle pas ces ressources et n&apos;assume
            aucune responsabilité quant à leur contenu.
          </p>
        </section>

        {/* 8. Suspension / résiliation */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Suspension et résiliation de compte
          </h2>
          <p className="mt-2">
            Magic Clock se réserve le droit de suspendre ou de résilier
            l&apos;accès de tout utilisateur qui ne respecterait pas les
            présentes CGU ou la législation applicable.
          </p>
        </section>

        {/* 9. Responsabilité */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Responsabilité et absence de garantie
          </h2>
          <p className="mt-2">
            Magic Clock met en œuvre les moyens raisonnables pour assurer un
            fonctionnement sécurisé, mais ne peut garantir une disponibilité
            permanente. Dans la limite autorisée par le droit applicable, Magic
            Clock ne saurait être tenue responsable des dommages indirects
            résultant de l&apos;utilisation de la plateforme.
          </p>
        </section>

        {/* 10. Données perso */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            10. Données personnelles, cookies et sécurité
          </h2>
          <p className="mt-2">
            Le traitement de vos données est régi par notre{" "}
            <a
              href="/legal/privacy"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Politique de confidentialité
            </a>
            . L&apos;utilisation des cookies est détaillée dans notre{" "}
            <a
              href="/legal/cookies"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Politique de cookies
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
            Magic Clock peut adapter les présentes CGU. La date de dernière
            mise à jour sera indiquée en tête de document. En cas de
            modification substantielle, les utilisateurs pourront être informés
            par notification sur la plateforme ou par e-mail.
          </p>
        </section>

        {/* 12. Droit applicable */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            12. Droit applicable et juridiction compétente
          </h2>
          <p className="mt-2">
            Les présentes CGU sont soumises au <strong>droit suisse</strong>.
            Tout litige sera soumis aux tribunaux compétents du siège de Magic
            Clock Maldonado-Verger RI à Neuchâtel.
          </p>
        </section>

        {/* 13. Contact */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            13. Contact et signalements
          </h2>
          <p className="mt-2">
            Pour toute question sur les présentes CGU ou pour signaler un
            contenu :{" "}
            <a
              href="mailto:support@magic-clock.com"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              support@magic-clock.com
            </a>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Les informations relatives à l&apos;éditeur figurent sur la page{" "}
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
