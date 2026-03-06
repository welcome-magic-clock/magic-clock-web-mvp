// app/legal/security/page.tsx
// ✅ v2.1 — 6 mars 2026 · support@magic-clock.com
// BackButton géré par app/legal/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sécurité & gestion des incidents – Magic Clock",
};

export default function SecurityPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Sécurité &amp; gestion des incidents
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Résumé des mesures de sécurité mises en œuvre pour protéger les
            données et des principes appliqués en cas d&apos;incident de
            sécurité.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Dernière mise à jour : 6 mars 2026
          </p>
        </div>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Principes généraux
          </h2>
          <p className="mt-2">
            Magic Clock met en œuvre des mesures techniques et
            organisationnelles raisonnables afin de protéger les données
            personnelles, les comptes utilisateurs et les contenus hébergés sur
            la plateforme contre la perte, l&apos;altération, l&apos;accès non
            autorisé, la divulgation ou l&apos;usage abusif.
          </p>
          <p className="mt-2">
            Ces mesures sont définies en tenant compte de la nature des
            données traitées, des risques identifiés, de l&apos;état de la
            technique et des contraintes opérationnelles applicables à la
            plateforme.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Mesures techniques et organisationnelles (résumé)
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>chiffrement des communications via HTTPS/TLS ;</li>
            <li>
              recours à des prestataires d&apos;hébergement, d&apos;infrastructure
              et de sécurité reconnus, notamment pour l&apos;hébergement,
              l&apos;authentification, la diffusion de contenu et la protection
              réseau ;
            </li>
            <li>
              gestion des accès internes selon le principe du moindre privilège ;
            </li>
            <li>
              séparation logique ou organisationnelle des environnements selon
              les besoins de développement, de test et de production ;
            </li>
            <li>
              surveillance technique, journalisation et mesures de détection ou
              d&apos;investigation adaptées ;
            </li>
            <li>
              mise à jour régulière des composants logiciels, correctifs de
              sécurité et actions de maintenance raisonnables ;
            </li>
            <li>
              mesures destinées à limiter les usages abusifs, les accès non
              autorisés et certaines formes de fraude ou de compromission.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Gestion des incidents de sécurité
          </h2>
          <p className="mt-2">
            En cas de suspicion ou de constat d&apos;incident de sécurité
            (par exemple accès non autorisé, compromission de compte, fuite de
            données, vulnérabilité exploitée ou indisponibilité anormale), Magic
            Clock peut notamment mettre en œuvre les actions suivantes :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>détection, qualification et analyse initiale de l&apos;incident ;</li>
            <li>mesures de confinement, de limitation et de remédiation ;</li>
            <li>
              conservation des éléments techniques utiles à l&apos;analyse dans
              la mesure nécessaire ;
            </li>
            <li>
              évaluation des risques pour les utilisateurs, la plateforme et les
              tiers concernés ;
            </li>
            <li>
              notification des personnes concernées et/ou des autorités
              compétentes lorsque cela est requis par le droit applicable.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Que faire si vous suspectez un incident ?
          </h2>
          <p className="mt-2">
            Si vous pensez que votre compte a été compromis, qu&apos;un accès
            non autorisé a eu lieu ou que des données liées à Magic Clock
            pourraient être exposées, nous vous recommandons notamment de :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>changer immédiatement votre mot de passe ;</li>
            <li>
              sécuriser l&apos;accès à votre adresse e-mail et à vos appareils ;
            </li>
            <li>
              utiliser, lorsqu&apos;il est disponible, un mode de connexion ou
              de récupération plus sécurisé ;
            </li>
            <li>nous signaler l&apos;incident sans délai.</li>
          </ul>
          <p className="mt-2">
            Contact sécurité :{" "}
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
