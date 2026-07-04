"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ARCHITECTURE_COMPONENT_MAP, DEFAULT_ARCHITECTURE_NODE } from "../constants"

/** Query key the selected node is mirrored to (`/architecture?node=kafka`). */
const NODE_KEY = "node"

/** The handle returned by {@link useArchitectureNode}. */
export interface UseArchitectureNodeResult {
    /** The selected component name — always a valid catalog entry. */
    node: string
    /** Select a node, rewriting the URL query (rail ⇄ map ⇄ dissection panel share this). */
    setNode: (name: string) => void
}

/**
 * Read/write the selected architecture-map node through the URL `?node=`
 * param, so the rail, the 3D map and the dissection panel all share one
 * source of truth (shareable / back-forward friendly). Mirrors
 * `usePracticeView` / `LeaderboardCategoryRail`'s URL-sync pattern.
 *
 * An invalid or missing `?node=` falls back to {@link DEFAULT_ARCHITECTURE_NODE}
 * — the selection is never "nothing selected".
 */
export const useArchitectureNode = (): UseArchitectureNodeResult => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const node = useMemo(() => {
        const raw = searchParams.get(NODE_KEY)
        return raw && ARCHITECTURE_COMPONENT_MAP[raw] ? raw : DEFAULT_ARCHITECTURE_NODE
    }, [searchParams])

    const setNode = useCallback((name: string) => {
        if (!ARCHITECTURE_COMPONENT_MAP[name]) return
        const params = new URLSearchParams(searchParams.toString())
        if (name === DEFAULT_ARCHITECTURE_NODE) {
            params.delete(NODE_KEY)
        } else {
            params.set(NODE_KEY, name)
        }
        const queryString = params.toString()
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }, [pathname, router, searchParams])

    return { node, setNode }
}
