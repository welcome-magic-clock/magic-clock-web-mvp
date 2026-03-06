// components/mymagic/ProfileSection.tsx
// ✅ REDESIGN v2.2 — Réseaux sociaux + badges Certifié + Magic Clock readOnly
"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserRound, FileText, Camera,
  Loader2, CheckCircle2, AlertCircle, ArrowRight, X, BadgeCheck,
} from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

type ProfileData = {
  handle: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  totalFollowers?: number;
};

type ProfileSectionProps = {
  userId: string;
  userEmail: string;
  initialProfile?: Partial<ProfileData>;
  mcFollowers?: number | null;
  onProfileUpdated?: (profile: ProfileData) => void;
};

type SaveStatus = "idle" | "saving" | "success" | "error";

// ── 12 réseaux sociaux — ordre stratégique ──────────────────
const SOCIALS = [
  {
    key: "magic_clock",
    name: "Magic Clock",
    logo: "/magic-clock-social-monet.png",
    placeholder: "ton_handle",
    url: (h: string) => `https://magic-clock.com/meet/${h}`,
    readOnly: true,
  },
  {
    key: "instagram",
    name: "Instagram",
    logo: "/magic-clock-social-instagram.png",
    placeholder: "ton_compte",
    url: (h: string) => `https://instagram.com/${h}`,
    readOnly: false,
  },
  {
    key: "tiktok",
    name: "TikTok",
    logo: "/magic-clock-social-tiktok.png",
    placeholder: "ton_compte",
    url: (h: string) => `https://tiktok.com/@${h}`,
    readOnly: false,
  },
  {
    key: "youtube",
    name: "YouTube",
    logo: "/magic-clock-social-youtube.png",
    placeholder: "ta_chaine",
    url: (h: string) => `https://youtube.com/@${h}`,
    readOnly: false,
  },
  {
    key: "facebook",
    name: "Facebook",
    logo: "/magic-clock-social-facebook.png",
    placeholder: "ta_page",
    url: (h: string) => `https://facebook.com/${h}`,
    readOnly: false,
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    logo: "/magic-clock-social-linkedin.png",
    placeholder: "ton_profil",
    url: (h: string) => `https://linkedin.com/in/${h}`,
    readOnly: false,
  },
  {
    key: "snapchat",
    name: "Snapchat",
    logo: "/magic-clock-social-snapchat.png",
    placeholder: "ton_compte",
    url: (h: string) => `https://snapchat.com/add/${h}`,
    readOnly: false,
  },
  {
    key: "x",
    name: "X",
    logo: "/magic-clock-social-x.png",
    placeholder: "ton_compte",
    url: (h: string) => `https://x.com/${h}`,
    readOnly: false,
  },
  {
    key: "pinterest",
    name: "Pinterest",
    logo: "/magic-clock-social-pinterest.png",
    placeholder: "ton_compte",
    url: (h: string) => `https://pinterest.com/${h}`,
    readOnly: false,
  },
  {
    key: "threads",
    name: "Threads",
    logo: "/magic-clock-social-threads.png",
    placeholder: "ton_compte",
    url: (h: string) => `https://threads.net/@${h}`,
    readOnly: false,
  },
  {
    key: "bereal",
    name: "BeReal",
    logo: "/magic-clock-social-bereal.png",
    placeholder: "ton_compte",
    url: (h: string) => `https://bere.al/${h}`,
    readOnly: false,
  },
  {
    key: "twitch",
    name: "Twitch",
    logo: "/magic-clock-social-twitch.png",
    placeholder: "ta_chaine",
    url: (h: string) => `https://twitch.tv/${h}`,
    readOnly: false,
  },
] as const;

type SocialKey = typeof SOCIALS[number]["key"];

