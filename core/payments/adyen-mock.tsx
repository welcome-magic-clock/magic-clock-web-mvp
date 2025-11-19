
'use client';
import { useState } from "react";
import { clsx } from "clsx";

export default function AdyenMock({country, currency, subtotal}:{country:string; currency:string; subtotal:number}){
  const [method, setMethod] = useState("card");
  const vat = country==="CH"?0.081:0.20;
  const vatAmount = subtotal*vat;
  const total = subtotal+vatAmount;
  return (
    <div className="card p-4 space-y-3">
      <div className="font-semibold">Paiement (mock Adyen)</div>
      <div className="text-sm text-slate-600">Pays: {country} · Devise: {currency}</div>
      <div className="flex gap-2">
        {["card","applepay","sepa","twint"].map(m=>(
          <button key={m} onClick={()=>setMethod(m)} className={clsx("badge", method===m && "bg-indigo-50 border-indigo-300")}>{m}</button>
        ))}
      </div>
      <div className="text-sm">HT {subtotal.toFixed(2)} {currency} · TVA {(vat*100).toFixed(1)}% → TTC {total.toFixed(2)} {currency}</div>
      <button className="rounded-xl bg-brand-600 text-white px-4 py-2">Payer (demo)</button>
    </div>
  );
}
