// components/legal/PaymentMethodsSection.tsx
export function PaymentMethodsSection() {
  return (
    <section
      id="payment-methods"
      className="mt-10 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Moyens de paiement actuellement disponibles (version bêta)
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Les paiements Magic Clock sont traités via PostFinance Checkout
        (offre groupée eCom). Les moyens de paiement suivants peuvent être
        proposés, selon votre pays et votre banque&nbsp;:
      </p>

      <ul className="mt-3 space-y-1 text-sm text-slate-700">
        <li>
          • <span className="font-medium">Cartes bancaires</span> : Visa, Mastercard
        </li>
        <li>
          • <span className="font-medium">Paiements suisses</span> : PostFinance Pay, TWINT
        </li>
        <li>
          • <span className="font-medium">Wallets</span> : Apple Pay, Click to Pay
          (si disponibles sur votre appareil)
        </li>
      </ul>

      <p className="mt-3 text-xs text-slate-500">
        Cette liste pourra être complétée progressivement au fur et à mesure
        du déploiement international de Magic Clock.
      </p>
    </section>
  );
}
