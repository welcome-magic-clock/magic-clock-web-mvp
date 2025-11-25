// app/monet/page.tsx
"use client";

export default function MonetPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Test Monétisation
        </h1>
        <p className="mt-4 text-slate-600">
          Si cette page est encore décalée vers la droite,
          alors le problème ne vient pas du contenu de Monétisation,
          mais d&apos;un layout au-dessus (layout global, frame iPhone, etc.).
        </p>
      </div>
    </main>
  );
}
