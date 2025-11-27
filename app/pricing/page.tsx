// app/pricing/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prix & monétisation – Magic Clock",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="mb-10 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Prix &amp; monétisation
        </h1>
        <p className="text-sm text-slate-700">
          Magic Clock est <strong>gratuit à l’inscription</strong>. Tu payes
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
            <li>• Contenus PPV achetés à l’unité</li>
          </ul>
        </div>

        {/* Carte CRÉATEURS */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Pour les créateurs
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Aucun frais fixe obligatoire. Tu gagnes lorsque tes contenus
            rencontrent ton public.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-700">
            <li>• Compte créateur gratuit</li>
            <li>• Tu fixes tes prix (FREE / SUB / PPV)</li>
            <li>• Commission environ 20–30 %</li>
            <li>• Versement mensuel de tes revenus nets</li>
          </ul>
        </div>
      </section>

      {/* CONTENU DÉTAILLÉ */}
      <section className="mt-12 space-y-12 text-sm leading-relaxed text-slate-700">
        {/* 2. POUR LES UTILISATEURS */}
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
              créateur (par exemple 4.90&nbsp;CHF / mois, 9.90&nbsp;CHF / mois,
              etc.).
            </li>
            <li>
              <strong>Contenus PPV (« Pay-Per-View ») :</strong> certains
              contenus spéciaux (masterclass, tutoriel premium, transformation
              exceptionnelle…) peuvent être achetés à l’unité. Le prix est
              clairement affiché avant tout paiement.
            </li>
          </ul>

          <p className="mt-3">
            Tu peux te désabonner à tout moment depuis ton espace Magic Clock.
          </p>
          <p className="mt-1">
            Les paiements passent par notre prestataire sécurisé{" "}
            <strong>PostFinance Checkout</strong>, selon les moyens de paiement
            disponibles dans ton pays (cartes bancaires, PostFinance Pay, TWINT,
            certains wallets, etc.).
          </p>
        </section>

        {/* 3. POUR LES CRÉATEURS */}
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
              <strong>Pas d’abonnement obligatoire</strong> pour publier.
            </li>
            <li>
              La plateforme se rémunère via une{" "}
              <strong>commission sur chaque vente</strong> (abonnements + PPV).
            </li>
            <li>
              Tu gardes la <strong>majeure partie de tes revenus</strong>.
            </li>
            <li>
              Le pourcentage exact de commission (environ{" "}
              <strong>20–30&nbsp;%</strong>) est affiché en toute transparence
              dans ton <strong>Cockpit Monétisation</strong> et peut évoluer à
              l’avenir (par exemple selon ton statut de créateur).
            </li>
          </ul>

          {/* 2.2 Tu choisis tes prix */}
          <h3 className="mt-6 text-base font-semibold text-slate-900">
            2.2 Tu choisis tes prix
          </h3>
          <p className="mt-2">
            Sur Magic Clock, c’est <strong>toi</strong> qui fixes tes tarifs
            dans les limites techniques de la plateforme :
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Abonnements :</strong>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>niveau “gratuit” possible ;</li>
                <li>
                  ou prix mensuel compris dans une large plage (par exemple
                  0.99 à 999.00, selon le marché et ta stratégie).
                </li>
              </ul>
            </li>
            <li className="mt-2">
              <strong>Contenus PPV :</strong>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>chaque contenu peut être vendu à l’unité ;</li>
                <li>
                  tu définis le prix de chaque vidéo / cours / masterclass dans
                  la même plage de prix.
                </li>
              </ul>
            </li>
          </ul>
          <p className="mt-3">
            Tu peux modifier tes prix à l’avenir, sans frais de changement. Les
            nouveaux prix s’appliquent alors pour les futurs abonnés et futurs
            achats.
          </p>

          {/* 2.3 Versements créateurs */}
          <h3 className="mt-6 text-base font-semibold text-slate-900">
            2.3 Versements créateurs
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Fréquence :</strong> un versement par mois, autour du 15.
            </li>
            <li>
              <strong>Ce qui est versé :</strong> tes revenus nets (revenus
              bruts – TVA applicable – frais de paiement – commission Magic
              Clock).
            </li>
            <li>
              <strong>Seuil minimum :</strong> un paiement est effectué dès que
              ton montant net atteint 50&nbsp;CHF (ou équivalent). En dessous,
              le solde est simplement reporté sur le mois suivant.
            </li>
            <li>
              <strong>Devise :</strong> versements en CHF ou EUR (via virement
              bancaire / SEPA), selon ton pays et les solutions disponibles.
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Les détails (montants, pays disponibles, devises, seuils) sont
            récapitulés dans la FAQ créateurs et dans l’interface Monétisation
            de ton compte.
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
            passionné ou à une personne qui partage simplement ce qu’elle aime
            (recettes, astuces, tutoriels, organisation, etc.) de publier des
            contenus en accès libre, sans obligation de faire payer son public.
          </p>
          <p className="mt-1">
            C’est la base de la communauté Magic Clock : tu peux commencer{" "}
            <strong>sans barrière d’entrée</strong>, tester des formats,
            construire une audience, apporter de la valeur, inspirer.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.2 Abonnements : créer un cercle privilégié
          </h3>
          <p className="mt-2">
            Avec les <strong>abonnements</strong>, tu peux proposer un niveau
            supplémentaire :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>contenus réservés aux abonnés,</li>
            <li>accès prioritaire, coulisses, échanges plus personnels,</li>
            <li>
              formats plus longs ou plus rares (par exemple des séries
              pédagogiques complètes).
            </li>
          </ul>
          <p className="mt-2">
            Tes abonnés choisissent de te soutenir régulièrement car ils
            reconnaissent la valeur de ce que tu partages.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.3 PPV (« Pay-Per-View ») : valoriser les contenus premium
          </h3>
          <p className="mt-2">
            Le <strong>PPV</strong> est idéal pour des contenus à forte valeur :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>masterclass complètes,</li>
            <li>tutoriels avancés ou très spécialisés,</li>
            <li>
              cas pratiques détaillés, transformations exceptionnelles, formats
              “événement”.
            </li>
          </ul>
          <p className="mt-2">
            L’utilisateur paye une fois pour débloquer ce contenu précis. Toi,
            tu peux ajuster le prix à l’importance du sujet et au temps investi.
          </p>

          <h3 className="mt-5 text-base font-semibold text-slate-900">
            3.4 Une plateforme UGC qui met l’humain au centre
          </h3>
          <p className="mt-2">
            Magic Clock est pensée comme une plateforme UGC où tout le monde
            peut trouver sa place : expert, marque, passionné, débutant curieux
            ou simple personne qui a envie de partager un peu de son quotidien.
          </p>
          <p className="mt-1">
            La valeur ne se mesure pas seulement en argent, mais aussi en{" "}
            <strong>visibilité, inspiration, impact et transmission</strong>.
            Chaque contenu peut déclencher une idée, un sourire, une prise de
            confiance – et c’est là que la magie opère.
          </p>
        </section>

        {/* 4. TRANSPARENCE & BÊTA */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Transparence &amp; phase bêta
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
              l’interface (cockpit, reçus, historique) continuera d’être
              améliorée pour rester lisible, même quand tu es fatigué à 23h.
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
