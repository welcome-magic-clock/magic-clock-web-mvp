
'use client';
import { useRef, useState } from "react";
export default function BeforeAfter(){
  const [before, setBefore] = useState('/images/sample1.jpg');
  const [after, setAfter] = useState('/images/sample2.jpg');
  const [avatar, setAvatar] = useState('/images/sample3.jpg');
  const [split, setSplit] = useState(50);
  return (
    <div className="card p-3">
      <div className="flex items-center gap-2 text-sm mb-2">
        <label>Split {split}%</label>
        <input type="range" min={0} max={100} value={split} onChange={e=>setSplit(parseInt(e.target.value))}/>
      </div>
      <div className="relative w-full aspect-[3/2] overflow-hidden rounded-2xl">
        <img src={before} className="absolute inset-0 w-full h-full object-cover"/>
        <img src={after} style={{clipPath:`inset(0 0 0 ${split}%)`}} className="absolute inset-0 w-full h-full object-cover"/>
        <img src={avatar} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white shadow"/>
        <div className="absolute inset-y-0" style={{left:`${split}%`}}>
          <div className="w-0.5 h-full bg-white/70 shadow"></div>
        </div>
      </div>
      <div className="mt-3 flex gap-2 text-sm">
        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(f) setBefore(URL.createObjectURL(f))}} />
        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(f) setAfter(URL.createObjectURL(f))}} />
        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(f) setAvatar(URL.createObjectURL(f))}} />
      </div>
    </div>
  );
}
