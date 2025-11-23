// features/meet/creators.ts

import type { Creator } from "@/core/domain/types";

export const CREATORS: Creator[] = [
  {
    id: 1,
    name: "Aiko Tanaka",
    handle: "@aiko_tanaka",
    city: "Lausanne (CH)",
    langs: ["FR", "EN", "JP"],
    followers: 12400,
    specialties: ["Balayage", "Blond froid", "Soin"],
    avatar: "/creators/aiko-tanaka.jpeg",
    access: ["FREE", "ABO", "PPV"],
  },
  {
    id: 2,
    name: "Sofia Rivera",
    handle: "@sofia_rivera",
    city: "Madrid (ES)",
    langs: ["ES", "FR", "EN"],
    followers: 9800,
    specialties: ["Balayage", "Soin"],
    avatar: "/creators/sofia-rivera.jpeg",
    access: ["FREE", "PPV"],
  },
  {
    id: 3,
    name: "Lena Martin",
    handle: "@lena_martin",
    city: "Lyon (FR)",
    langs: ["FR", "EN"],
    followers: 18100,
    specialties: ["Blond froid", "Coupe"],
    avatar: "/creators/lena-martin.jpeg",
    access: ["FREE", "ABO"],
  },
  {
    id: 4,
    name: "Maya Flores",
    handle: "@maya_flores",
    city: "Zurich (CH)",
    langs: ["DE", "EN", "FR"],
    followers: 7800,
    specialties: ["Coloriste & vidéo"],
    avatar: "/creators/maya-flores.jpeg",
    access: ["FREE", "PPV"],
  },
];

export default CREATORS;
