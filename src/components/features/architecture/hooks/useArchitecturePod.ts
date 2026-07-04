"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ARCHITECTURE_POD_MAP } from "../pods"
import { CORE_DETAIL_ID } from "../ArchitectureMap/core-detail-scene"

/** Query key the drilled-into pod is mirrored to (`/architecture?pod=payment`). */
const POD_KEY = "pod"

/** A `?pod=` value is valid when it names a real pod OR the reserved Core
 *  drill-down (`core` → the Core-module scene). */
const isValidPod = (raw: string | null): raw is string =>
    Boolean(raw) && (raw === CORE_DETAIL_ID || Boolean(ARCHITECTURE_POD_MAP[raw!]))

/** The handle returned by {@link useArchitecturePod}. */
export interface UseArchitecturePodResult {
    /** The drilled-into pod id, or `null` when viewing the pod overview. */
    pod: string | null
    /** Drill into a pod (or `null` to return to the overview), rewriting `?pod=`. */
    setPod: (id: string | null) => void
}

/**
 * Read/write the drilled-into pod through the URL `?pod=` param — mirrors
 * {@link import("./useArchitectureNode").useArchitectureNode}'s `?node=` pattern
 * so the pod drill-down is deep-linkable / back-forward friendly. `null` (no /
 * invalid `?pod=`) means the pod overview is shown.
 */
export const useArchitecturePod = (): UseArchitecturePodResult => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const pod = useMemo(() => {
        const raw = searchParams.get(POD_KEY)
        return isValidPod(raw) ? raw : null
    }, [searchParams])

    const setPod = useCallback((id: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (isValidPod(id)) {
            params.set(POD_KEY, id)
        } else {
            params.delete(POD_KEY)
        }
        const queryString = params.toString()
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }, [pathname, router, searchParams])

    return { pod, setPod }
}
