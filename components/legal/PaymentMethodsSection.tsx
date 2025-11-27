// components/legal/PaymentMethodsSection.tsx
export function PaymentMethodsSection() {
  return (
    <section>
      <h2 className="text-base font-semibold text-slate-900">
        8 bis. Moyens de paiement actuellement disponibles (version bêta)
      </h2>

      <p className="mt-2">
        Les paiements Magic Clock sont traités via{" "}
        <strong>PostFinance Checkout</strong> (offre groupée eCom). Les moyens
        de paiement suivants peuvent être proposés, selon votre pays et votre
        banque&nbsp;:
      </p>

      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <strong>Cartes bancaires</strong> : Visa, Mastercard
        </li>
        <li>
          <strong>Paiements suisses</strong> : PostFinance Pay, TWINT
        </li>
        <li>
          <strong>Wallets</strong> : Apple Pay, Click to Pay{" "}
          <span className="text-slate-500 text-xs">
            (si disponibles sur votre appareil)
          </span>
        </li>
      </ul>

      <p className="mt-2 text-xs text-slate-500">
        Cette liste pourra être complétée progressivement au fur et à mesure du
        déploiement international de Magic Clock.
      </p>
    </section>
  );
}
