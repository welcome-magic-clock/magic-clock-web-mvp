// app/legal/ip-policy/page.tsx
// ✅ v2.1 — 6 mars 2026 · support@magic-clock.com · BackButton géré par layout
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Propriété intellectuelle & procédure de retrait – Magic Clock",
};

export default function IpPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Propriété intellectuelle &amp; procédure de retrait
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Règles relatives aux contenus publiés sur Magic Clock, aux droits de
            propriété intellectuelle et à la procédure applicable en cas
            d’atteinte présumée.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Dernière mise à jour : 6 mars 2026
          </p>
        </div>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">
            1. Titularité des droits sur les contenus utilisateurs
          </h2>
          <p className="mt-2">
            Les contenus que vous créez et publiez sur Magic Clock restent, en
            principe, votre propriété ou celle du titulaire de droits que vous
            représentez, sous réserve des droits concédés à Magic Clock dans les{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>
            .
          </p>
          <p className="mt-2">
            Vous êtes seul responsable de vous assurer que vous disposez de tous
            les droits, autorisations et consentements nécessaires avant toute
            publication.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            2. Licence accordée à Magic Clock
          </h2>
          <p className="mt-2">
            En publiant un contenu sur la plateforme, vous accordez à Magic
            Clock une licence non exclusive, mondiale, gratuite, transférable et
            sous-licenciable dans la mesure nécessaire pour :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>héberger, stocker, reproduire et afficher vos contenus ;</li>
            <li>
              les diffuser sur la plateforme, y compris via les flux publics,
              profils, pages de détail et fonctionnalités associées ;
            </li>
            <li>
              les adapter techniquement (par exemple encodage, compression,
              vignettes, recadrage ou reformatage) pour des raisons de
              compatibilité, de sécurité ou de performance ;
            </li>
            <li>
              les utiliser dans le cadre de la promotion raisonnable de Magic
              Clock, sous réserve de vos droits et des obligations légales
              applicables.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Cette licence n’emporte pas transfert de propriété de vos droits de
            propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            3. Contenus interdits au regard de la propriété intellectuelle
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              reproduire, publier, utiliser ou exploiter sans autorisation des
              œuvres protégées (photos, vidéos, musiques, textes, logiciels,
              graphismes, formations, etc.) ;
            </li>
            <li>
              reprendre ou utiliser sans droit des marques, logos, chartes,
              noms commerciaux ou designs protégés ;
            </li>
            <li>
              intégrer l’image, la voix ou d’autres attributs d’une personne
              sans son consentement lorsque celui-ci est requis ;
            </li>
            <li>
              publier un contenu laissant croire à tort qu’il émane d’un tiers
              ou usurper l’identité d’une personne physique ou morale.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            4. Procédure de notification et de retrait
          </h2>
          <p className="mt-2">
            Si vous estimez qu’un contenu disponible sur Magic Clock porte
            atteinte à vos droits de propriété intellectuelle ou à des droits
            connexes, vous pouvez nous adresser une notification à l’adresse
            suivante :
          </p>
          <p className="mt-2">
            E-mail :{" "}
            <a
              href="mailto:support@magic-clock.com"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              support@magic-clock.com
            </a>
          </p>
          <p className="mt-2">Votre notification doit contenir au minimum :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>vos nom, prénom ou raison sociale, ainsi que vos coordonnées ;</li>
            <li>
              l’URL, le nom du profil ou tout identifiant permettant de localiser
              précisément le contenu signalé ;
            </li>
            <li>
              une description suffisamment précise du contenu litigieux et des
              droits invoqués ;
            </li>
            <li>
              tout élément justifiant votre qualité de titulaire de droits,
              représentant ou ayant droit ;
            </li>
            <li>
              une déclaration indiquant que vous estimez, de bonne foi, que
              l’utilisation contestée n’est pas autorisée ;
            </li>
            <li>
              une déclaration attestant l’exactitude des informations transmises
              ;
            </li>
            <li>votre signature manuscrite ou électronique.</li>
          </ul>
          <p className="mt-2">
            Après réception, Magic Clock pourra examiner la demande, solliciter
            des informations complémentaires, restreindre l’accès au contenu,
            retirer le contenu signalé ou prendre toute autre mesure appropriée,
            selon les éléments disponibles et le droit applicable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            5. Contestation et bonne foi
          </h2>
          <p className="mt-2">
            En cas de retrait ou de restriction d’un contenu, Magic Clock peut,
            lorsque cela paraît approprié, permettre à l’utilisateur concerné de
            fournir des explications ou éléments justificatifs.
          </p>
          <p className="mt-2">
            Toute notification manifestement abusive, frauduleuse ou transmise
            de mauvaise foi peut entraîner le rejet de la demande et, le cas
            échéant, toute mesure utile permise par le droit applicable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">
            6. Sanctions en cas de violation répétée
          </h2>
          <p className="mt-2">
            Les utilisateurs publiant de manière répétée des contenus portant
            atteinte aux droits de propriété intellectuelle ou aux droits de
            tiers peuvent voir leur compte limité, suspendu ou fermé,
            conformément aux{" "}
            <Link
              href="/legal/cgu"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              CGU
            </Link>{" "}
            et à la{" "}
            <Link
              href="/legal/community-guidelines"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Charte de la communauté
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
