// app/notifications/page.tsx
"use client";

import { useState } from "react";
import BackButton from "@/components/navigation/BackButton";

type NotificationType = "activity" | "earnings" | "system";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread?: boolean;
  avatarInitial?: string;
};

const NOTIFICATIONS_TODAY: NotificationItem[] = [
  {
    id: "n1",
    type: "earnings",
    title: "Nouvel abonnement",
    message: "@color_artist vient de s’abonner à tes contenus premium.",
    time: "Il y a 8 min",
    unread: true,
    avatarInitial: "C",
  },
  {
    id: "n2",
    type: "activity",
    title: "Nouveau commentaire",
    message: "@curlyqueen a commenté ton Magic Studio “Balayage caramel”.",
    time: "Il y a 23 min",
    unread: true,
    avatarInitial: "Q",
  },
];

const NOTIFICATIONS_THIS_WEEK: NotificationItem[] = [
  {
    id: "n3",
    type: "activity",
    title: "Nouveaux likes",
    message:
      "18 personnes ont aimé ton Magic Display “Carte des blonds froids”.",
    time: "Hier",
    avatarInitial: "❤",
  },
  {
    id: "n4",
    type: "earnings",
    title: "Vente PPV",
    message:
      "@studio_paris a acheté ton contenu PPV “Correction cuivre intense”.",
    time: "Lundi",
    avatarInitial: "S",
  },
];

const NOTIFICATIONS_EARLIER: NotificationItem[] = [
  {
    id: "n5",
    type: "system",
    title: "Mise à jour de la plateforme",
    message:
      "Nous avons mis à jour les CGV et la Politique de confidentialité de Magic Clock.",
    time: "16 novembre",
    avatarInitial: "MC",
  },
];

const gradientByType: Record<NotificationType, string> = {
  activity: "bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-500",
  earnings: "bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-400",
  system: "bg-gradient-to-tr from-slate-500 via-slate-600 to-slate-800",
};

function NotificationCard({ item }: { item: NotificationItem }) {
  const gradient = gradientByType[item.type] ?? "bg-slate-900";

  return (
    <article className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-4">
      <div
        className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${gradient}`}
      >
        {item.avatarInitial ?? "MC"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {item.title}
          </h3>
          {item.unread && (
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
              Nouveau
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-600">{item.message}</p>
        <p className="mt-1 text-[11px] text-slate-400">{item.time}</p>
      </div>
    </article>
  );
}

export default function NotificationsPage() {
  const [showBanner, setShowBanner] = useState(true);

  const totalCount =
    NOTIFICATIONS_TODAY.length +
    NOTIFICATIONS_THIS_WEEK.length +
    NOTIFICATIONS_EARLIER.length;

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8">
      {/* Flèche retour vers My Magic */}
      <div className="mb-3">
        <BackButton fallbackHref="/mymagic" label="Retour à My Magic" />
      </div>

      {/* Carte principale */}
      <section className="mt-1 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5 lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
            Notifications
          </h1>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {totalCount} événements
          </span>
        </div>

        {/* Filtres visuels */}
        <section className="mb-5 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
            Tout
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-700">
            Activité
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-700">
            Revenus
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-700">
            Système
          </span>
        </section>

        {/* Aujourd’hui */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Aujourd’hui
          </h2>
          <div className="space-y-3">
            {NOTIFICATIONS_TODAY.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Cette semaine */}
        <section className="mt-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Cette semaine
          </h2>
          <div className="space-y-3">
            {NOTIFICATIONS_THIS_WEEK.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Plus tôt */}
        <section className="mt-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Plus tôt
          </h2>
          <div className="space-y-3">
            {NOTIFICATIONS_EARLIER.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </section>

      {/* Bannière d’activation */}
      {showBanner && (
        <section className="fixed inset-x-0 bottom-[72px] z-20 px-4 pb-4 sm:bottom-6 sm:flex sm:justify-center sm:px-0">
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-slate-50/95 p-4 shadow-lg backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500 text-white shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    d="M12 3a5 5 0 00-5 5v2.586c0 .265-.105.52-.293.707L5 14h14l-1.707-2.707A1 1 0 0117 10.586V8a5 5 0 00-5-5z"
                    fill="currentColor"
                  />
                  <path d="M10 18a2 2 0 004 0h-4z" fill="currentColor" />
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Activer les notifications Magic Clock ?
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Reste informé·e en temps réel des nouveaux abonnements, ventes
                  PPV, likes et commentaires sur tes contenus. Tu pourras
                  modifier ce choix plus tard dans les paramètres.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    onClick={() => setShowBanner(false)}
                  >
                    Plus tard
                  </button>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Activer les notifications
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  En continuant, tu acceptes de recevoir des notifications
                  liées à ton activité Magic Clock. Aucune pub, uniquement de
                  l’activité utile.
                </p>
              </div>

              <button
                type="button"
                className="ml-2 mt-1 text-slate-400 hover:text-slate-600"
                onClick={() => setShowBanner(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
