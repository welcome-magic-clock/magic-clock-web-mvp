// app/display/[id]/page.tsx
// Page de DEBUG uniquement pour tester les params de la route.

type PageProps = {
  params: Record<string, string | string[] | undefined>;
};

export default function DisplayDebugPage({ params }: PageProps) {
  const rawId = typeof params.id === "string" ? params.id : "";
  const debugParams = JSON.stringify(params, null, 2);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 sm:pb-28">
      <h1 className="text-2xl font-semibold">DEBUG Magic Display</h1>

      <p className="mt-2 text-sm text-slate-600">
        Voici exactement ce que Next.js envoie comme <code>params</code> à la
        page <code>app/display/[id]/page.tsx</code>.
      </p>

      <section className="mt-6 space-y-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-xs text-slate-700">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase text-slate-500">
            params :
          </p>
          <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
            {debugParams}
          </pre>
        </div>

        <div>
          <p className="mt-3 font-mono text-[11px] uppercase text-slate-500">
            id :
          </p>
          <pre className="overflow-x-auto rounded bg-white p-3 text-[11px] leading-snug">
            {rawId || "(aucun id trouvé dans params.id)"}
          </pre>
        </div>
      </section>
    </main>
  );
}
