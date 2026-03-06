// components/legal/PaymentMethodsSection.tsx
export function PaymentMethodsSection() {
  return (
    <section>
      <h2 className="text-base font-semibold text-slate-900">
        8 bis. Moyens de paiement disponibles
      </h2>

      <p className="mt-2">
        Les paiements Magic Clock sont traités via <strong>Stripe</strong>.
        Les moyens de paiement proposés peuvent varier selon le pays de
        l&apos;Utilisateur, la devise, l&apos;appareil utilisé et la
        configuration active de la plateforme.
      </p>

      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <strong>Cartes bancaires</strong> : Visa, Mastercard et autres cartes
          compatibles selon disponibilité
        </li>
        <li>
          <strong>Moyens de paiement locaux</strong> : par exemple TWINT, SEPA
          ou autres solutions compatibles selon le pays
        </li>
        <li>
          <strong>Wallets</strong> : par exemple Apple Pay ou autres moyens
          compatibles, lorsqu&apos;ils sont disponibles sur l&apos;appareil et
          activés sur la plateforme
        </li>
      </ul>

      <p className="mt-2 text-xs text-slate-500">
        La liste exacte des moyens de paiement disponibles est affichée au
        moment du paiement.
      </p>
    </section>
  );
}
