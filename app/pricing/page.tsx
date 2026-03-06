// app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prix & monétisation – Magic Clock",
};

// ─────────────────────────────────────────────────────────────
// Paliers commission progressifs
// ─────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  {
    emoji: "🌱",
    label: "Micro",
    range: "0.99 → 1.99 CHF/€/$",
    platformRate: 35,
    creatorRate: 65,
    note: "Idéal pour découvrir · adapté aux petits prix et aux ventes unitaires",
  },
  {
    emoji: "⭐",
    label: "Standard",
    range: "2.00 → 9.99 CHF/€/$",
    platformRate: 28,
    creatorRate: 72,
    note: "Sweet spot volume · très bon équilibre entre accessibilité et revenu",
    highlight: true,
  },
  {
    emoji: "💎",
    label: "Premium",
    range: "9.99 → 29.99 CHF/€/$",
    platformRate: 22,
    creatorRate: 78,
    note: "Tutoriels, formations et contenus premium à forte valeur",
  },
  {
    emoji: "🏆",
    label: "Expert",
    range: "29.99 → 999.99 CHF/€/$",
    platformRate: 20,
    creatorRate: 80,
    note: "Contenus haute valeur · tu conserves l’essentiel du revenu",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-10 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Prix &amp; monétisation
        </h1>
        <p className="text-sm text-slate-700">
          Magic Clock est <strong>gratuit à l&apos;inscription</strong>. Tu payes
          uniquement les créateurs ou contenus que tu choisis, et si tu es
          créateur, tu peux monétiser ton savoir avec une commission claire et
          progressive.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Mode FREE
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Publier gratuitement, construire sa communauté et partager son
            univers sans obligation de monétiser.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-700">
            <li>• Inscription gratuite</li>
            <li>• Contenus publics accessibles à tous</li>
            <li>• Idéal pour experts, marques, passionnés et projets</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Pour les utilisateurs
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Tu explores, tu suis des créateurs et tu ne payes que ce que tu
            choisis réellement.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-700">
            <li>• Inscription gratuite</li>
            <li>• Beaucoup de contenus en accès libre</li>
            <li>• Abonnements mensuels optionnels</li>
            <li>• Contenus PPV achetés à l&apos;unité</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Pour les créateurs
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Aucun frais fixe. Tu payes seulement quand tu gagnes, avec une
            commission progressive de <strong>20% à 35%</strong> selon le prix.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-700">
            <li>• Compte créateur gratuit</li>
            <li>• Tu fixes tes prix (FREE / SUB / PPV)</li>
            <li>• Tu gardes <strong>65% à 80%</strong> de tes revenus</li>
            <li>• Versements selon les modalités disponibles sur la plateforme</li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">
          Commission progressive · Le principe &quot;tu payes si tu gagnes&quot;
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Magic Clock applique une commission <strong>progressive et transparente</strong>{" "}
          sur chaque vente. Les frais de paiement, taxes applicables et
          commissions sont présentés de manière lisible dans l’expérience de
          paiement et dans le Cockpit Monétisation. Plus ton contenu est cher,
          plus tu gardes.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.label}
              className={`rounded-2xl border p-4 ${
                tier.highlight
                  ? "border-emerald-300 bg-emerald-50/80 shadow-sm"
                  : "border-slate-200 bg-white/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{tier.emoji}</span>
                <span className="text-sm font-semibold text-slate-800">
                  {tier.label}
                </span>
                {tier.highlight && (
                  <span className="ml-auto rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] text-white">
                    Populaire
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] font-medium text-slate-500">
                {tier.range}
              </p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Tu gardes</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {tier.creatorRate}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Commission MC</p>
                  <p className="text-base font-semibold text-slate-500">
                    {tier.platformRate}%
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[10px] leading-snug text-slate-400">
                {tier.note}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-xs text-slate-700">
          <p className="font-medium text-indigo-700">
            💡 Taxes, TVA et frais de paiement
          </p>
          <p className="mt-1">
            Selon le pays de l’acheteur, le type de contenu, le moyen de
            paiement et le statut du créateur, des taxes et frais de paiement
            peuvent s’appliquer. Le détail affiché au moment du paiement et dans
            le Cockpit Monétisation fait foi.
          </p>
          <p className="mt-1 text-slate-500">
            Magic Clock peut appliquer des mécanismes fiscaux et de répartition
            spécifiques selon les pays activés et la configuration juridique et
            technique en vigueur.
          </p>
        </div>

        <p className="mt-3 text-center text-xs text-slate-500">
          Simule tes revenus en temps réel dans ton{" "}
          <Link
            href="/monet"
            className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
          >
            Cockpit Monétisation →
          </Link>
        </p>
      </section>

      <section className="mt-12 space-y-12 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Pour les utilisateurs (abonnés &amp; contenus PPV)
          </h2>

          <h3 className="mt-4 text-base font-semibold text-slate-900">
            1.1 Magic Clock, combien ça coûte pour moi ?
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Inscription :</strong> gratuite.
            </li>
            <li>
              <strong>Contenus gratuits :</strong> beaucoup de créateurs
              proposent déjà des contenus en accès libre.
            </li>
            <li>
              <strong>Abonnements mensuels :</strong> tu peux soutenir un
              créateur avec un abonnement mensuel. Le prix est fixé par chaque
              créateur dans la <strong>devise d&apos;achat</strong>.
            </li>
            <li>
              <strong>Contenus PPV (« Pay-Per-View ») :</strong> certains
              contenus premium peuvent être achetés à l&apos;unité. Le prix est
              clairement affiché avant tout paiement.
            </li>
          </ul>

          <p className="mt-3">
            Tu peux gérer ou interrompre tes achats et abonnements selon les
            fonctionnalités disponibles dans ton espace Magic Clock.
          </p>
          <p className="mt-1">
            Les paiements passent par notre prestataire sécurisé{" "}
            <strong>Stripe</strong>, selon les moyens de paiement disponibles
            dans ton pays et activés sur la plateforme, par exemple cartes
            bancaires, TWINT, SEPA et autres moyens compatibles.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Les montants sont facturés dans ta <strong>devise d&apos;achat</strong>,
            selon ton pays, le contenu acheté et le moyen de paiement utilisé.
            Le détail applicable, y compris les taxes éventuelles, est affiché
            avant validation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Pour les créateurs
          </h2>

          <h3 className="mt-4 text-base font-semibold text-slate-900">
            2.1 Pas de frais fixes, tu payes seulement quand tu gagnes
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Ouverture de compte créateur :</strong> gratuite.
            </li>
            <li>
              <strong>Pas d&apos;abonnement obligatoire</strong> pour publier.
            </li>
            <li>
              La plateforme se rémunère via une{" "}
              <strong>commission sur chaque vente</strong> (abonnements + PPV).
            </li>
            <li>
              Tu gardes la <strong>majeure partie de tes revenus</strong>,
              entre 65% et 80% selon le prix de ton contenu.
            </li>
            <li>
              La commission est <strong>progressive et transparente</strong>.
              Les frais de paiement, taxes applicables et commissions sont
              présentés de manière lisible dans l’interface.
            </li>
          </ul>

          <h3 className="mt-6 text-base font-semibold text-slate-900">
            2.2 Tu choisis tes prix
          </h3>
          <p className="mt-2">
            Sur Magic Clock, c&apos;est <strong>toi</strong> qui fixes tes
            tarifs dans les limites techniques de la plateforme. Les prix
            peuvent aller de <strong>0,99 à 999,99</strong>, dans la{" "}
            <strong>devise d&apos;achat</strong> disponible.
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Abonnements :</strong>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>niveau gratuit possible ;</li>
                <li>
                  ou prix mensuel entre <strong>0,99 et 999,99</strong> dans la{" "}
                  <strong>devise d&apos;achat</strong>.
                </li>
              </ul>
            </li>
            <li className="mt-2">
              <strong>Contenus PPV :</strong>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>chaque contenu peut être vendu à l&apos;unité ;</li>
                <li>
                  tu définis le prix de chaque vidéo, cours ou masterclass dans
                  la même plage (<strong>0,99 → 999,99</strong>) dans la{" "}
                  <strong>devise d&apos;achat</strong>.
                </li>
              </ul>
            </li>
          </ul>
          <p className="mt-3">
            Tu peux ajuster tes prix à l’avenir selon les outils disponibles sur
            la plateforme.
          </p>

          <h3 className="mt-6 text-base font-semibold text-slate-900">
            2.3 Versements créateurs
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Fréquence :</strong> les versements sont effectués selon
              les modalités de paiement et de règlement actives sur la
              plateforme.
            </li>
            <li>
              <strong>Ce qui est versé :</strong> tes revenus nets après
              déduction de la commission Magic Clock, des taxes applicables,
              des frais de paiement et, le cas échéant, des remboursements ou
              ajustements.
            </li>
            <li>
              <strong>Seuil minimum :</strong> un seuil de versement peut
              s’appliquer selon la devise, le pays ou le moyen de paiement.
            </li>
            <li>
              <strong>Devise :</strong> elle dépend du pays, du compte de
              paiement connecté et des options activées sur la plateforme.
            </li>
            <li>
              <strong>KYC :</strong> un processus de vérification d&apos;identité
              (Know Your Customer) peut être requis via Stripe avant
              l’activation complète des paiements ou des versements,
              conformément aux règles de conformité applicables.
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Les détails sont disponibles dans ton{" "}
            <Link
              href="/monet"
              className="font-medium text-indigo-600 underline underline-offset-2"
            >
              Cockpit Monétisation
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. FREE, abonnements &amp; PPV : trois façons de créer de la valeur
          </h2>

          <h3 className="mt-4 text-base font-semibold text-slate-900">
            3.1 Mode FREE : partager sans monétiser
          </h3>
          <p className="mt-2">
            Le mode <strong>FREE</strong> permet à un expert, une marque, un
            passionné ou une personne qui souhaite simplement transmettre son
            savoir de publier des contenus en accès libre, sans obligation de
            faire payer son public.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.2 Abonnements : créer un cercle privilégié
          </h3>
          <p className="mt-2">
            Avec les <strong>abonnements</strong>, tu proposes un niveau
            supplémentaire : contenus réservés, accès prioritaire, coulisses,
            échanges plus personnels ou séries pédagogiques complètes.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.3 PPV (« Pay-Per-View ») : valoriser les contenus premium
          </h3>
          <p className="mt-2">
            Le <strong>PPV</strong> est idéal pour des contenus à forte valeur :
            masterclass, tutoriels avancés, transformations exceptionnelles ou
            formats événementiels. L&apos;utilisateur paye une fois pour
            débloquer ce contenu précis.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.4 Une plateforme UGC qui met l&apos;humain au centre
          </h3>
          <p className="mt-2">
            Magic Clock est pensée comme une plateforme UGC où chacun peut
            trouver sa place : expert, marque, passionné ou débutant curieux.
            La valeur ne se mesure pas seulement en argent, mais aussi en{" "}
            <strong>visibilité, inspiration, impact et transmission</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Paiements &amp; sécurité
          </h2>
          <p className="mt-2">
            Les paiements Magic Clock sont traités via <strong>Stripe</strong>,
            notre prestataire de paiement, dans le cadre des pays, devises,
            moyens de paiement et fonctionnalités activés sur la plateforme.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Méthodes acceptées :</strong> elles varient selon le pays,
              la devise, le contenu et la configuration active de la plateforme.
            </li>
            <li>
              <strong>Sécurité :</strong> les paiements sont traités via une
              infrastructure sécurisée du prestataire ; Magic Clock ne stocke
              pas les numéros complets de carte bancaire.
            </li>
            <li>
              <strong>Répartition des fonds :</strong> selon la configuration
              active de la plateforme, une partie du paiement peut être
              attribuée au créateur et une partie à Magic Clock au titre de sa
              commission.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Transparence
          </h2>
          <p className="mt-2">
            Notre principe est simple :{" "}
            <strong>pas de surprise, pas de frais cachés</strong>. L’utilisateur
            comme le créateur doivent pouvoir comprendre ce qu’ils payent, ce
            qu’ils gagnent et selon quelles règles la transaction est traitée.
          </p>

          <p className="mt-6 text-sm font-semibold text-slate-900">
            Magic Clock, It&apos;s time to smile.
          </p>
        </section>
      </section>
    </main>
  );
}
