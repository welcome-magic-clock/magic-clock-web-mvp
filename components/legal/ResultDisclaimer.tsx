// components/legal/ResultDisclaimer.tsx
"use client";

type ResultDisclaimerProps = {
  /**
   * Si true → affiche une case à cocher de consentement explicite.
   * Si false → affiche seulement le texte d'information.
   */
  showCheckbox?: boolean;
};

export function ResultDisclaimer({ showCheckbox = true }: ResultDisclaimerProps) {
  return (
    <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
      <p>
        Les contenus disponibles via Magic Clock (y compris les Displays, méthodes,
        astuces, exemples de parcours avant/après et partages d&apos;expérience)
        ont pour but <strong>d&apos;informer, d&apos;inspirer et d&apos;illustrer
        une méthodologie</strong>.
      </p>
      <p>
        Ils ne constituent <strong>ni une garantie de résultat</strong>, ni un
        conseil professionnel personnalisé (que ce soit en matière de beauté,
        santé, bien-être, finances, activité professionnelle ou tout autre
        domaine). Chaque situation est différente et dépend de nombreux facteurs
        extérieurs au contrôle du créateur et de la Plateforme.
      </p>
      <p>
        En utilisant ces contenus, tu restes <strong>seul responsable</strong> de
        la manière dont tu appliques les informations et méthodes présentées,
        ainsi que des conséquences éventuelles (physiques, matérielles,
        financières, morales ou autres) dans ta vie privée comme professionnelle.
        La Plateforme et les créateurs ne peuvent être tenus responsables d&apos;un
        résultat non atteint ou d&apos;un mauvais usage des contenus.
      </p>

      {showCheckbox && (
        <label className="mt-1 flex items-start gap-2">
          <input
            type="checkbox"
            // Quand ce bloc sera intégré dans un <form>, ce "required" forcera
            // l'utilisateur à cocher avant de continuer.
            required
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
          />
          <span>
            Je comprends que ce contenu décrit une méthode et une expérience
            propre au créateur, <strong>sans garantie de résultat</strong>, et
            que je reste seul responsable de son application dans ma vie privée
            ou professionnelle.
          </span>
        </label>
      )}
    </div>
  );
}
