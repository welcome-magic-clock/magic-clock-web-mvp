
'use client';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
export default function MediaCard({item}: any){
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/3]">
        <Image src={item.image} alt={item.title} fill className="object-cover"/>
        <div className="absolute bottom-2 left-2 flex gap-2">{item.access && <Badge>{item.access}</Badge>}</div>
      </div>
      <div className="p-3">
        <div className="font-medium">{item.title}</div>
        <div className="text-xs text-slate-500">@{item.user} • {item.views} vues</div>
      </div>
    </div>
  );
}
