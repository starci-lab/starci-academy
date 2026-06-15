"use client"

import { resolveFoundationMountFileUrl } from "../utils"
import { useFoundationOverlayState } from "@/hooks"
import type { FoundationEntity } from "@/modules/types"
import { FoundationKind } from "@/modules/types"
import { useCallback } from "react"

/**
 * Opens the correct viewer for a foundation item (modal or external tab).
 */
export const useOpenFoundationResource = () => {
    const foundationOverlay = useFoundationOverlayState()

    return useCallback((foundation: FoundationEntity) => {
        switch (foundation.kind) {
        case FoundationKind.Document:
        case FoundationKind.Video:
            foundationOverlay.open()
            return
        case FoundationKind.ExternalLink:
            if (!foundation.value?.trim()) {
                return
            }
            window.open(
                resolveFoundationMountFileUrl(foundation.value),
                "_blank",
                "noopener,noreferrer",
            )
            return
        default:
            return
        }
    }, [foundationOverlay])
}
