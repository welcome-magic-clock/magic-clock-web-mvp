"use client";

import { useState } from "react";

export default function MonetisationPage() {
  // Paramètres de base du simulateur
  const [followers, setFollowers] = useState(10000);
  const [aboRate, setAboRate] = useState(2); // % des followers qui prennent un abo
  const [ppvRate, setPpvRate] = useState(1); // % des followers qui achètent un PPV
  const [aboPrice, setAboPrice] = useState(9.9); // prix moyen abo / mois
  const [ppvPrice, setPpvPrice] = useState(14.9); // prix moyen PPV
  const [ppvPerMonth, setPpvPerMonth] = useState(1); // PPV moyens achetés / mois / client

  // Calculs
  const safeFollowers = isNaN(followers) ? 0 : followers;
  const safeAboRate = isNaN(aboRate) ? 0 : aboRate;
  const safePpvRate = isNaN(ppvRate) ? 0 : ppvRate;
  const safeAboPrice = isNaN(aboPrice) ? 0 : aboPrice;
  const safePpvPrice = isNaN(ppvPrice) ? 0 : ppvPrice;
  const safePpvPerMonth = isNaN(ppvPerMonth) ? 0 : ppvPerMonth;

  const aboClients = Math.round(safeFollowers * (safeAboRate / 100));
  const ppvClients = Math.round(safeFollowers * (safePpvRate / 100));

  const monthlyAboGross = aboClients * safeAboPrice;
  const monthlyPpvGross = ppvClients * safePpvPrice * safePpvPerMonth;
  const monthlyTotalGross = monthlyAboGross + monthlyPpvGross;

  const creatorShare = monthlyTotalGross * 0.8; // 80 % créateur
  const platformShare = monthlyTotalGross * 0.2; // 20 % Magic Clock
  const yearlyTotalGross = monthlyTotalGross * 12;
  const yearlyCreatorShare = creatorShare * 12;

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: "CHF",
      maximumFractionDigits: 0,
    }).format(Math.round(value || 0));

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      {/* Entête */}
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">Monétisation — Cockpit</h1>
        <p className="text-sm text-slate-600">
          Visualise l&apos;impact de ton audience et le potentiel financier de
          tes contenus sur Magic Clock (abonnements + PPV).
        </p>
      </header>

      {/* Synthèse rapide */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm">
          <p className="text-xs text-slate-500">Revenu mensuel potentiel</p>
          <p className="mt-1 text-lg font-semibold">
            {formatMoney(monthlyCreatorShare)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Part créateur (80 %), après commission Magic Clock.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm">
          <p className="text-xs text-slate-500">Revenu annuel potentiel</p>
          <p className="mt-1 text-lg font-semibold">
            {formatMoney(yearlyCreatorShare)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Si tu maintiens ce rythme sur 12 mois.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm">
          <p className="text-xs text-slate-500">Audience activée</p>
          <p className="mt-1 text-lg font-semibold">
            {aboClients + ppvClients}{" "}
            <span className="text-xs font-normal text-slate-500">
              clients / mois
            </span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {aboClients} en abonnements · {ppvClients} en PPV.
          </p>
        </div>
      </section>

      {/* Grille principale : paramètres + résultats détaillés */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Colonne gauche : paramètres / simulateur */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm">
          <h2 className="text-sm font-semibold">Paramètres de ton audience</h2>

          {/* Followers */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-xs text-slate-600">
              <span>Followers actifs (toutes plateformes)</span>
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={followers}
              onChange={(e) => setFollowers(Number(e.target.value || 0))}
            />
          </div>

          {/* Taux de conversion */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs text-slate-600">
                <span>% de followers qui prennent un abonnement</span>
              </label>
              <input
                type="number"
                min={0}
                max={100}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={aboRate}
                onChange={(e) => setAboRate(Number(e.target.value || 0))}
              />
            </div>
            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs text-slate-600">
                <span>% de followers qui achètent du PPV</span>
              </label>
              <input
                type="number"
                min={0}
                max={100}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={ppvRate}
                onChange={(e) => setPpvRate(Number(e.target.value || 0))}
              />
            </div>
          </div>

          {/* Prix & fréquence */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs text-slate-600">
                <span>Prix moyen abonnement / mois</span>
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={aboPrice}
                onChange={(e) => setAboPrice(Number(e.target.value || 0))}
              />
            </div>
            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs text-slate-600">
                <span>Prix moyen d&apos;un contenu PPV</span>
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={ppvPrice}
                onChange={(e) => setPpvPrice(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Nombre moyen de contenus PPV achetés par client / mois
              </span>
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={ppvPerMonth}
              onChange={(e) => setPpvPerMonth(Number(e.target.value || 0))}
            />
          </div>

          <p className="pt-2 text-[11px] text-slate-500">
            Tu peux ajuster librement ces paramètres pour tester différents
            scénarios : lancement, croissance, campagnes spéciales, etc.
          </p>
        </div>

        {/* Colonne droite : résultats détaillés */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm">
          <h2 className="text-sm font-semibold">Résultats détaillés</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Clients abonnés</p>
                <p className="text-sm font-medium">{aboClients}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  Revenu mensuel brut (abos)
                </p>
                <p className="text-sm font-semibold">
                  {formatMoney(monthlyAboGross)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div>
                <p className="text-xs text-slate-500">Clients PPV actifs</p>
                <p className="text-sm font-medium">{ppvClients}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  Revenu mensuel brut (PPV)
                </p>
                <p className="text-sm font-semibold">
                  {formatMoney(monthlyPpvGross)}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Total mensuel brut</p>
                <p className="text-sm font-semibold">
                  {formatMoney(monthlyTotalGross)}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Part créateur (80 %)</span>
                <span className="font-semibold text-slate-800">
                  {formatMoney(creatorShare)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>Commission Magic Clock (20 %)</span>
                <span>{formatMoney(platformShare)}</span>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-slate-50/80 p-3 text-[11px] text-slate-600">
              Ce simulateur est purement indicatif. Le but est de te montrer
              qu&apos;avec une communauté engagée, quelques contenus bien
              pensés peuvent déjà générer un revenu récurrent intéressant.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
