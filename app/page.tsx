// app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prix & monétisation – Magic Clock",
};

// ─────────────────────────────────────────────────────────────
// Paliers commission progressifs (sync avec monet-helpers.tsx)
// ─────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  {
    emoji: "🌱",
    label: "Micro",
    range: "0.99 → 1.99 CHF/€/$",
    platformRate: 35,
    creatorRate: 65,
    note: "Idéal pour découvrir · commission absorbe les frais fixes bancaires",
  },
  {
    emoji: "⭐",
    label: "Standard",
    range: "2.00 → 9.99 CHF/€/$",
    platformRate: 28,
    creatorRate: 72,
    note: "Sweet spot volume · meilleur ratio pour contenus réguliers",
    highlight: true,
  },
  {
    emoji: "💎",
    label: "Premium",
    range: "9.99 → 29.99 CHF/€/$",
    platformRate: 22,
    creatorRate: 78,
    note: "Tutoriels & masterclass · très attractif",
  },
  {
    emoji: "🏆",
    label: "Expert",
    range: "29.99 → 999.99 CHF/€/$",
    platformRate: 20,
    creatorRate: 80,
    note: "Contenus haute valeur · tu gardes l'essentiel",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="mb-10 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Prix &amp; monétisation
        </h1>
        <p className="text-sm text-slate-700">
          Magic Clock est <strong>gratuit à l&apos;inscription</strong>. Tu payes
          seulement les créateurs que tu choisis… ou tu monétises ton savoir si
          tu es créateur.
        </p>
        <p className="text-xs text-slate-500">
          Version bêta – certaines fonctionnalités (pays, moyens de paiement,
          types de contenus) peuvent être activées progressivement.
        </p>
      </header>

      {/* CARTES DE SYNTHÈSE */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* Carte FREE */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Mode FREE
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Publier gratuitement, construire sa communauté, sans obligation de
            monétiser.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-700">
            <li>• Inscription gratuite</li>
            <li>• Contenus publics accessibles à tous</li>
            <li>• Idéal pour marques, passionnés, experts, projets</li>
          </ul>
        </div>

        {/* Carte UTILISATEURS */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Pour les utilisateurs
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Tu explores, tu suis des créateurs, tu ne payes que ce que tu
            choisis.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-700">
            <li>• Inscription gratuite</li>
            <li>• Beaucoup de contenus en accès libre</li>
            <li>• Abonnements mensuels optionnels</li>
            <li>• Contenus PPV achetés à l&apos;unité</li>
          </ul>
        </div>

        {/* Carte CRÉATEURS */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Pour les créateurs
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Aucun frais fixe. Tu payes seulement quand tu gagnes — commission
            progressive de <strong>20% à 35%</strong> selon le prix.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-700">
            <li>• Compte créateur gratuit</li>
            <li>• Tu fixes tes prix (FREE / SUB / PPV)</li>
            <li>• Tu gardes <strong>65% à 80%</strong> de tes revenus</li>
            <li>• Versement mensuel le 15 via virement SEPA</li>
          </ul>
        </div>
      </section>

      {/* ── NOUVELLE SECTION : Commission progressive ── */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">
          Commission progressive · Le principe &quot;tu payes si tu gagnes&quot;
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Magic Clock applique une commission <strong>unique tout compris</strong>{" "}
          sur chaque vente — elle inclut les frais bancaires (Adyen) et la TVA
          applicable. Aucune ligne de frais cachée. Plus ton contenu est cher,
          plus tu gardes.
        </p>

        {/* Grille des 4 paliers */}
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

        {/* Note TVA */}
        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-xs text-slate-700">
          <p className="font-medium text-indigo-700">
            💡 TVA incluse dans la commission
          </p>
          <p className="mt-1">
            Magic Clock collecte et reverse la TVA pour toi (8.1% en Suisse,
            20% en France, etc.). Tu n&apos;as rien à gérer — le montant que tu
            vois dans ton Cockpit Monétisation est déjà net de TVA.
          </p>
          <p className="mt-1 text-slate-500">
            Magic Clock est enregistrée auprès du guichet OSS Europe pour les
            ventes digitales transfrontalières.
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

      {/* CONTENU DÉTAILLÉ */}
      <section className="mt-12 space-y-12 text-sm leading-relaxed text-slate-700">

        {/* 1. POUR LES UTILISATEURS */}
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
              proposent déjà des posts en accès libre.
            </li>
            <li>
              <strong>Abonnements mensuels :</strong> tu peux soutenir un
              créateur avec un abonnement mensuel. Le prix est fixé par chaque
              créateur (par exemple 4,99 ou 9,99 par mois, dans ta{" "}
              <strong>devise d&apos;achat</strong>).
            </li>
            <li>
              <strong>Contenus PPV (« Pay-Per-View ») :</strong> certains
              contenus spéciaux (masterclass, tutoriel premium, transformation
              exceptionnelle…) peuvent être achetés à l&apos;unité. Le prix est
              clairement affiché avant tout paiement.
            </li>
          </ul>

          <p className="mt-3">
            Tu peux te désabonner à tout moment depuis ton espace Magic Clock.
          </p>
          <p className="mt-1">
            Les paiements passent par notre prestataire sécurisé{" "}
            <strong>Adyen</strong>, l&apos;un des leaders mondiaux du paiement
            en ligne, selon les moyens de paiement disponibles dans ton pays
            (cartes bancaires, TWINT, iDEAL, Bancontact, et plus de 250 autres
            méthodes locales).
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Les montants sont toujours facturés dans ta{" "}
            <strong>devise d&apos;achat</strong> (par exemple CHF, EUR ou USD),
            en fonction de ton pays et du moyen de paiement utilisé. Le détail
            (montant exact, taxes éventuelles) est affiché avant validation.
          </p>
        </section>

        {/* 2. POUR LES CRÉATEURS */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Pour les créateurs
          </h2>

          {/* 2.1 Pas de frais fixes */}
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
              Tu gardes la <strong>majeure partie de tes revenus</strong> —
              entre 65% et 80% selon le prix de ton contenu.
            </li>
            <li>
              La commission est{" "}
              <strong>progressive et tout compris</strong> : elle inclut les
              frais bancaires Adyen et la TVA. Pas de surprise, pas de ligne
              cachée.
            </li>
          </ul>

          {/* 2.2 Tu choisis tes prix */}
          <h3 className="mt-6 text-base font-semibold text-slate-900">
            2.2 Tu choisis tes prix
          </h3>
          <p className="mt-2">
            Sur Magic Clock, c&apos;est <strong>toi</strong> qui fixes tes
            tarifs dans les limites techniques de la plateforme. Les prix
            peuvent aller de <strong>0,99 à 999,99</strong>, toujours dans la{" "}
            <strong>devise d&apos;achat</strong> (CHF, EUR ou USD).
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Abonnements :</strong>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>niveau &quot;gratuit&quot; possible ;</li>
                <li>
                  ou prix mensuel entre <strong>0,99 et 999,99</strong>, dans
                  la <strong>devise d&apos;achat</strong>.
                </li>
              </ul>
            </li>
            <li className="mt-2">
              <strong>Contenus PPV :</strong>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>chaque contenu peut être vendu à l&apos;unité ;</li>
                <li>
                  tu définis le prix de chaque vidéo / cours / masterclass dans
                  la même plage (<strong>0,99 → 999,99</strong> dans la{" "}
                  <strong>devise d&apos;achat</strong>).
                </li>
              </ul>
            </li>
          </ul>
          <p className="mt-3">
            Tu peux modifier tes prix à l&apos;avenir, sans frais de changement.
          </p>

          {/* 2.3 Versements créateurs */}
          <h3 className="mt-6 text-base font-semibold text-slate-900">
            2.3 Versements créateurs
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Fréquence :</strong> un versement par mois, le{" "}
              <strong>15 du mois</strong> via virement SEPA.
            </li>
            <li>
              <strong>Ce qui est versé :</strong> tes revenus nets (revenus
              bruts – TVA applicable – commission Magic Clock tout compris).
            </li>
            <li>
              <strong>Seuil minimum :</strong> 50 CHF ou 50 EUR. En dessous, le
              solde est reporté sur le mois suivant.
            </li>
            <li>
              <strong>Devise :</strong> CHF ou EUR selon ton pays.{" "}
              <span className="text-xs text-slate-500">
                D&apos;autres devises pourront être ajoutées.
              </span>
            </li>
            <li>
              <strong>KYC :</strong> un processus de vérification d&apos;identité
              (Know Your Customer) est requis via Adyen avant le premier
              versement — conforme aux réglementations anti-blanchiment.
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Les détails sont disponibles dans ton{" "}
            <Link
              href="/monet"
              className="font-medium text-indigo-600 underline underline-offset-2"
            >
              Cockpit Monétisation
            </Link>{" "}
            → section Mes versements.
          </p>
        </section>

        {/* 3. MODE FREE, SUB, PPV */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. FREE, abonnements &amp; PPV : trois façons de créer de la valeur
          </h2>

          <h3 className="mt-4 text-base font-semibold text-slate-900">
            3.1 Mode FREE : partager sans monétiser
          </h3>
          <p className="mt-2">
            Le mode <strong>FREE</strong> permet à un{" "}
            <strong>expert dans ton domaine</strong>, à une marque, à un
            passionné ou à une personne qui partage simplement ce qu&apos;elle
            aime (recettes, astuces, tutoriels, organisation, etc.) de publier
            des contenus en accès libre, sans obligation de faire payer son
            public.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.2 Abonnements : créer un cercle privilégié
          </h3>
          <p className="mt-2">
            Avec les <strong>abonnements</strong>, tu proposes un niveau
            supplémentaire : contenus réservés, accès prioritaire, coulisses,
            échanges plus personnels, séries pédagogiques complètes.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.3 PPV (« Pay-Per-View ») : valoriser les contenus premium
          </h3>
          <p className="mt-2">
            Le <strong>PPV</strong> est idéal pour des contenus à forte valeur :
            masterclass complètes, tutoriels avancés, transformations
            exceptionnelles, formats &quot;événement&quot;. L&apos;utilisateur
            paye une fois pour débloquer ce contenu précis.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.4 Une plateforme UGC qui met l&apos;humain au centre
          </h3>
          <p className="mt-2">
            Magic Clock est pensée comme une plateforme UGC où tout le monde
            peut trouver sa place : expert, marque, passionné, débutant curieux.
            La valeur ne se mesure pas seulement en argent, mais aussi en{" "}
            <strong>visibilité, inspiration, impact et transmission</strong>.
          </p>
        </section>

        {/* 4. PAIEMENTS & SÉCURITÉ */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Paiements &amp; sécurité
          </h2>
          <p className="mt-2">
            Tous les paiements Magic Clock sont traités par{" "}
            <strong>Adyen for Platforms</strong>, infrastructure de paiement
            utilisée par Uber, Spotify, eBay et des milliers de plateformes
            mondiales.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Méthodes acceptées :</strong> Visa, Mastercard, TWINT
              (Suisse), iDEAL (Pays-Bas), Bancontact (Belgique), et plus de
              250 méthodes locales selon ton pays.
            </li>
            <li>
              <strong>Sécurité :</strong> paiements chiffrés, conformité PCI
              DSS niveau 1 (le plus haut niveau).
            </li>
            <li>
              <strong>Split automatique :</strong> dès qu&apos;une vente est
              confirmée, Adyen calcule et sépare automatiquement la part
              créatrice de la commission Magic Clock.
            </li>
          </ul>
        </section>

        {/* 5. TRANSPARENCE & BÊTA */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Transparence &amp; phase bêta
          </h2>
          <p className="mt-2">
            Magic Clock est actuellement en <strong>version bêta</strong> :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              certains pays ou moyens de paiement peuvent être activés
              progressivement ;
            </li>
            <li>
              la structure de commission peut évoluer, mais toujours avec une{" "}
              <strong>information claire</strong> dans ton espace créateur avant
              tout changement ;
            </li>
            <li>
              l&apos;interface (cockpit, reçus, historique) continuera
              d&apos;être améliorée.
            </li>
          </ul>
          <p className="mt-3">
            Notre principe est simple :{" "}
            <strong>pas de surprise, pas de frais cachés</strong>. Tu dois
            toujours comprendre ce que tu payes et ce que tu gagnes.
          </p>

          <p className="mt-6 text-sm font-semibold text-slate-900">
            Magic Clock, It&apos;s time to smile.
          </p>
        </section>
      </section>
    </main>
  );
}
