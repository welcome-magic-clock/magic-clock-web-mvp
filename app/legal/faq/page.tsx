// app/legal/faq/page.tsx

export const metadata = {
  title: "FAQ – Magic Clock",
};

export default function LegalFAQPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          FAQ – Questions fréquentes
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Informations générales sur l’utilisation de Magic Clock et la rémunération des créateurs.
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* Bloc FAQ : rémunération des créateurs */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Comment et quand suis-je payé en tant que créateur&nbsp;?
          </h2>
          <p className="mt-2">
            Les revenus que tu gagnes (abonnements et contenus PPV) sont versés en principe{" "}
            <strong>une fois par mois, autour du 15</strong>, pour les ventes du mois précédent.
          </p>
          <p className="mt-2">
            Magic Clock prélève une <strong>commission entre 20% et 30%</strong>, en fonction de ta
            catégorie de créateur (notamment basée sur la performance globale de ton contenu,
            par exemple le nombre de likes sur l’ensemble de tes créations).
          </p>
          <p className="mt-2">
            Un <strong>seuil minimum de versement</strong> peut s’appliquer (par exemple{" "}
            <strong>50 CHF ou équivalent</strong>) afin de limiter les frais. En dessous de ce
            seuil, ton solde est simplement reporté sur le mois suivant.
          </p>
          <p className="mt-2">
            Les paiements sont effectués par <strong>virement bancaire</strong>{" "}
            (y compris <strong>SEPA lorsque possible</strong>) sur le compte que tu as indiqué,
            après les vérifications d’identité nécessaires (KYC, lutte contre la fraude, etc.).
          </p>
        </section>

        {/* Placeholder pour futures questions */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Autres questions fréquentes (à venir)
          </h2>
          <p className="mt-2">
            Cette section sera complétée au fur et à mesure du déploiement de Magic Clock
            (création de compte, sécurité, modération, etc.).
          </p>
        </section>
      </div>
    </main>
  );
}
