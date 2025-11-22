"use client";

import React, { useMemo, useState } from "react";

const CURRENCY = "CHF";

// Formatage simple de montants
function formatMoney(value: number): string {
  return value.toLocaleString("fr-CH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const VAT_RATE = 0.081; // TVA indicative (8.1 %)

// Seuils palliers commission en fonction des likes
function getTierFromLikes(likes: number) {
  if (likes > 10000) return { tier: "gold" as const, rate: 0.2 };
  if (likes > 1000) return { tier: "silver" as const, rate: 0.25 };
  return { tier: "bronze" as const, rate: 0.3 };
}

export default function MonetPage() {
  // -------------------------
  // 1) Données "réelles" mockées (haut de page)
  // -------------------------
  const realFollowers = 12000;
  const realSubPrice = 9.99;
  const realSubConv = 0.5; // 50 %
  const realPpvPrice = 9.99;
  const realPpvConv = 0.3; // 30 %
  const realPpvPerBuyer = 3.2;
  const realLikes = 4200;

  const { rate: realCommissionRate } = getTierFromLikes(realLikes);

  const realSubsCount = realFollowers * realSubConv;
  const realMRR = realSubsCount * realSubPrice;

  const realPpvBuyers = realFollowers * realPpvConv;
  const realPPVRevenue = realPpvBuyers * realPpvPerBuyer * realPpvPrice;

  const realGross = realMRR + realPPVRevenue;
  const realPlatformFees = realGross * realCommissionRate;
  const realVat = realGross * VAT_RATE;
  const realNet = realGross - realPlatformFees - realVat;

  const realAboShare =
    realGross > 0 ? Math.round((realMRR / realGross) * 100) : 0;
  const realPpvShare = 100 - realAboShare;

  // -------------------------
  // 2) État du simulateur
  // -------------------------
  const [followers, setFollowers] = useState<number>(realFollowers);
  const [subPrice, setSubPrice] = useState<number>(realSubPrice);
  const [subConv, setSubConv] = useState<number>(50); // %
  const [ppvPrice, setPpvPrice] = useState<number>(realPpvPrice);
  const [ppvConv, setPpvConv] = useState<number>(30); // %
  const [ppvPerBuyer, setPpvPerBuyer] = useState<number>(realPpvPerBuyer);
  const [likes, setLikes] = useState<number>(realLikes);

  const {
    tier: simTier,
    rate: simCommissionRate,
  } = useMemo(() => getTierFromLikes(likes), [likes]);

  const simStats = useMemo(() => {
    const subsCount = (followers * subConv) / 100;
    const mrr = subsCount * subPrice;

    const ppvBuyers = (followers * ppvConv) / 100;
    const ppvRevenue = ppvBuyers * ppvPerBuyer * ppvPrice;

    const gross = mrr + ppvRevenue;
    const platformFees = gross * simCommissionRate;
    const vat = gross * VAT_RATE;
    const net = gross - platformFees - vat;

    const aboShare = gross > 0 ? (mrr / gross) * 100 : 0;
    const ppvShare = 100 - aboShare;

    return {
      mrr,
      ppvRevenue,
      gross,
      net,
      aboShare,
      ppvShare,
    };
  }, [followers, subConv, subPrice, ppvConv, ppvPerBuyer, ppvPrice, simCommissionRate]);

  // Courbe d’évolution simulée (simple jeu de points autour du net simulé)
  const evolutionPoints = useMemo(() => {
    const base = simStats.net || 0;
    const months = 12;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < months; i++) {
      const factor = 0.6 + (i / (months - 1)) * 0.9; // ~ +50 % sur la période
      points.push({ x: i, y: base * factor });
    }
    return points;
  }, [simStats.net]);

  const maxEvolutionY =
    evolutionPoints.reduce((max, p) => Math.max(max, p.y), 0) || 1;

  // -------------------------
  // Rendu
  // -------------------------
  return (
    <div className="container mx-auto max-w-6xl py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Monétisation — Cockpit</h1>
        <p className="text-sm text-slate-600">
          Visualise le potentiel de revenus de tes Magic Clock en fonction de
          ton audience et de tes réglages.
        </p>
      </header>

      {/* ------------- SECTION 1 : DONNÉES RÉELLES ------------- */}
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Données réelles (exemple MVP)
        </p>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Revenus abonnements */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>REVENUS ABONNEMENTS (MRR)</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                <span className="inline-block rotate-45">▲</span> +4.10 %
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold">
              {formatMoney(realMRR)} {CURRENCY}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {realFollowers.toLocaleString("fr-CH")} followers ·{" "}
              {(realSubConv * 100).toFixed(1)} % de conversion
            </p>
          </div>

          {/* Revenus PPV */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>REVENUS PPV</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                <span className="inline-block rotate-45">▲</span> +4.10 %
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold">
              {formatMoney(realPPVRevenue)} {CURRENCY}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {(realPpvConv * 100).toFixed(1)} % achètent au moins un PPV ·{" "}
              {realPpvPerBuyer.toFixed(1)} PPV / acheteur / mois
            </p>
          </div>

          {/* Chiffre d'affaires brut */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>CHIFFRE D&apos;AFFAIRES (BRUT TTC)</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                <span className="inline-block rotate-45">▲</span> +4.10 %
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold">
              {formatMoney(realGross)} {CURRENCY}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Commission plateforme{" "}
              {(realCommissionRate * 100).toFixed(0)} % · TVA{" "}
              {(VAT_RATE * 100).toFixed(1)} %
            </p>
          </div>

          {/* Revenu net créateur */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>REVENU NET CRÉATEUR (ESTIMATION)</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                <span className="inline-block rotate-45">▲</span> +4.10 %
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold">
              {formatMoney(realNet)} {CURRENCY}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Après commission Magic Clock &amp; TVA (approx.).
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          MVP : ces chiffres sont des exemples basés sur des hypothèses internes.
          Dans la version complète, ils seront calculés à partir de tes vrais
          contenus et de tes ventes.
        </p>
      </section>

      {/* Séparateur SIMULATEUR */}
      <div className="flex items-center gap-3 pt-4">
        <div className="h-px flex-1 bg-slate-200" />
        <div className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-600">
          🎛 Simulateur — n&apos;impacte pas ton compte réel
        </div>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* ------------- SECTION 2 : SIMULATEUR ------------- */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
        {/* Colonne gauche : Mix + courbe */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Mix revenus (simulation)</h2>
              <p className="text-xs text-slate-500">
                Répartition entre abonnements et contenus PPV pour ce scénario.
              </p>
            </div>
            <div className="text-[11px] text-slate-400">
              Abos : {simStats.aboShare.toFixed(1)} % · PPV :{" "}
              {simStats.ppvShare.toFixed(1)} %
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Donut */}
            <div className="flex items-center justify-center md:w-1/2">
              <div className="relative h-40 w-40">
                {/* Cercle externe */}
                <div className="absolute inset-0 rounded-full bg-slate-100" />
                {/* Segment ABO */}
                <svg
                  viewBox="0 0 36 36"
                  className="absolute inset-1 h-[152px] w-[152px]"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeDasharray={`${simStats.aboShare} 100`}
                    strokeDashoffset="25"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Centre */}
                <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-white text-center">
                  <p className="text-[11px] font-semibold text-slate-500">
                    Abo / PPV
                  </p>
                  <p className="text-[10px] text-slate-400">Répartition</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {simStats.aboShare.toFixed(0)} % abo
                  </p>
                </div>
              </div>
            </div>

            {/* Légende */}
            <div className="space-y-3 md:w-1/2">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  <p className="font-medium">
                    Abonnements récurrents — {simStats.aboShare.toFixed(1)} %
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  Revenus mensuels stables liés à ton offre d&apos;abonnement.
                </p>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  <p className="font-medium">
                    PPV (Pay-Per-View) — {simStats.ppvShare.toFixed(1)} %
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  Revenus liés aux contenus premium débloqués à l&apos;achat.
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                Dans la version complète, ce graphique sera directement lié à
                tes Magic Clock (performances réelles par contenu).
              </p>
            </div>
          </div>

          {/* Petite courbe d'évolution */}
          <div className="pt-3 border-t border-slate-100">
            <p className="mb-2 text-xs font-medium text-slate-500">
              Évolution simulée du revenu net (12 périodes)
            </p>
            <div className="h-24 w-full rounded-xl bg-slate-50 px-3 py-2">
              <svg viewBox="0 0 100 40" className="h-full w-full">
                {/* Fond */}
                <defs>
                  <linearGradient
                    id="simLine"
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="url(#simLine)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  points={evolutionPoints
                    .map((p, i) => {
                      const x = (i / Math.max(evolutionPoints.length - 1, 1)) * 100;
                      const y = 40 - (p.y / maxEvolutionY) * 32 - 4;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              </svg>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Courbe indicative : elle grossit avec le revenu net simulé. Dans
              la V2, elle pourra afficher jour / semaine / mois.
            </p>
          </div>
        </div>

        {/* Colonne droite : Paramètres simulateur */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Paramètres simulateur</h2>
          <p className="text-xs text-slate-500">
            Ajuste ces paramètres pour voir l&apos;impact sur tes revenus
            potentiels. Cette zone est 100 % sandbox.
          </p>

          {/* Followers */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium">Followers</p>
              <p className="text-[11px] text-slate-500">
                {followers.toLocaleString("fr-CH")}
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={1000000}
              value={followers}
              onChange={(e) => setFollowers(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-slate-400">
              Aucune limite technique : utilise le champ numérique pour aller
              au-delà de 1&nbsp;M si besoin.
            </p>
          </div>

          {/* Prix abo */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium">Prix abo / mois ({CURRENCY})</p>
              <p className="text-[11px] text-slate-500">
                {subPrice.toFixed(2)} {CURRENCY}
              </p>
            </div>
            <input
              type="range"
              min={0.99}
              max={999}
              step={0.01}
              value={subPrice}
              onChange={(e) => setSubPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Conversion abo */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium">Conversion abonnements (%)</p>
              <p className="text-[11px] text-slate-500">
                {subConv.toFixed(1)} %
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={subConv}
              onChange={(e) => setSubConv(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-slate-400">
              Part de tes followers qui prennent un abonnement.
            </p>
          </div>

          {/* Prix PPV */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium">Prix PPV ({CURRENCY})</p>
              <p className="text-[11px] text-slate-500">
                {ppvPrice.toFixed(2)} {CURRENCY}
              </p>
            </div>
            <input
              type="range"
              min={0.99}
              max={999}
              step={0.01}
              value={ppvPrice}
              onChange={(e) => setPpvPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Conversion PPV */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium">Conversion PPV (%)</p>
              <p className="text-[11px] text-slate-500">
                {ppvConv.toFixed(1)} %
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={ppvConv}
              onChange={(e) => setPpvConv(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-slate-400">
              Part de tes followers qui achètent au moins un PPV.
            </p>
          </div>

          {/* PPV / acheteur / mois */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium">PPV / acheteur / mois</p>
              <p className="text-[11px] text-slate-500">
                {ppvPerBuyer.toFixed(1)}
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={0.1}
              value={ppvPerBuyer}
              onChange={(e) => setPpvPerBuyer(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-slate-400">
              Nombre moyen de contenus PPV achetés chaque mois.
            </p>
          </div>

          {/* Likes & palliers commission */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium">Likes (simulation)</p>
              <p className="text-[11px] text-slate-500">
                {likes.toLocaleString("fr-CH")} likes
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={20000}
              value={likes}
              onChange={(e) => setLikes(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-slate-400">
              Utilise ce curseur pour voir comment les likes débloquent les
              paliers de commission.
            </p>

            {/* Barre linéaire Bronze / Argent / Or */}
            <div className="space-y-1">
              <div className="relative h-2 w-full rounded-full bg-slate-100">
                <div className="absolute inset-y-0 left-0 w-[30%] rounded-l-full bg-amber-300/70" />
                <div className="absolute inset-y-0 left-[30%] w-[35%] bg-slate-300/70" />
                <div className="absolute inset-y-0 right-0 w-[35%] rounded-r-full bg-yellow-400/80" />
                {/* Curseur de position likes */}
                <div
                  className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border border-white bg-violet-500 shadow"
                  style={{
                    left: `${Math.min(100, (likes / 20000) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0–1 000 · Bronze 30 %</span>
                <span>1 001–10 000 · Argent 25 %</span>
                <span>10 001+ · Or 20 %</span>
              </div>
            </div>

            {/* Cartes paliers */}
            <div className="grid gap-2 md:grid-cols-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-2">
                <p className="flex items-center justify-between text-[11px] font-semibold text-amber-700">
                  Bronze
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Actif
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-slate-700">
                  Commission 30 %. Palier de base pour tous les créateurs.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <p className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  Argent
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {likes > 1000 ? "Débloqué" : "Bloqué"}
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Commission 25 %. Débloqué à partir de 1 001 likes cumulés.
                </p>
              </div>
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-2">
                <p className="flex items-center justify-between text-[11px] font-semibold text-yellow-800">
                  Or
                  <span className="rounded-full bg-yellow-200 px-2 py-0.5 text-[10px] font-semibold text-yellow-800">
                    {likes > 10000 ? "Débloqué" : "Bloqué"}
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-slate-700">
                  Commission 20 %. Réservé aux créateurs les plus engagés.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Dans le MVP, la commission réelle sera définie côté plateforme.
              Ici tu explores simplement l&apos;impact des différents paliers sur
              ton revenu net simulé.
            </p>
          </div>

          {/* Résumé rapide du scénario simulé */}
          <div className="mt-2 rounded-xl bg-indigo-50/80 p-3 text-xs text-indigo-900">
            <p className="font-semibold">
              Résumé scénario simulé — Revenu net estimé :{" "}
              {formatMoney(simStats.net)} {CURRENCY}
            </p>
            <p className="mt-1 text-[11px]">
              MRR abo : {formatMoney(simStats.mrr)} {CURRENCY} · Revenus PPV :{" "}
              {formatMoney(simStats.ppvRevenue)} {CURRENCY} · Commission
              plateforme simulée : {(simCommissionRate * 100).toFixed(0)} % (
              {simTier === "bronze"
                ? "Bronze"
                : simTier === "silver"
                ? "Argent"
                : "Or"}
              ).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
