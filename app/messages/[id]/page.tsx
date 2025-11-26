// app/messages/[id]/page.tsx
"use client";

export default function MessageThreadPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-900">
        Chat Magic Clock – {params.id}
      </h1>

      <p className="mt-4 text-sm text-slate-600">
        Si tu vois ce message, la route dynamique{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px]">
          /messages/[id]
        </code>{" "}
        fonctionne correctement sur Vercel ✅
      </p>

      <p className="mt-2 text-xs text-slate-400">
        Tu peux revenir à la liste des messages via le menu, puis cliquer sur
        un fil (ex. Aiko Tanaka).
      </p>
    </main>
  );
}
