export type Access = "FREE" | "ABO" | "PPV";

export type Creator = {
  id: string;
  handle: string;
  name: string;
  city: string;
  langs: string[];
  followers: number;
  avatar: string;
  access: Access[];
};

export type FeedCard = {
  id: string;
  title: string;
  user: string; // creator handle
  views: number;
  image: string;
  access: Access;
};
