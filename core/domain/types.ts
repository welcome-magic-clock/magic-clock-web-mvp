// core/domain/types.ts

export type AccessKind = "FREE" | "ABO" | "PPV";

// alias pour rester compatible avec le reste du code
export type Access = AccessKind;

export type Creator = {
  id: number;
  name: string;
  handle: string;
  city: string;
  langs: string[];
  followers: number;
  avatar: string;
  access: Access[];
};

export type FeedCard = {
  id: number;
  title: string;
  user: string;
  views: number;
  image: string;
  access: Access;
};
