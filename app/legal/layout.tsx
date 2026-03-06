// app/legal/layout.tsx
// ✅ v1.0 — Layout partagé pour toutes les sous-pages /legal/*
// Injecte automatiquement le BackButton "Retour à Légal" sur chaque sous-page
// Sans ce layout, chaque sous-page devrait gérer le BackButton individuellement.
import BackButton from "@/components/navigation/BackButton";

export default function LegalSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* BackButton fixe en haut — retour vers l'index légal */}
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 lg:px-8">
        <BackButton fallbackHref="/legal" label="Retour à Légal" />
      </div>
      {children}
    </>
  );
}
