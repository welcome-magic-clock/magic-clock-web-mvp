/**
 * components/ui/TurnstileWidget.tsx
 * ✅ v1.0 — Composant Cloudflare Turnstile invisible
 *
 * Usage :
 * <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />
 *
 * Le token est ensuite envoyé dans le body de la requête POST /api/create
 */
"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface TurnstileOptions {
  sitekey: string
  callback: (token: string) => void
  "error-callback"?: () => void
  "expired-callback"?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact" | "invisible"
  appearance?: "always" | "execute" | "interaction-only"
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: "light" | "dark" | "auto"
}

export function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
  theme = "auto",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Charge le script Turnstile une seule fois
    if (!scriptLoadedRef.current && !document.getElementById("cf-turnstile-script")) {
      scriptLoadedRef.current = true
      const script = document.createElement("script")
      script.id = "cf-turnstile-script"
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      script.onload = () => renderWidget()
      document.head.appendChild(script)
    } else if (window.turnstile) {
      renderWidget()
    }

    function renderWidget() {
      if (!containerRef.current || !window.turnstile) return
      const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      if (!sitekey) {
        console.warn("[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY manquant")
        // En dev sans clé → on appelle onVerify avec un token mock
        onVerify("dev-mock-token")
        return
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey,
        callback: onVerify,
        "error-callback": onError,
        "expired-callback": onExpire,
        theme,
        size: "invisible",
        appearance: "interaction-only",
      })
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className="cf-turnstile" />
}

export default TurnstileWidget
