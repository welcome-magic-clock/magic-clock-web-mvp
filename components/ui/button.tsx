import * as React from "react"
import { cn } from "@/lib/utils"

export function Button({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-soft hover:bg-indigo-50", className)} {...props}>{children}</button>
}