// app/pricing/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prix & monétisation – Magic Clock",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* 1. Intro */}
      <header className="mb-10 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Prix &amp; monétisation
        </h1>
        <p className="max-w-2xl text-sm text-slate-700">
          Magic Clock est gratuit à l’inscription. Tu payes seulement les
          créateurs que tu choisis… ou tu monétises ton savoir si tu es
          créateur.
        </p>
      </header>

      <div className="space-y-10 text-sm leading-relaxed text-slate-700">
        {/* 2. Pour les utilisateurs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            2. Pour les utilisateurs (abonnés &amp; PPV)
          </h2>

          <h3 className="text-base font-semibold text-slate-900">
            Magic Clock, combien ça coûte pour moi ?
          </h3>

          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 space-y-2">
            <p>En tant qu’utilisateur, tu bénéficies d’un modèle simple :</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Inscription</strong> : gratuite.
              </li>
              <li>
                <strong>Contenus gratuits</strong> : beaucoup de créateurs
                proposent déjà des posts en accès libre.
              </li>
              <li>
                <strong>Abonnements mensuels</strong> : tu peux soutenir un
                créateur avec un abonnement mensuel. Le prix est fixé par chaque
                créateur (par exemple 4.90 CHF / mois, 9.90 CHF / mois, etc.).
              </li>
              <li>
                <strong>Contenus PPV (« Pay-Per-View »)</strong> : certains
                contenus spéciaux (masterclass, tutoriel premium, transformation
                exceptionnelle…) peuvent être achetés à l’unité. Le prix est
                clairement affiché avant tout paiement.
              </li>
            </ul>
          </div>

          <p>
            Tu peux te désabonner à tout moment depuis ton espace Magic Clock.
          </p>
          <p>
            Les paiements passent par notre prestataire sécurisé{" "}
            <strong>PostFinance Checkout</strong>, selon les moyens de paiement
            disponibles dans ton pays.
          </p>
        </section>

        {/* 3. Pour les créateurs */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">
            3. Pour les créateurs
          </h2>

          {/* 3.1 Pas de frais fixes */}
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/70 p-4">
            <h3 className="text-base font-semibold text-slate-900">
              3.1. Pas de frais fixes, tu payes seulement quand tu gagnes
            </h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Ouverture de compte créateur : gratuite.</li>
              <li>Pas d’abonnement obligatoire pour publier.</li>
              <li>
                La plateforme se rémunère via une{" "}
                <strong>commission sur chaque vente</strong> (abonnements + PPV).
              </li>
              <li>Tu gardes la majeure partie de tes revenus.</li>
              <li>
                Le pourcentage exact de commission (environ{" "}
                <strong>20–30 %</strong>) est affiché en toute transparence dans
                ton Cockpit Monétisation et peut évoluer à l’avenir (par
                exemple selon ton statut de créateur).
              </li>
            </ul>
          </div>

          {/* 3.2 Tu choisis tes prix */}
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/70 p-4">
            <h3 className="text-base font-semibold text-slate-900">
              3.2. Tu choisis tes prix
            </h3>
            <p>
              Sur Magic Clock, c’est toi qui fixes tes tarifs dans les limites
              techniques de la plateforme :
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <strong>Abonnements</strong> :
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>niveau « gratuit » possible,</li>
                  <li>
                    ou prix mensuel compris dans une large plage (par ex.{" "}
                    <strong>0.99 à 999.00</strong>, selon le marché et ta
                    stratégie).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Contenus PPV</strong> :
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>chaque contenu peut être vendu à l’unité,</li>
                  <li>
                    tu définis le prix de chaque vidéo / cours / masterclass
                    dans la même plage de prix.
                  </li>
                </ul>
              </li>
            </ul>
            <p className="mt-2">
              Tu peux modifier tes prix à l’avenir, sans frais de changement.
              Les nouveaux prix s’appliquent alors pour les futurs abonnés et
              futurs achats.
            </p>
          </div>

          {/* 3.3 Versements créateurs */}
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/70 p-4">
            <h3 className="text-base font-semibold text-slate-900">
              3.3. Versements créateurs
            </h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <strong>Fréquence</strong> : un versement par mois, autour du 15.
              </li>
              <li>
                <strong>Ce qui est versé</strong> : tes revenus nets (revenus
                bruts – TVA applicable – frais de paiement – commission Magic
                Clock).
              </li>
              <li>
                <strong>Seuil minimum</strong> : un paiement est effectué dès que
                ton montant net atteint <strong>50 CHF</strong> (ou équivalent).
                En dessous, le solde est simplement reporté sur le mois suivant.
              </li>
              <li>
                <strong>Devise</strong> : versements en CHF ou EUR (via virement
                bancaire / SEPA), selon ton pays et les solutions disponibles.
              </li>
            </ul>
            <p className="mt-2">
              Les détails (montants, pays disponibles, devises, seuils) sont
              récapitulés dans la FAQ créateurs et dans l’interface{" "}
              <strong>Monétisation</strong> de ton compte.
            </p>
          </div>

          {/* 3.4 Créateurs FREE, passage au payant & comptes inspiration */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              3.4. Créateurs FREE, passage au payant &amp; comptes « inspiration »
            </h3>

            <p>
              Sur Magic Clock, tu peux choisir ta stratégie, que tu sois :
            </p>

            <ul className="list-disc space-y-1 pl-5">
              <li>expert dans ton domaine,</li>
              <li>marque,</li>
              <li>passionné de cuisine,</li>
              <li>étudiant, formateur, artiste…</li>
              <li>ou simplement quelqu’un qui aime partager ce qu’il sait.</li>
            </ul>

            {/* 1. Profil 100 % FREE */}
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/70 p-4">
              <h4 className="text-sm font-semibold text-slate-900">
                1. Profil 100&nbsp;% FREE
              </h4>
              <p>
                Tu publies gratuitement (Magic Studio, Magic Display, tutoriels,
                avant/après, recettes, astuces, etc.).
              </p>
              <p>
                Tes contenus servent à{" "}
                <strong>inspirer, aider et construire ta communauté</strong>{" "}
                (clients, élèves, fans, consommateurs, etc.).
              </p>
              <p>
                Si tout ton contenu reste en FREE, tu ne payes rien&nbsp;: pas
                d’abonnement créateur obligatoire, pas de commission.
              </p>
            </div>

            {/* 2. Stratégie hybride FREE → payant */}
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/70 p-4">
              <h4 className="text-sm font-semibold text-slate-900">
                2. Stratégie hybride&nbsp;: FREE → payant
              </h4>
              <p>
                Tu peux commencer <strong>en FREE</strong>, puis, quand ta
                communauté grandit, décider de&nbsp;:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>proposer un <strong>abonnement payant</strong>,</li>
                <li>
                  et/ou certains contenus en <strong>PPV</strong> (Pay-Per-View).
                </li>
              </ul>
              <p>Tes followers&nbsp;:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>gardent l’accès à tout ce que tu laisses en FREE,</li>
                <li>
                  voient clairement ce qui devient{" "}
                  <strong>«&nbsp;réservé aux abonnés&nbsp;»</strong> ou{" "}
                  <strong>PPV</strong>,
                </li>
                <li>
                  choisissent librement s’ils souhaitent s’abonner ou acheter à
                  l’unité.
                </li>
              </ul>
            </div>

            {/* 3. Créateurs inspiration */}
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/70 p-4">
              <h4 className="text-sm font-semibold text-slate-900">
                3. Créateurs «&nbsp;inspiration&nbsp;» à long terme
              </h4>
              <p>
                Certains créateurs (marques, écoles, associations, passionnés)
                peuvent choisir de rester <strong>toujours en FREE</strong>,
                pour&nbsp;:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  éduquer (ex. expliquer comment utiliser une gamme de produits),
                </li>
                <li>inspirer (ex. idées coiffure, recettes, DIY),</li>
                <li>renforcer leur image et leur communauté.</li>
              </ul>
              <p>
                Magic Clock reste alors une <strong>plateforme UGC ouverte</strong>,
                où la vraie valeur est celle qu’on fait naître dans le cœur des
                gens&nbsp;: un sourire, une idée qui donne du courage, un moment de
                douceur que l’on a envie de partager.
              </p>
            </div>

            <p className="pt-2 text-sm font-semibold text-slate-900">
              Vision&nbsp;:{" "}
              <span className="italic">Magic Clock, It’s time to smile!</span>
            </p>
          </section>
        </section>

        {/* 4. Transparence & phase bêta */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Transparence &amp; phase bêta
          </h2>
          <p>
            Magic Clock est actuellement en version bêta&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              certains pays ou moyens de paiement peuvent être activés
              progressivement,
            </li>
            <li>
              la structure de commission peut évoluer, mais toujours avec une
              information claire dans ton espace créateur avant tout changement.
            </li>
          </ul>
          <p className="mt-2">
            Notre principe est simple&nbsp;:{" "}
            <strong>pas de surprise, pas de frais cachés</strong> – tu dois
            toujours comprendre ce que tu payes et ce que tu gagnes.
          </p>
        </section>
      </div>
    </main>
  );
}
