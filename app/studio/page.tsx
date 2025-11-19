"use client"
import Image from "next/image"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export default function StudioPage() {
  const [beforeSrc, setBeforeSrc] = useState<string>("/studio/studio_before.jpg")
  const [afterSrc, setAfterSrc] = useState<string>("/studio/studio_after.jpg")
  const [divider, setDivider] = useState(50)
  const wrapper = useRef<HTMLDivElement>(null)

  function onDrag(e: React.MouseEvent) {
    if (!wrapper.current) return
    const rect = wrapper.current.getBoundingClientRect()
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)
    setDivider(Math.round((x / rect.width) * 100))
  }

  function pickFile(side: "before" | "after", file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      side==="before" ? setBeforeSrc(String(reader.result)) : setAfterSrc(String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-black">Magic Studio — Création</h1>
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div ref={wrapper} className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-slate-100" onMouseMove={(e)=>e.buttons===1 && onDrag(e)} onMouseDown={onDrag}>
          <Image src={afterSrc} alt="Après" fill className="object-cover" />
          <div className="absolute inset-0" style={{clipPath:`inset(0 ${100-divider}% 0 0)`}}>
            <Image src={beforeSrc} alt="Avant" fill className="object-cover" />
          </div>
          <div className="absolute inset-y-0" style={{left:`calc(${divider}% - 1px)`}}>
            <div className="h-full w-0.5 bg-white/80"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-slate-900/80 p-3 text-white">||</div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="h-14 w-14 overflow-hidden rounded-full border-4 border-white shadow-soft">
              <Image src="/studio/avatar.jpg" alt="Avatar" fill className="object-cover" />
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="text-sm">Avant:</label>
          <input type="file" accept="image/*" onChange={e => e.target.files && pickFile("before", e.target.files[0])} />
          <label className="ml-4 text-sm">Après:</label>
          <input type="file" accept="image/*" onChange={e => e.target.files && pickFile("after", e.target.files[0])} />
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-slate-600">Divider</span>
            <input type="range" value={divider} onChange={e=>setDivider(Number(e.target.value))} />
          </div>
        </div>
      </div>
    </main>
  )
}