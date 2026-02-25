"use client";

type SimpleBeforeAfterCardProps = {
  /** Image côté gauche (avant) */
  beforeSrc: string;
  /** Image côté droit (après) */
  afterSrc: string;

  /** Titre global de la carte (facultatif) */
  title?: string;

  /** Label côté gauche (ex: "Avant", "Segment 1") */
  beforeLabel?: string;

  /** Label côté droit (ex: "Après", "Segment 2") */
  afterLabel?: string;

  /** Texte sous la carte (facultatif) */
  caption?: string;

  /** Avatar au centre (facultatif) */
  avatarSrc?: string | null;
  avatarAlt?: string;
};

function MediaSlot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

export default function SimpleBeforeAfterCard({
  beforeSrc,
  afterSrc,
  title,
  beforeLabel,
  afterLabel,
  caption,
  avatarSrc,
  avatarAlt = "Avatar créateur",
}: SimpleBeforeAfterCardProps) {
  // ✅ Toujours garantir une image d'avatar exploitable
  const effectiveAvatarSrc =
    avatarSrc && avatarSrc.trim().length > 0
      ? avatarSrc
      : "/creators/aiko-tanaka.jpeg";

  const leftAlt = `${title || beforeLabel || "Avant"}`;
  const rightAlt = `${title || afterLabel || "Après"}`;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm">
      {/* Canevas Avant / Après – même gabarit que MagicDisplayClient */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
          <div className="grid h-full w-full grid-cols-2">
            <MediaSlot src={beforeSrc} alt={`${leftAlt} - avant`} />
            <MediaSlot src={afterSrc} alt={`${rightAlt} - après`} />
          </div>

          {/* Ligne verticale centrale */}
          <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />

          {/* Avatar central optionnel (avec fallback) */}
          {effectiveAvatarSrc && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/90 bg-white/10 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={effectiveAvatarSrc}
                  alt={avatarAlt || "Créateur"}
                  className="h-[72px] w-[72px] rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Labels bas gauche / bas droite */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-between px-4 text-[11px] font-medium text-white drop-shadow">
          <span>{beforeLabel}</span>
          <span>{afterLabel}</span>
        </div>
      </div>

      {/* Texte sous la carte */}
      <div className="mt-3 space-y-1 text-xs">
        {title && (
          <p className="truncate font-medium text-slate-900">{title}</p>
        )}
        {caption && (
          <p className="text-[11px] text-slate-500">{caption}</p>
        )}
      </div>
    </article>
  );
}
