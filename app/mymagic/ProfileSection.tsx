// components/mymagic/ProfileSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  AtSign,
  FileText,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
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
type PwdStatus = "idle" | "saving" | "success" | "error";

export default function ProfileSection({
  userId,
  userEmail,
  initialProfile,
  onProfileUpdated,
}: ProfileSectionProps) {
  const sb = getSupabaseBrowser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Champs profil ──────────────────────────────────────────
  const [handle, setHandle] = useState(initialProfile?.handle ?? "");
  const [displayName, setDisplayName] = useState(initialProfile?.display_name ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile?.avatar_url ?? null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // ── Statuts ────────────────────────────────────────────────
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Mot de passe ───────────────────────────────────────────
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdStatus, setPwdStatus] = useState<PwdStatus>("idle");
  const [pwdError, setPwdError] = useState<string | null>(null);

  // ── Charger le profil depuis Supabase au montage ───────────
  useEffect(() => {
    if (!userId) return;
    sb.from("profiles")
      .select("handle, display_name, bio, avatar_url")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        if (data.handle) setHandle(data.handle);
        if (data.display_name) setDisplayName(data.display_name);
        if (data.bio) setBio(data.bio);
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [userId]);

  // ── Gestion avatar ─────────────────────────────────────────
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  // ── Sauvegarde profil ──────────────────────────────────────
  async function handleSaveProfile() {
    if (!handle.trim()) {
      setSaveError("Le handle est requis.");
      return;
    }

    setSaveStatus("saving");
    setSaveError(null);

    try {
      let finalAvatarUrl = avatarUrl;

      // Upload avatar si nouveau fichier
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() ?? "jpg";
        const path = `avatars/${userId}.${ext}`;
        const { error: upErr } = await sb.storage
          .from("profiles")
          .upload(path, avatarFile, { upsert: true });

        if (upErr) throw new Error("Erreur upload avatar : " + upErr.message);

        const { data: urlData } = sb.storage
          .from("profiles")
          .getPublicUrl(path);
        finalAvatarUrl = urlData.publicUrl ?? null;
      }

      // Upsert dans la table profiles
      const { error: upsertErr } = await sb.from("profiles").upsert({
        id: userId,
        email: userEmail,
        handle: handle.trim().replace(/^@/, ""),
        display_name: displayName.trim(),
        bio: bio.trim(),
        avatar_url: finalAvatarUrl,
      });

      if (upsertErr) throw new Error(upsertErr.message);

      // Mettre à jour user_metadata Supabase Auth
      await sb.auth.updateUser({
        data: {
          full_name: displayName.trim(),
          avatar_url: finalAvatarUrl,
        },
      });

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

  // ── Changement de mot de passe ─────────────────────────────
  async function handleChangePwd() {
    if (!newPwd || newPwd.length < 6) {
      setPwdError("Mot de passe trop court (6 caractères min).");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }

    setPwdStatus("saving");
    setPwdError(null);

    const { error } = await sb.auth.updateUser({ password: newPwd });
    if (error) {
      setPwdError(error.message);
      setPwdStatus("error");
      return;
    }

    setNewPwd("");
    setConfirmPwd("");
    setPwdStatus("success");
    setTimeout(() => setPwdStatus("idle"), 3000);
  }

  const effectiveAvatar = avatarPreview ?? avatarUrl;
  const initial = (displayName[0] ?? handle[0] ?? userEmail[0] ?? "?").toUpperCase();

  return (
    <div className="space-y-6">

      {/* ── Bloc Avatar + Identité ── */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Identité publique
        </h2>

        {/* Avatar */}
        <div className="mb-5 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
              {effectiveAvatar ? (
                <img
                  src={effectiveAvatar}
                  alt={displayName || handle}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-brand-600">
                  {initial}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-sm hover:bg-slate-700 transition-colors"
              aria-label="Changer l'avatar"
            >
              <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-slate-900">
              {displayName || handle || userEmail}
            </p>
            <p className="text-xs text-slate-500">
              {handle ? `@${handle.replace(/^@/, "")}` : userEmail}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 text-xs text-brand-600 hover:underline"
            >
              Changer la photo
            </button>
          </div>
        </div>

        {/* Champs */}
        <div className="space-y-3">

          {/* Handle */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">
              Handle (identifiant public)
            </label>
            <div className="relative">
              <AtSign
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={handle.replace(/^@/, "")}
                onChange={(e) =>
                  setHandle(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, ""))
                }
                placeholder="ton_handle"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Lettres, chiffres, _ et . uniquement. Visible dans Meet me.
            </p>
          </div>

          {/* Nom affiché */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">
              Nom affiché
            </label>
            <div className="relative">
              <UserRound
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ton prénom ou nom de scène"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">
              Bio
            </label>
            <div className="relative">
              <FileText
                className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400"
                strokeWidth={1.5}
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Coiffeuse, coloriste, passionnée de transformations..."
                rows={3}
                maxLength={200}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 resize-none"
              />
            </div>
            <p className="text-right text-[11px] text-slate-400">
              {bio.length}/200
            </p>
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
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
            Profil mis à jour avec succès.
          </div>
        )}

        {/* CTA Sauvegarder */}
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={saveStatus === "saving"}
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            {saveStatus === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
            )}
            {saveStatus === "saving" ? "Sauvegarde…" : "Sauvegarder le profil"}
          </span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Bloc Mot de passe ── */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Changer le mot de passe
        </h2>

        <div className="space-y-3">
          {/* Nouveau MDP */}
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.5}
            />
            <input
              type={showPwd ? "text" : "password"}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPwd ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Confirmation */}
          <div>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.5}
              />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Confirme le mot de passe"
                className={`w-full rounded-xl border bg-slate-50/60 py-3 pl-10 pr-10 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-100 ${
                  confirmPwd.length === 0
                    ? "border-slate-200 focus:border-slate-400"
                    : confirmPwd === newPwd
                    ? "border-emerald-300 focus:border-emerald-400"
                    : "border-red-300 focus:border-red-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
            {confirmPwd.length > 0 && (
              <p
                className={`mt-1.5 text-xs ${
                  confirmPwd === newPwd ? "text-emerald-500" : "text-red-400"
                }`}
              >
                {confirmPwd === newPwd
                  ? "Les mots de passe correspondent"
                  : "Les mots de passe ne correspondent pas"}
              </p>
            )}
          </div>
        </div>

        {/* Feedback MDP */}
        {pwdError && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
            {pwdError}
          </div>
        )}
        {pwdStatus === "success" && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" strokeWidth={1.5} />
            Mot de passe mis à jour.
          </div>
        )}

        <button
          type="button"
          onClick={handleChangePwd}
          disabled={pwdStatus === "saving" || !newPwd || newPwd !== confirmPwd}
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            {pwdStatus === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Lock className="h-4 w-4" strokeWidth={1.5} />
            )}
            {pwdStatus === "saving" ? "Mise à jour…" : "Changer le mot de passe"}
          </span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

    </div>
  );
}
