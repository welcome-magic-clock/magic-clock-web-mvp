"use client"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Creator = {
  id: number
  name: string
  job: string
  city: string
  langs: string[]
  access: ("FREE"|"ABO"|"PPV")[]
  img: string
  followers: number
  creations: number
}

const creators: Creator[] = [
  { id:1, name:"Aiko Tanaka", job:"Coloriste coiffure", city:"Lausanne (CH)", langs:["FR","EN","JP"], access:["FREE","ABO","PPV"], img:"/images/creator1.png", followers:12400, creations:87 },
  { id:2, name:"Sofía Rivera", job:"Colorimétrie & soin", city:"Madrid (ES)", langs:["ES","EN","FR"], access:["FREE","PPV"], img:"/images/creator2.png", followers:9800, creations:64 },
  { id:3, name:"Lena Martin", job:"Coiffeuse studio", city:"Lyon (FR)", langs:["FR","EN"], access:["FREE","ABO"], img:"/images/creator3.png", followers:15100, creations:102 },
  { id:4, name:"Maya Flores", job:"Coloriste & visio", city:"Zurich (CH)", langs:["DE","EN","FR"], access:["FREE","ABO","PPV"], img:"/images/creator4.png", followers:7600, creations:49 },
]

const kfmt = (n:number) => n>=10000 ? (n/1000).toFixed(n%1000?1:0)+"k" : String(n)

export default function MeetPage() {
  const [q, setQ] = useState("")
  const [lang, setLang] = useState("")
  const [sort, setSort] = useState("Pertinence")
  const [access, setAccess] = useState<Record<string, boolean>>({FREE:true,ABO:true,PPV:true})
  const [follow, setFollow] = useState<Record<number, boolean>>({})

  useEffect(()=>{
    const f: Record<number, boolean> = {}
    creators.forEach(c => f[c.id] = typeof window !== "undefined" && localStorage.getItem("mc_follow_"+c.id)==="1")
    setFollow(f)
  }, [])

  const items = useMemo(()=>{
    let arr = creators.filter(c =>
      (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.job.toLowerCase().includes(q.toLowerCase())) &&
      (!lang || c.langs.includes(lang)) &&
      c.access.some(a => access[a])
    )
    if (sort==="Top") arr = arr.slice().sort((a,b)=> b.followers - a.followers)
    if (sort==="Récent") arr = arr.slice().sort((a,b)=> b.creations - a.creations)
    return arr
  }, [q, lang, sort, access])

  function toggleFollow(id:number) {
    setFollow(prev=>{
      const next = {...prev, [id]: !prev[id]}
      if (typeof window !== "undefined") localStorage.setItem("mc_follow_"+id, next[id]?"1":"0")
      return next
    })
  }

  return (
    <main className="p-6">
      <div className="sticky top-0 z-10 -mx-6 mb-4 border-b border-slate-200 bg-white/70 px-6 py-3 backdrop-blur">
        <h1 className="mb-2 text-2xl font-black">Meet me — Découvrir les créateurs</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Mot-clé (ex. balayage caramel)" className="rounded-xl border border-slate-200 px-3 py-2" />
          <div className="flex gap-1">
            {["FREE","ABO","PPV"].map(a=>(
              <button key={a} onClick={()=>setAccess(s=>({...s,[a]:!s[a]}))} className={"rounded-full border px-3 py-1 text-sm " + (access[a]?"bg-indigo-50 border-indigo-200":"bg-white border-slate-200")}>{a}</button>
            ))}
          </div>
          <select value={lang} onChange={e=>setLang(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2">
            <option value="">Langue (toutes)</option><option>FR</option><option>EN</option><option>ES</option><option>DE</option>
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2">
            <option>Pertinence</option><option>Top</option><option>Récent</option>
          </select>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(c => {
          const isFollowing = !!follow[c.id]
          const count = isFollowing ? c.followers + 1 : c.followers
          return (
            <Card key={c.id}>
              <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-slate-100">
                <Image src={c.img} alt={c.name} fill className="object-cover" />
                <div className="absolute -bottom-6 left-4 h-14 w-14 overflow-hidden rounded-full border-4 border-white shadow-soft">
                  <Image src={c.img} alt="" fill className="object-cover" />
                </div>
              </div>
              <CardContent className="pt-8">
                <div className="mb-1 flex items-center gap-2">
                  <div className="font-extrabold">{c.name}</div>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs">{c.job}</span>
                </div>
                <div className="mb-2 text-sm text-slate-600">{c.city} · Langues: {c.langs.join(", ")}</div>
                <div className="mb-2 flex items-center gap-3 text-sm text-slate-700">
                  <span>👥 <b>{kfmt(count)}</b> followers</span>
                  <span>🧩 {c.creations} créations</span>
                  <Button onClick={()=>toggleFollow(c.id)} className={"ml-auto " + (isFollowing?"bg-indigo-50":"")}>
                    {isFollowing ? "Suivi" : "Suivre"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">{c.access.map(a=>(<span key={a} className="rounded-full border border-slate-200 px-2 py-0.5 text-xs">{a}</span>))}</div>
                <div className="mt-2">
                  <button className="text-indigo-600">Voir profil</button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}