
'use client';
import { useMemo, useState } from "react";
import { COMMISSION_RATE } from "@/core/config/constants";
export default function Cockpit(){
  const [followers, setFollowers] = useState(25000);
  const [convAbo, setConvAbo] = useState(2.5);
  const [convPpv, setConvPpv] = useState(4.0);
  const [priceAbo, setPriceAbo] = useState(6.90);
  const [ppvPerBuyer, setPpvPerBuyer] = useState(1.2);
  const [pricePpv, setPricePpv] = useState(2.90);
  const [vat, setVat] = useState(9);

  const mrr = useMemo(()=> followers*(convAbo/100)*priceAbo, [followers, convAbo, priceAbo]);
  const ppv = useMemo(()=> followers*(convPpv/100)*ppvPerBuyer*pricePpv, [followers, convPpv, ppvPerBuyer, pricePpv]);
  const gross = mrr + ppv;
  const commission = gross * COMMISSION_RATE;
  const vatAmount = gross * (vat/100);
  const netCreator = gross - commission + (0 - vatAmount); // mock aproximatif

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="card p-4"><div className="font-semibold">Revenus abonnements (MRR)</div><div className="text-2xl font-bold">{mrr.toFixed(2)} CHF</div></div>
      <div className="card p-4"><div className="font-semibold">Revenus PPV</div><div className="text-2xl font-bold">{ppv.toFixed(2)} CHF</div></div>
      <div className="card p-4"><div className="font-semibold">Revenu net créateur</div><div className="text-2xl font-bold">{netCreator.toFixed(2)} CHF</div></div>

      <div className="card p-4 col-span-2">
        <div className="font-semibold mb-2">Paramètres</div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <label>Followers ({followers})<input type="range" min={0} max={100000} value={followers} onChange={e=>setFollowers(parseInt(e.target.value))}/></label>
          <label>Conv. abonnement (%) ({convAbo})<input type="range" min={0} max={100} step="0.1" value={convAbo} onChange={e=>setConvAbo(parseFloat(e.target.value))}/></label>
          <label>Conv. PPV (%) ({convPpv})<input type="range" min={0} max={100} step="0.1" value={convPpv} onChange={e=>setConvPpv(parseFloat(e.target.value))}/></label>
          <label>Prix abo (CHF) ({priceAbo})<input type="range" min={0.99} max={99.0} step="0.1" value={priceAbo} onChange={e=>setPriceAbo(parseFloat(e.target.value))}/></label>
          <label>PPV/acheteur/mois ({ppvPerBuyer})<input type="range" min={0.1} max={10} step="0.1" value={ppvPerBuyer} onChange={e=>setPpvPerBuyer(parseFloat(e.target.value))}/></label>
          <label>Prix PPV (CHF) ({pricePpv})<input type="range" min={0.99} max={99.0} step="0.1" value={pricePpv} onChange={e=>setPricePpv(parseFloat(e.target.value))}/></label>
          <label>TVA (%) ({vat})<input type="range" min={0} max={25} step="0.1" value={vat} onChange={e=>setVat(parseFloat(e.target.value))}/></label>
        </div>
      </div>
      <div className="card p-4"><div className="font-semibold mb-2">Mix revenus</div><div className="text-sm">Calculs simplifiés pour MVP (à affiner).</div></div>
    </div>
  );
}
