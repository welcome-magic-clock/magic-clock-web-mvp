
'use client';
import Cockpit from "@/features/monet/Cockpit";
import AdyenMock from "@/core/payments/adyen-mock";
export default function Page(){
  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-semibold">Monétisation — Cockpit</h1>
      <Cockpit />
      <AdyenMock country="CH" currency="CHF" subtotal={29.9} />
    </div>
  );
}
