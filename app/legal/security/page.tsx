// app/legal/security/page.tsx
// ✅ v2.0 — Date 6 mars 2026 · support@magic-clock.com
// BackButton retiré → géré par app/legal/layout.tsx
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
            données et de la procédure en cas d&apos;incident.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Dernière mise à jour : 6 mars 2026
          </p>
        </div>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        {/* 1. Principes */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Principes généraux
          </h2>
          <p className="mt-2">
            Nous mettons en œuvre des mesures techniques et organisationnelles
            raisonnables pour protéger les données personnelles et les contenus
            hébergés sur Magic Clock contre la perte, l'accès non autorisé ou
            la divulgation.
          </p>
        </section>

        {/* 2. Mesures techniques */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Mesures techniques (résumé)
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>chiffrement des communications via HTTPS (TLS) ;</li>
            <li>
              utilisation de prestataires d'hébergement reconnus (Vercel,
              Supabase, Cloudflare) avec contrôles d'accès et journaux
              d'activité ;
            </li>
            <li>
              séparation des environnements (développement / préproduction /
              production) ;
            </li>
            <li>
              mise à jour régulière des dépendances logicielles et correctifs
              de sécurité ;
            </li>
            <li>
              limitation des accès internes selon le principe du moindre
              privilège.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Des détails supplémentaires sont documentés dans notre plan de
            sécurité interne, amené à évoluer avec la plateforme.
          </p>
        </section>

        {/* 3. Gestion des incidents */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Gestion des incidents de sécurité
          </h2>
          <p className="mt-2">
            En cas de suspicion d'incident de sécurité (fuite de données,
            accès non autorisé, compromission de compte), nous appliquons
            notamment&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>détection et qualification de l'incident ;</li>
            <li>mesures de confinement et de correction ;</li>
            <li>
              journalisation des faits essentiels (date, cause probable,
              systèmes impactés) ;
            </li>
            <li>
              évaluation des risques et, le cas échéant, notification des
              personnes concernées et/ou des autorités compétentes conformément
              au droit applicable.
            </li>
          </ul>
        </section>

        {/* 4. Que faire ? */}
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Que faire si vous suspectez un incident ?
          </h2>
          <p className="mt-2">
            Si vous pensez que votre compte a été compromis ou que des données
            liées à Magic Clock sont exposées&nbsp;:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>changez immédiatement votre mot de passe ;</li>
            <li>
              utilisez si possible un mode de connexion plus sécurisé (lien
              magique) ;
            </li>
            <li>signalez-nous l'incident sans délai.</li>
          </ul>
          <p className="mt-2">
            E-mail&nbsp;:{" "}
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
