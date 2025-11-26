// app/notifications/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications – Magic Clock",
};

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

function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-4">
      {/* Avatar */}
      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
        {item.avatarInitial ?? "MC"}
      </div>

      {/* Texte */}
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
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-4 sm:mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Suis en un coup d’œil l’activité autour de tes contenus Magic Clock :
          likes, abonnements, achats PPV et messages importants de la
          plateforme.
        </p>
      </header>

      {/* Bannière : activer les notifications (MVP visuel, non fonctionnel) */}
      <section className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-slate-700 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-lg">
            🔔
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Activer les notifications Magic Clock ?
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Reste informé·e en temps réel des nouveaux abonnements, ventes
              PPV, likes et commentaires sur tes contenus. Tu pourras modifier
              ce choix plus tard dans les paramètres.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Plus tard
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Activer les notifications
              </button>
            </div>
          </div>
        </div>
        {/* 
          NOTE MVP :
          Ces boutons sont uniquement visuels pour l’instant.
          Plus tard, on pourra :
          - déclencher une vraie demande de permission navigateur / mobile,
          - enregistrer le choix de l’utilisateur dans le backend.
        */}
      </section>

      {/* Filtres visuels (non interactifs en MVP) */}
      <section className="mb-6 flex flex-wrap gap-2 text-xs">
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
    </main>
  );
}
