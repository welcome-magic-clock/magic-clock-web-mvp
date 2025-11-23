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
    avatar: "/creators/aiko-tanaka.jpg",
    access: ["FREE", "ABO", "PPV"],
  },
  {
    id: 2,
    name: "Sofia Rivera",
    handle: "@sofia_colorist",
    city: "Madrid (ES)",
    langs: ["ES", "FR", "EN"],
    followers: 9800,
    avatar: "/creators/sofia-rivera.jpg",
    access: ["FREE", "PPV"],
  },
  {
    id: 3,
    name: "Lena Martin",
    handle: "@lena_martin",
    city: "Lyon (FR)",
    langs: ["FR", "EN"],
    followers: 11800,
    avatar: "/creators/lena-martin.jpg",
    access: ["FREE", "ABO"],
  },
  {
    id: 4,
    name: "Maya Flores",
    handle: "@maya_flores",
    city: "Zurich (CH)",
    langs: ["DE", "EN", "FR"],
    followers: 7800,
    avatar: "/creators/maya-flores.jpg",
    access: ["FREE", "PPV"],
  },
];
