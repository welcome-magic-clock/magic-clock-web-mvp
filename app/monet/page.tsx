"use client"
import { useMemo, useState } from "react"

function fmt(n:number) {
  return new Intl.NumberFormat("fr-CH", { style:"currency", currency:"CHF", maximumFractionDigits:2 }).format(n)
}

export default function MonetPage() {
  const [followers, setFollowers] = useState(25000)
  const [convAbo, setConvAbo] = useState(2.5)
  const [convPpv, setConvPpv] = useState(4.0)
  const [priceAbo, setPriceAbo] = useState(6.90)
  const [ppvPerBuyer, setPpvPerBuyer] = useState(1.2)
  const [pricePpv, setPricePpv] = useState(2.90)
  const [commission, setCommission] = useState(20)
  const [tva, setTva] = useState(9)

  const calc = useMemo(()=>{
    const abo = followers * (convAbo/100) * priceAbo
    const buyers = followers * (convPpv/100)
    const ppv = buyers * ppvPerBuyer * pricePpv
    const brut = abo + ppv
    const fee = brut * (commission/100)
    const ht = brut - fee
    const tvaAmt = ht * (tva/100)
    const net = ht - tvaAmt
    const mixAbo = brut ? Math.round((abo/brut)*100) : 0
    return { abo, ppv, brut, fee, ht, tvaAmt, net, mixAbo }
  }, [followers, convAbo, convPpv, priceAbo, ppvPerBuyer, pricePpv, commission, tva])

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-black">Monéti — Cockpit (clair)</h1>
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-sm text-slate-600">Revenus abonnements (MRR)</div>
          <div className="text-2xl font-extrabold">{fmt(calc.abo)}</div>
          <div className="text-xs text-slate-500">Followers: {followers.toLocaleString()} · conv {convAbo}% · prix {fmt(priceAbo)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-sm text-slate-600">Revenus PPV</div>
          <div className="text-2xl font-extrabold">{fmt(calc.ppv)}</div>
          <div className="text-xs text-slate-500">Conv {convPpv}% · {ppvPerBuyer} PPV/acheteur · prix {fmt(pricePpv)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-sm text-slate-600">Revenu net créateur</div>
          <div className="text-2xl font-extrabold">{fmt(calc.net)}</div>
          <div className="text-xs text-slate-500">Après commission {commission}% + TVA {tva}%</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-2 text-sm font-semibold">Paramètres simulateur</div>
          <div className="space-y-3 text-sm">
            <label className="block">Followers: {followers.toLocaleString()}<input type="range" min={0} max={200000} value={followers} onChange={e=>setFollowers(Number(e.target.value))} className="w-full" /></label>
            <label className="block">Conv. abonnement (%): {convAbo}%<input type="range" min={0} max={100} step={0.1} value={convAbo} onChange={e=>setConvAbo(Number(e.target.value))} className="w-full" /></label>
            <label className="block">Conv. PPV (%): {convPpv}%<input type="range" min={0} max={100} step={0.1} value={convPpv} onChange={e=>setConvPpv(Number(e.target.value))} className="w-full" /></label>
            <label className="block">PPV / acheteur / mois: {ppvPerBuyer}<input type="range" min={0} max={10} step={0.1} value={ppvPerBuyer} onChange={e=>setPpvPerBuyer(Number(e.target.value))} className="w-full" /></label>
            <label className="block">Prix abo / mois: {priceAbo.toFixed(2)} CHF<input type="range" min={0} max={100} step={0.1} value={priceAbo} onChange={e=>setPriceAbo(Number(e.target.value))} className="w-full" /></label>
            <label className="block">Prix PPV: {pricePpv.toFixed(2)} CHF<input type="range" min={0} max={100} step={0.1} value={pricePpv} onChange={e=>setPricePpv(Number(e.target.value))} className="w-full" /></label>
            <label className="block">Commission plateforme (%): {commission}%<input type="range" min={0} max={100} value={commission} onChange={e=>setCommission(Number(e.target.value))} className="w-full" /></label>
            <label className="block">TVA (%): {tva}%<input type="range" min={0} max={100} value={tva} onChange={e=>setTva(Number(e.target.value))} className="w-full" /></label>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-1 text-sm text-slate-600">Chiffre d'affaires (brut)</div>
          <div className="text-xl font-bold">{fmt(calc.brut)}</div>
          <div className="text-xs text-slate-500">Commission: {fmt(calc.fee)} · TVA: {fmt(calc.tvaAmt)}</div>
          <div className="mt-3 text-sm text-slate-700">Mix revenus: <b>{calc.mixAbo}% abo / {100-calc.mixAbo}% PPV</b></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-sm text-slate-600">TVA & Totaux</div>
          <div className="text-xs text-slate-600">HT: {fmt(calc.ht)} · TVA: {fmt(calc.tvaAmt)} · TTC {fmt(calc.ht + calc.tvaAmt)}</div>
          <div className="mt-2 text-green-600">↑ Flèches de progression sur prochaines itérations</div>
        </div>
      </div>
    </main>
  )
}