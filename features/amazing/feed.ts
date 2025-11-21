
import type { FeedCard } from "@/core/domain/types";
export const FEED: FeedCard[] = Array.from({length:12}).map((_,i)=> ({
  id: String(i+1),
  title: i%2? 'Balayage caramel' : 'Avant/Après couleur',
  user: ['sofia','lena','maya','aiko'][i%4],
  views: 1000 + i*37,
  image: `/images/sample${(i%4)+1}.jpg`,
  access: (i%3===0?'PPV': i%2===0?'ABO':'FREE')
}));
