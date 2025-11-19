
export type Access = "FREE"|"ABO"|"PPV";
export type Creator = { id:number; handle:string; name:string; city:string; langs:string[]; followers:number; avatar:string; access:Access[] };
export type FeedCard = { id:number; title:string; user:string; views:number; image:string; access:Access };
