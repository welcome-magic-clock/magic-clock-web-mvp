// features/display/SimpleBeforeAfterCard.tsx
"use client";

type SimpleBeforeAfterCardProps = {
  beforeSrc: string;
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
  /** Callback au clic sur la carte (facultatif) */
  onClick?: () => void;
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
  beforeLabel = "Avant",
  afterLabel = "Après",
  caption,
  avatarSrc,
  avatarAlt,
  onClick,
}: SimpleBeforeAfterCardProps) {
  const content = (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm">
      {/* Canevas Avant / Après */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
          <div className="grid h-full w-full grid-cols-2">
            <MediaSlot src={beforeSrc} alt={`${title || beforeLabel} - avant`} />
            <MediaSlot src={afterSrc} alt={`${title || afterLabel} - après`} />
          </div>

          {/* Ligne centrale */}
          <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />

          {/* Avatar centré (optionnel) */}
          {avatarSrc && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/90 bg-white/10 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc}
                  alt={avatarAlt || "Créateur"}
                  className="h-[72px] w-[72px] rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Labels "Avant / Après" dans le bas de chaque moitié */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-between px-4 text-[11px] font-medium text-white drop-shadow">
          <span>{beforeLabel}</span>
          <span>{afterLabel}</span>
        </div>
      </div>

      {/* Texte sous la carte */}
      <div className="mt-3 space-y-1 text-xs">
        {title && (
          <p className="font-medium text-slate-900 truncate">{title}</p>
        )}
        {caption && (
          <p className="text-[11px] text-slate-500">{caption}</p>
        )}
      </div>
    </article>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
      >
        {content}
      </button>
    );
  }

  return content;
}
