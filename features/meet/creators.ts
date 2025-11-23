// features/meet/creators.ts

export type Creator = {
  id: string;
  name: string;
  handle: string;
  city: string;
  langs: string[];
  followers: number;
  access: string[];
  avatar: string; // chemin vers l’image de profil
};

export const CREATORS: Creator[] = [
  {
    id: "sofia-colorist",
    name: "Sofia Rivera",
    handle: "sofia_colorist",
    city: "Lausanne (CH) · Langues: FR, EN",
    langs: ["FR", "EN"],
    followers: 12400,
    access: ["FREE", "ABO", "PPV"],
    avatar: "/images/creator1.png",
  },
  {
    id: "aiko-tanaka",
    name: "Aiko Tanaka",
    handle: "aiko_tanaka",
    city: "Tokyo (JP) · Langues: EN, JP",
    langs: ["EN", "JP"],
    followers: 9800,
    access: ["FREE", "PPV"],
    avatar: "/images/creator2.png",
  },
  {
    id: "lena-muller",
    name: "Lena Müller",
    handle: "lena_muller",
    city: "Zurich (CH) · Langues: DE, EN",
    langs: ["DE", "EN"],
    followers: 15300,
    access: ["ABO", "PPV"],
    avatar: "/images/creator3.png",
  },
  {
    id: "carlos-fernandez",
    name: "Carlos Fernandez",
    handle: "carlos_fernandez",
    city: "Barcelone (ES) · Langues: ES, EN",
    langs: ["ES", "EN"],
    followers: 11200,
    access: ["FREE", "ABO"],
    avatar: "/images/creator4.png",
  },
];
