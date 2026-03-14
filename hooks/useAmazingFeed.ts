/**
 * hooks/useAmazingFeed.ts
 * ✅ v1.0 — Hook feed Amazing avec cache API Redis
 *
 * Remplace les appels Supabase directs depuis le client par des appels
 * à /api/feed/amazing qui est lui-même cachée par Redis côté serveur.
 *
 * Pattern :
 *   Composant → useAmazingFeed → /api/feed/amazing → Redis → Supabase
 *
 * Avantages :
 *   - Le cache Redis côté serveur absorbe 99% des requêtes en pic
 *   - Le client reçoit toujours une réponse rapide (<50ms si cache HIT)
 *   - Pagination infinie supportée (loadMore)
 *   - Invalidation automatique après publication d'un nouveau Magic Clock
 */

"use client"

import { useState, useEffect, useCallback } from "react"

export type FeedItem = {
  id: string
  slug: string | null
  title: string | null
  gating_mode: "FREE" | "SUB" | "PPV" | null
  ppv_price: number | null
  before_url: string | null
  after_url: string | null
  creator_handle: string | null
  creator_name: string | null
  created_at: string | null
  view_count: number
  like_count: number
  rating_avg: number | null
  rating_count: number | null
}

type FeedFilter = "all" | "free" | "ppv" | "sub"

type UseAmazingFeedResult = {
  items:      FeedItem[]
  isLoading:  boolean
  isLoadingMore: boolean
  error:      string | null
  hasMore:    boolean
  loadMore:   () => void
  refresh:    () => void
  cached:     boolean
}

const PAGE_SIZE = 20

export function useAmazingFeed(filter: FeedFilter = "all"): UseAmazingFeedResult {
  const [items,         setItems]         = useState<FeedItem[]>([])
  const [page,          setPage]          = useState(0)
  const [isLoading,     setIsLoading]     = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [hasMore,       setHasMore]       = useState(true)
  const [cached,        setCached]        = useState(false)

  const fetchPage = useCallback(async (pageNum: number, append = false) => {
    if (!append) setIsLoading(true)
    else         setIsLoadingMore(true)

    setError(null)

    try {
      const url = `/api/feed/amazing?page=${pageNum}&filter=${filter}`
      const res  = await fetch(url, { cache: "no-store" })

      if (!res.ok) throw new Error("Erreur chargement feed")

      const json = await res.json() as {
        data: FeedItem[]
        cached: boolean
        page: number
      }

      const newItems = json.data ?? []
      setCached(json.cached)

      if (append) {
        setItems(prev => [...prev, ...newItems])
      } else {
        setItems(newItems)
      }

      // Plus de données si on a reçu une page complète
      setHasMore(newItems.length === PAGE_SIZE)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [filter])

  // Chargement initial
  useEffect(() => {
    setPage(0)
    setItems([])
    setHasMore(true)
    fetchPage(0, false)
  }, [filter, fetchPage])

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchPage(nextPage, true)
  }, [page, isLoadingMore, hasMore, fetchPage])

  const refresh = useCallback(() => {
    setPage(0)
    setItems([])
    setHasMore(true)
    fetchPage(0, false)
  }, [fetchPage])

  return {
    items,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    cached,
  }
}
