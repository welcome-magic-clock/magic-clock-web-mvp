// components/mymagic/ProfileSection.tsx
// ✅ REDESIGN v2 — gradient design system Magic Clock
"use client";
import { useEffect, useRef, useState } from "react";
import {
  UserRound, AtSign, FileText, Camera, Loader2,
  CheckCircle2, AlertCircle, ArrowRight,
} from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

type ProfileData = {
  handle: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
};

type ProfileSectionProps = {
  userId: string;
  userEmail: string;
  initialProfile?: Partial<ProfileData>;
  onProfileUpdated?: (profile: ProfileData) => void;
};

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function ProfileSection({
  userId, userEmail, initialProfile, onProfileUpdated,
}: ProfileSectionProps) {
  const sb = getSupabaseBrowser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [handle, setHandle] = useState(initialProfile?.handle ?? "");
  const [displayName, setDisplayName] = useState(initialProfile?.display_name ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile?.avatar_url ?? null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    sb.from("profiles").select("handle, display_name, bio, avatar_url").eq("id", userId).single()
      .then(({ data }) => {
        if (!data) return;
        if (data.handle) setHandle(data.handle);
        if (data.display_name) setDisplayName(data.display_name);
        if (data.bio) setBio(data.bio);
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [userId]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
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

      {/* ── Bloc Photo de profil ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="mc-dot" />
          Photo de profil
        </h2>
        <div className="flex items-center gap-4">
          {/* Avatar miniature avec anneau */}
          <div className="mc-avatar-ring flex-shrink-0" style={{ width: 72, height: 72 }}>
            <div className="absolute inset-[3px] z-[2] rounded-full overflow-hidden bg-violet-50 flex items-center justify-center">
              {effectiveAvatar ? (
                <img src={effectiveAvatar} alt={displayName || handle} className="h-full w-full object-cover" />
              ) : (
                <span className="mc-text-gradient text-2xl font-bold">{initial}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0.5 right-0.5 z-[10] flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border-2 border-white text-white shadow hover:bg-slate-700 transition-colors"
            >
              <Camera className="h-3 w-3" strokeWidth={1.8} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">{displayName || handle || userEmail}</p>
            <p className="text-xs text-slate-400 mt-0.5">JPG, PNG · 2 Mo max</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition-colors"
            >
              Changer la photo
            </button>
          </div>
        </div>
      </div>

      {/* ── Bloc Identité publique ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="mc-dot" />
          Identité publique
        </h2>

        <div className="space-y-3.5">
          {/* Nom affiché */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nom affiché</label>
            <div className="relative">
              <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" strokeWidth={1.8} />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ton prénom ou nom de scène"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50 placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Handle */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Handle (identifiant)</label>
            <div className="relative">
              {/* @ en gradient via un span absolu */}
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold mc-text-gradient pointer-events-none z-10">@</span>
              <input
                type="text"
                value={handle.replace(/^@/, "")}
                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_.−]/g, ""))}
                placeholder="ton_handle"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50 placeholder:text-slate-300"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">Lettres, chiffres, _ et . · Visible dans Meet Me</p>
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Bio</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" strokeWidth={1.8} />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Coiffeuse, coloriste, passionnée de transformations..."
                rows={3}
                maxLength={200}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50 placeholder:text-slate-300 resize-none"
              />
            </div>
            <p className="mt-1 text-right text-[11px] text-slate-400">{bio.length}/200</p>
          </div>
        </div>

        {/* Feedback */}
        {saveError && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
            {saveError}
          </div>
        )}
        {saveStatus === "success" && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
            Profil mis à jour avec succès.
          </div>
        )}
      </div>

      {/* ── Réseaux sociaux ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="mc-dot" />
          Réseaux sociaux
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { name: "TikTok", emoji: "🎵", linked: false, handle: "" },
            { name: "Instagram", emoji: "📸", linked: true, handle: "welcome.zuiopi" },
            { name: "YouTube", emoji: "▶️", linked: false, handle: "" },
            { name: "Facebook", emoji: "👤", linked: false, handle: "" },
          ].map((social) => (
            <div
              key={social.name}
              className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors ${
                social.linked
                  ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-base flex-shrink-0">
                {social.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-900">{social.name}</p>
                <p className={`text-[10px] truncate ${social.linked ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                  {social.linked ? social.handle : "Non lié"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bouton Sauvegarder ── */}
      <button
        type="button"
        onClick={handleSaveProfile}
        disabled={saveStatus === "saving"}
        className="mc-btn-primary flex w-full items-center justify-between rounded-2xl px-5 py-4 text-sm disabled:opacity-60"
      >
        <span className="flex items-center gap-2">
          {saveStatus === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
          )}
          {saveStatus === "saving" ? "Sauvegarde…" : "Sauvegarder le profil"}
        </span>
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </button>

    </div>
  );
}