function formatFollowers(n: number | null): string {
  if (!n || n === 0) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".", ",")}k`;
  return String(n);
}

// ── Badge Certifié ── (identique à Meet Me)
function CertifiedBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
      <span>Certifié</span>
    </span>
  );
}

// ── Carte réseau social dépliable ────────────────────────────
function SocialCard({
  social,
  handle,
  followers,
  isVerified,
  onHandleChange,
  onFollowersChange,
}: {
  social: typeof SOCIALS[number];
  handle: string;
  followers: number | null;
  isVerified: boolean;
  onHandleChange: (v: string) => void;
  onFollowersChange: (v: number | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLinked = handle.trim().length > 0;
  const isReadOnly = social.readOnly;

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      isLinked
        ? isVerified
          ? "border-sky-200 bg-sky-50/30"
          : isReadOnly
            ? "border-blue-200 bg-blue-50/20"
            : "border-violet-200 bg-violet-50/30"
        : "border-slate-100 bg-white"
    }`}>

      {/* ── Ligne principale ── */}
      <button
        type="button"
        onClick={() => !isReadOnly && setExpanded((v) => !v)}
        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left ${isReadOnly ? "cursor-default" : ""}`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 h-8 w-8 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
          <img src={social.logo} alt={social.name} className="h-6 w-6 object-contain" />
        </div>

        {/* Nom + handle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-bold text-slate-900 leading-tight">{social.name}</p>
            {isVerified && <CertifiedBadge />}
          </div>
          {isLinked ? (
            <p className="text-[11px] font-medium text-violet-600 truncate leading-tight">
              @{handle}
              {followers !== null && followers > 0 && (
                <span className="ml-1.5 text-slate-400 font-normal">· {formatFollowers(followers)}</span>
              )}
            </p>
          ) : (
            <p className="text-[10px] text-slate-400 leading-tight">
              {isReadOnly ? "Compte Magic Clock officiel" : "Cliquer pour connecter"}
            </p>
          )}
        </div>

        {/* Indicateurs */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isLinked && (
            <span className={`h-1.5 w-1.5 rounded-full ${isVerified ? "bg-sky-400" : "bg-emerald-400"}`} />
          )}
          {isReadOnly ? (
            <span className="text-[9px] text-blue-300 font-bold">MC</span>
          ) : (
            <span className={`text-[9px] text-slate-300 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▼</span>
          )}
        </div>
      </button>

      {/* ── Formulaire dépliable (non-readOnly uniquement) ── */}
      {expanded && !isReadOnly && (
        <div className="border-t border-slate-100 px-3 pb-3 pt-2 space-y-2.5">

          {/* Handle */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Nom d'utilisateur
            </label>
            <div className="relative mt-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-300 pointer-events-none select-none">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => onHandleChange(e.target.value.replace(/^@/, "").replace(/\s/g, ""))}
                placeholder={social.placeholder}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-6 pr-7 text-xs text-slate-900 outline-none focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100 placeholder:text-slate-300"
              />
              {handle && (
                <button
                  type="button"
                  onClick={() => onHandleChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            {handle && (
              <a
                href={social.url(handle)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-violet-500 hover:underline"
              >
                Ouvrir le profil ↗
              </a>
            )}
          </div>

          {/* Followers */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Abonnés
            </label>
            <input
              type="number"
              min={0}
              value={followers ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                onFollowersChange(v === "" ? null : Math.max(0, parseInt(v) || 0));
              }}
              placeholder="Ex : 12400"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 outline-none focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100 placeholder:text-slate-300"
            />
            {followers !== null && followers > 0 && (
              <p className="mt-0.5 text-[10px] text-slate-400">
                Affiché : <span className="font-bold mc-text-gradient">{formatFollowers(followers)} abonnés</span>
              </p>
            )}
          </div>

          {/* Info vérification */}
          <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-500">Vérification en cours de déploiement.</span>{" "}
              Un badge <span className="text-sky-600 font-semibold">✓ Certifié</span> sera apposé
              une fois votre compte confirmé par l'équipe Magic Clock.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

// ── Composant principal ──────────────────────────────────────
export default function ProfileSection({
  userId,
  userEmail,
  initialProfile,
  mcFollowers,
  onProfileUpdated,
}: ProfileSectionProps) {
  const sb = getSupabaseBrowser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [handle, setHandle]           = useState(initialProfile?.handle ?? "");
  const [displayName, setDisplayName] = useState(initialProfile?.display_name ?? "");
  const [bio, setBio]                 = useState(initialProfile?.bio ?? "");
  const [avatarUrl, setAvatarUrl]     = useState<string | null>(initialProfile?.avatar_url ?? null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile]       = useState<File | null>(null);
  const [saveStatus, setSaveStatus]       = useState<SaveStatus>("idle");
  const [saveError, setSaveError]         = useState<string | null>(null);

  // State réseaux sociaux
  const emptyState = () => ({ handle: "", followers: null as number | null, verified: false });
  const [socials, setSocials] = useState<Record<SocialKey, { handle: string; followers: number | null; verified: boolean }>>({
    magic_clock: emptyState(), instagram: emptyState(), tiktok: emptyState(),
    youtube: emptyState(), facebook: emptyState(), linkedin: emptyState(),
    snapchat: emptyState(), x: emptyState(), pinterest: emptyState(),
    threads: emptyState(), bereal: emptyState(), twitch: emptyState(),
  });

  // Total followers toutes plateformes
  const totalFollowers = Object.values(socials).reduce((sum, s) => sum + (s.followers ?? 0), 0);
  const linkedCount = Object.values(socials).filter((s) => s.handle.trim()).length;

  // Chargement Supabase
  useEffect(() => {
    if (!userId) return;
    sb.from("profiles")
      .select(`
        handle, display_name, bio, avatar_url,
        social_tiktok, social_tiktok_followers, social_tiktok_verified,
        social_instagram, social_instagram_followers, social_instagram_verified,
        social_youtube, social_youtube_followers, social_youtube_verified,
        social_facebook, social_facebook_followers, social_facebook_verified,
        social_linkedin, social_linkedin_followers, social_linkedin_verified,
        social_snapchat, social_snapchat_followers, social_snapchat_verified,
        social_x, social_x_followers, social_x_verified,
        social_magic_clock, social_magic_clock_followers, social_magic_clock_verified,
        social_pinterest, social_pinterest_followers, social_pinterest_verified,
        social_threads, social_threads_followers, social_threads_verified,
        social_bereal, social_bereal_followers, social_bereal_verified,
        social_twitch, social_twitch_followers, social_twitch_verified
      `)
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const profileHandle = data.handle ?? "";
        if (profileHandle) setHandle(profileHandle);
        if (data.display_name) setDisplayName(data.display_name);
        if (data.bio)          setBio(data.bio);
        if (data.avatar_url)   setAvatarUrl(data.avatar_url);

        setSocials({
          // Magic Clock : handle = profil MC réel, non-éditable
          magic_clock: {
            handle: profileHandle,
            followers: mcFollowers ?? data.social_magic_clock_followers ?? null,
            verified: data.social_magic_clock_verified ?? false,
          },
          instagram: { handle: data.social_instagram ?? "", followers: data.social_instagram_followers ?? null, verified: data.social_instagram_verified ?? false },
          tiktok:    { handle: data.social_tiktok ?? "",    followers: data.social_tiktok_followers ?? null,    verified: data.social_tiktok_verified ?? false },
          youtube:   { handle: data.social_youtube ?? "",   followers: data.social_youtube_followers ?? null,   verified: data.social_youtube_verified ?? false },
          facebook:  { handle: data.social_facebook ?? "",  followers: data.social_facebook_followers ?? null,  verified: data.social_facebook_verified ?? false },
          linkedin:  { handle: data.social_linkedin ?? "",  followers: data.social_linkedin_followers ?? null,  verified: data.social_linkedin_verified ?? false },
          snapchat:  { handle: data.social_snapchat ?? "",  followers: data.social_snapchat_followers ?? null,  verified: data.social_snapchat_verified ?? false },
          x:         { handle: data.social_x ?? "",         followers: data.social_x_followers ?? null,         verified: data.social_x_verified ?? false },
          pinterest: { handle: data.social_pinterest ?? "", followers: data.social_pinterest_followers ?? null, verified: data.social_pinterest_verified ?? false },
          threads:   { handle: data.social_threads ?? "",   followers: data.social_threads_followers ?? null,   verified: data.social_threads_verified ?? false },
          bereal:    { handle: data.social_bereal ?? "",    followers: data.social_bereal_followers ?? null,    verified: data.social_bereal_verified ?? false },
          twitch:    { handle: data.social_twitch ?? "",    followers: data.social_twitch_followers ?? null,    verified: data.social_twitch_verified ?? false },
        });
      });
  }, [userId, mcFollowers]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function updateSocial(key: SocialKey, field: "handle" | "followers", value: string | number | null) {
    setSocials((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function handleSaveProfile() {
    if (!handle.trim()) { setSaveError("Le handle est requis."); return; }
    setSaveStatus("saving");
    setSaveError(null);
    try {
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() ?? "jpg";
        const path = `avatars/${userId}.${ext}`;
        const { error: upErr } = await sb.storage.from("profiles").upload(path, avatarFile, { upsert: true });
        if (upErr) throw new Error("Erreur upload avatar : " + upErr.message);
        const { data: urlData } = sb.storage.from("profiles").getPublicUrl(path);
        finalAvatarUrl = urlData.publicUrl ?? null;
      }

      const { error: upsertErr } = await sb.from("profiles").upsert({
        id: userId, email: userEmail,
        handle: handle.trim().replace(/^@/, ""),
        display_name: displayName.trim(),
        bio: bio.trim(),
        avatar_url: finalAvatarUrl,
        // Magic Clock = géré automatiquement, on ne touche pas au _verified
        social_magic_clock:           handle.trim().replace(/^@/, "") || null,
        social_magic_clock_followers: mcFollowers ?? socials.magic_clock.followers,
        // Autres réseaux
        social_instagram:             socials.instagram.handle || null,
        social_instagram_followers:   socials.instagram.followers,
        social_tiktok:                socials.tiktok.handle || null,
        social_tiktok_followers:      socials.tiktok.followers,
        social_youtube:               socials.youtube.handle || null,
        social_youtube_followers:     socials.youtube.followers,
        social_facebook:              socials.facebook.handle || null,
        social_facebook_followers:    socials.facebook.followers,
        social_linkedin:              socials.linkedin.handle || null,
        social_linkedin_followers:    socials.linkedin.followers,
        social_snapchat:              socials.snapchat.handle || null,
        social_snapchat_followers:    socials.snapchat.followers,
        social_x:                     socials.x.handle || null,
        social_x_followers:           socials.x.followers,
        social_pinterest:             socials.pinterest.handle || null,
        social_pinterest_followers:   socials.pinterest.followers,
        social_threads:               socials.threads.handle || null,
        social_threads_followers:     socials.threads.followers,
        social_bereal:                socials.bereal.handle || null,
        social_bereal_followers:      socials.bereal.followers,
        social_twitch:                socials.twitch.handle || null,
        social_twitch_followers:      socials.twitch.followers,
      });

      if (upsertErr) throw new Error(upsertErr.message);
      await sb.auth.updateUser({ data: { full_name: displayName.trim(), avatar_url: finalAvatarUrl } });

      setAvatarUrl(finalAvatarUrl);
      setAvatarPreview(null);
      setAvatarFile(null);
      setSaveStatus("success");
      onProfileUpdated?.({
        handle: handle.trim().replace(/^@/, ""),
        display_name: displayName.trim(),
        bio: bio.trim(),
        avatar_url: finalAvatarUrl,
        totalFollowers,
      });
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      setSaveError(err.message ?? "Erreur inconnue.");
      setSaveStatus("error");
    }
  }

  const effectiveAvatar = avatarPreview ?? avatarUrl;
  const initial = (displayName[0] ?? handle[0] ?? userEmail[0] ?? "?").toUpperCase();

  return (
    <div className="space-y-3">

      {/* ── Photo de profil ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="mc-dot" /> Photo de profil
        </h2>
        <div className="flex items-center gap-4">
          <div className="mc-avatar-ring flex-shrink-0" style={{ width: 72, height: 72 }}>
            <div className="absolute inset-[3px] z-[2] rounded-full overflow-hidden bg-violet-50 flex items-center justify-center">
              {effectiveAvatar
                ? <img src={effectiveAvatar} alt={displayName || handle} className="h-full w-full object-cover" />
                : <span className="mc-text-gradient text-2xl font-bold">{initial}</span>
              }
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0.5 right-0.5 z-[10] flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border-2 border-white text-white shadow hover:bg-slate-700 transition-colors">
              <Camera className="h-3 w-3" strokeWidth={1.8} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{displayName || handle || userEmail}</p>
            <p className="text-xs text-slate-400 mt-0.5">JPG, PNG · 2 Mo max</p>
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="mt-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition-colors">
              Changer la photo
            </button>
          </div>
        </div>
      </div>

      {/* ── Identité publique ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="mc-dot" /> Identité publique
        </h2>
        <div className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nom affiché</label>
            <div className="relative">
              <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" strokeWidth={1.8} />
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ton prénom ou nom de scène"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50 placeholder:text-slate-300" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Handle (identifiant)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold mc-text-gradient pointer-events-none z-10">@</span>
              <input type="text" value={handle.replace(/^@/, "")}
                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_.−]/g, ""))}
                placeholder="ton_handle"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50 placeholder:text-slate-300" />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">Lettres, chiffres, _ et . · Visible dans Meet Me</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Bio</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" strokeWidth={1.8} />
              <textarea value={bio} onChange={(e) => setBio(e.target.value)}
                placeholder="Coiffeuse, coloriste, passionnée de transformations..." rows={3} maxLength={200}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50 placeholder:text-slate-300 resize-none" />
            </div>
            <p className="mt-1 text-right text-[11px] text-slate-400">{bio.length}/200</p>
          </div>
        </div>
        {saveError && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} /> {saveError}
          </div>
        )}
        {saveStatus === "success" && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} /> Profil mis à jour avec succès.
          </div>
        )}
      </div>

      {/* ── Réseaux sociaux ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="mc-dot" /> Réseaux sociaux
          </h2>
          {totalFollowers > 0 && (
            <div className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 flex-shrink-0">
              <span className="text-[10px] font-bold mc-text-gradient">
                {formatFollowers(totalFollowers)} abonnés
              </span>
            </div>
          )}
        </div>

        {linkedCount > 0 ? (
          <p className="mb-2.5 text-[11px] text-slate-400">
            {linkedCount} réseau{linkedCount > 1 ? "x" : ""} connecté{linkedCount > 1 ? "s" : ""} · Clique pour modifier
          </p>
        ) : (
          <p className="mb-2.5 text-[11px] text-slate-400">
            Clique sur un réseau pour connecter ton compte et afficher tes abonnés.
          </p>
        )}

        {/* Info badge certifié */}
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-sky-50 border border-sky-100 px-3 py-2">
          <BadgeCheck className="h-4 w-4 text-sky-500 flex-shrink-0" />
          <p className="text-[11px] text-sky-700 leading-relaxed">
            Les comptes vérifiés par Magic Clock affichent le badge <span className="font-bold">Certifié</span>.
            Contacte-nous pour faire valider tes réseaux.
          </p>
        </div>

        <div className="space-y-1.5">
          {SOCIALS.map((social) => (
            <SocialCard
              key={social.key}
              social={social}
              handle={socials[social.key as SocialKey]?.handle ?? ""}
              followers={socials[social.key as SocialKey]?.followers ?? null}
              isVerified={socials[social.key as SocialKey]?.verified ?? false}
              onHandleChange={(v) => updateSocial(social.key as SocialKey, "handle", v)}
              onFollowersChange={(v) => updateSocial(social.key as SocialKey, "followers", v)}
            />
          ))}
        </div>

        <p className="mt-3 text-[10px] text-slate-400 leading-relaxed">
          Tes abonnés cumulés sont visibles sur ton profil public <span className="font-semibold">Meet Me</span>.
          Les chiffres déclarés sont sous ta responsabilité.
        </p>
      </div>

      {/* ── Sauvegarder ── */}
      <button type="button" onClick={handleSaveProfile} disabled={saveStatus === "saving"}
        className="mc-btn-primary flex w-full items-center justify-between rounded-2xl px-5 py-4 text-sm disabled:opacity-60">
        <span className="flex items-center gap-2">
          {saveStatus === "saving"
            ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            : <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
          }
          {saveStatus === "saving" ? "Sauvegarde…" : "Sauvegarder le profil"}
        </span>
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </button>

    </div>
  );
}
