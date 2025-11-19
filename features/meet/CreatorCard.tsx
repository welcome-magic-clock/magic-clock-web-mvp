
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
export default function CreatorCard({c}:any){
  return (
    <div className="card p-4">
      <div className="relative aspect-[4/3]">
        <Image src={c.avatar} alt={c.name} fill className="object-cover rounded-xl" />
      </div>
      <div className="mt-3 font-medium">{c.name}</div>
      <div className="text-xs text-slate-500">{c.city} · Langues: {c.langs.join(', ')}</div>
      <div className="mt-2 text-xs text-slate-600">{c.followers.toLocaleString()} followers</div>
      <div className="mt-3 flex gap-2">{c.access.map((a:string)=><Badge key={a}>{a}</Badge>)}</div>
      <div className="mt-3"><a className="link text-sm" href={`/u/${c.handle}`}>Voir profil</a></div>
    </div>
  );
}
