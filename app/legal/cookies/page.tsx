// app/legal/cookies/page.tsx

export const metadata = {
  title: "Politique de cookies – Magic Clock",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Politique de cookies
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Plateforme Magic Clock – Dernière mise à jour : 26 novembre 2025
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* 1. Intro */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. À propos de cette Politique
          </h2>
          <p className="mt-2">
            La présente politique de cookies (ci-après la{" "}
            <strong>« Politique de cookies »</strong>) explique comment{" "}
            <strong>[Magic Clock SA]</strong> utilise des cookies et
            technologies similaires (tags, pixels, SDK, stockage local, etc.)
            sur la Plateforme <strong>Magic Clock</strong> et ses versions web
            et mobiles.
          </p>
          <p className="mt-2">
            Elle doit être lue conjointement avec notre{" "}
            <a
              href="/legal/privacy"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de confidentialité
            </a>
            .
          </p>
        </section>

        {/* 2. Qu'est-ce qu'un cookie */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Qu’est-ce qu’un cookie ?
          </h2>
          <p className="mt-2">
            Un <strong>cookie</strong> est un petit fichier texte enregistré sur
            votre appareil (ordinateur, smartphone, tablette) lorsque vous
            consultez un site web ou utilisez une application. Il permet
            notamment de reconnaître votre appareil, de mémoriser vos
            préférences et d’améliorer votre expérience.
          </p>
          <p className="mt-2">
            D’autres technologies peuvent avoir un fonctionnement similaire
            (par ex. pixels invisibles, identifiants d’appareil, stockage local
            dans votre navigateur). Nous les regroupons sous le terme{" "}
            <strong>« cookies »</strong> dans la présente Politique.
          </p>
        </section>

        {/* 3. Types de cookies */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Types de cookies utilisés
          </h2>
          <p className="mt-2">
            Nous utilisons différents types de cookies sur la Plateforme :
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>Cookies strictement nécessaires</strong> : indispensables
              au fonctionnement de la Plateforme (connexion au compte,
              sécurité, gestion des sessions, choix de langue, préférences de
              base). Sans ces cookies, certains services ne peuvent pas
              fonctionner correctement.
            </li>
            <li>
              <strong>Cookies de performance et de statistiques</strong> :
              permettent de mesurer l’audience, comprendre comment la Plateforme
              est utilisée, détecter d’éventuelles erreurs et améliorer nos
              Services. Les données sont généralement agrégées et ne servent pas
              à vous identifier directement.
            </li>
            <li>
              <strong>Cookies de fonctionnalité</strong> : peuvent être utilisés
              pour mémoriser certaines préférences (par ex. mode sombre,
              langue, filtres, paramètres de lecture vidéo).
            </li>
            <li>
              <strong>Cookies de marketing / suivi</strong> (facultatifs) :
              utilisés pour personnaliser certaines communications ou mesurer
              l’impact de campagnes promotionnelles. Ils ne sont activés que
              si la législation applicable le permet, et après votre
              consentement lorsqu’il est requis.
            </li>
          </ul>
        </section>

        {/* 4. Cookies de tiers */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Cookies de tiers
          </h2>
          <p className="mt-2">
            Certains cookies sont déposés par des services tiers intégrés à la
            Plateforme, par exemple :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>prestataire d’hébergement ou de diffusion vidéo ;</li>
            <li>outils de mesure d’audience ;</li>
            <li>
              prestataire de paiement (pour sécuriser la session ou lutter
              contre la fraude) ;
            </li>
            <li>
              services de support ou de communication embarqués, le cas
              échéant.
            </li>
          </ul>
          <p className="mt-2">
            L’utilisation de ces cookies est soumise aux politiques de
            confidentialité des tiers concernés, que nous vous recommandons de
            consulter.
          </p>
        </section>

        {/* 5. Durée de vie */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Durée de vie des cookies
          </h2>
          <p className="mt-2">
            Les cookies peuvent être :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>cookies de session</strong> : supprimés automatiquement
              lorsque vous fermez votre navigateur ou l’application ;
            </li>
            <li>
              <strong>cookies persistants</strong> : conservés pendant une
              durée limitée après votre visite, afin de reconnaître votre
              appareil lors d’une prochaine connexion.
            </li>
          </ul>
          <p className="mt-2">
            Les durées de conservation exactes peuvent varier en fonction du
            cookie (généralement de quelques minutes à 12 mois pour les cookies
            non essentiels).
          </p>
        </section>

        {/* 6. Gestion des cookies */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Comment gérer vos cookies ?
          </h2>
          <p className="mt-2">
            Lors de votre première visite, une bannière ou une interface
            dédiée vous permet de{" "}
            <strong>accepter, refuser ou personnaliser</strong> l’utilisation de
            certains cookies, conformément au droit applicable.
          </p>
          <p className="mt-2">
            Vous pouvez à tout moment modifier vos choix en accédant au module{" "}
            <strong>« Préférences cookies »</strong> (lien disponible dans le
            pied de page ou dans les paramètres de votre compte, dès qu’il sera
            activé dans la version définitive de la Plateforme).
          </p>
          <p className="mt-2">
            Vous pouvez également configurer votre navigateur pour bloquer ou
            supprimer les cookies. Toutefois, le blocage des cookies
            strictement nécessaires peut affecter le fonctionnement de la
            Plateforme.
          </p>
        </section>

        {/* 7. Droits et vie privée */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            7. Cookies et données personnelles
          </h2>
          <p className="mt-2">
            Lorsque les cookies permettent d’identifier directement ou
            indirectement une personne physique, les informations collectées
            sont traitées comme des{" "}
            <strong>données personnelles</strong> et sont soumises à notre{" "}
            <a
              href="/legal/privacy"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de confidentialité
            </a>
            .
          </p>
          <p className="mt-2">
            Vous disposez, selon la législation applicable, de droits
            d’accès, de rectification, d’effacement, de limitation, d’opposition
            et de portabilité, ainsi que du droit de retirer votre consentement
            lorsque celui-ci constitue la base légale du traitement.
          </p>
        </section>

        {/* 8. Mise à jour */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            8. Mise à jour de la présente Politique de cookies
          </h2>
          <p className="mt-2">
            Nous pouvons mettre à jour la présente Politique de cookies pour
            refléter les changements intervenus dans nos pratiques ou pour
            respecter de nouvelles exigences légales. La date de dernière mise à
            jour figure en haut de page.
          </p>
        </section>

        {/* 9. Contact */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            9. Contact
          </h2>
          <p className="mt-2">
            Pour toute question relative à l’utilisation des cookies ou à vos
            choix, vous pouvez nous écrire à :{" "}
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
