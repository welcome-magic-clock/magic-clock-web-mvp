// app/legal/mentions/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/navigation/BackButton";

export const metadata: Metadata = {
  title: "Mentions légales – Magic Clock",
};

export default function LegalMentionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <BackButton fallbackHref="/legal" label="Retour à la section Légal" />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Mentions légales / Impressum
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Informations sur l’éditeur de la Plateforme Magic Clock et les
            principaux moyens de contact.
          </p>
        </div>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        {/* 1. Éditeur */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Éditeur de la Plateforme
          </h2>
          <p className="mt-2">
            La plateforme <strong>Magic Clock</strong> est actuellement exploitée
            par l’entreprise individuelle&nbsp;:
          </p>
          <p className="mt-2">
            <strong>Magic Clock Maldonado-Verger</strong>
            <br />
            Rue des Saars 6
            <br />
            2000 Neuchâtel – Suisse
            <br />
            IDE&nbsp;: <strong>CHE-202.752.000</strong>
          </p>
        </section>

        {/* 2. Contact */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Contact
          </h2>
          <p className="mt-2">
            Pour toute question concernant la Plateforme ou les documents
            juridiques, vous pouvez nous contacter à l’adresse suivante&nbsp;:
          </p>
          <p className="mt-2">
            E-mail&nbsp;:{" "}
            <a
              href="mailto:welcome@magic-clock.com"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              welcome@magic-clock.com
            </a>
          </p>
        </section>

        {/* 3. Hébergement */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Hébergement et prestataires techniques
          </h2>
          <p className="mt-2">
            La Plateforme est hébergée auprès de fournisseurs d’infrastructure
            spécialisés (par exemple&nbsp;: Vercel, R2, Supabase ou équivalent),
            pouvant disposer de centres de données situés en Suisse, dans l’UE
            ou à l’international. Les prestataires exacts pourront être
            précisés dans notre{" "}
            <Link
              href="/legal/privacy"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Politique de confidentialité
            </Link>
            .
          </p>
        </section>

        {/* 4. Propriété intellectuelle */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Propriété intellectuelle
          </h2>
          <p className="mt-2">
            La structure générale de la Plateforme, son identité visuelle, les
            marques, logos et éléments graphiques Magic Clock sont protégés par
            le droit de la propriété intellectuelle. Toute reproduction ou
            utilisation non autorisée peut constituer une violation de ces
            droits et être poursuivie conformément à la législation applicable.
          </p>
          <p className="mt-2">
            Les contenus créés par les utilisateurs (UGC) sont régis par les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>{" "}
            et la{" "}
            <Link
              href="/legal/ip-policy"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              politique relative à la propriété intellectuelle &amp; procédure
              de retrait
            </Link>
            .
          </p>
        </section>

        {/* 5. Réclamations et litiges */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Réclamations et litiges
          </h2>
          <p className="mt-2">
            En cas de litige, nous encourageons d’abord une prise de contact
            amiable via l’adresse e-mail ci-dessus. Les conditions
            contractuelles applicables sont précisées dans les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>{" "}
            et les{" "}
            <Link
              href="/legal/cgv"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGV
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
