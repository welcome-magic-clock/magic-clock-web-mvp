import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export function MagicCubeIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Cube 3D */}
      <path
        d="M12 3 5 7v10l7 4 7-4V7z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arête verticale avant */}
      <path
        d="M12 3v18"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arêtes du plan supérieur */}
      <path
        d="M5 7l7 4 7-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* + en haut à droite */}
      <path
        d="M17.5 4.2h2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d="M18.6 3.1v2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />

      {/* + en bas à gauche */}
      <path
        d="M4.3 15.3h2.0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d="M5.3 14.3v2.0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}
