"use client"

import React from "react"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { useAppSelector } from "@/redux/hooks"
import { useE2eResultOverlayState } from "@/hooks/zustand/overlay/hooks"
import { _E2eResultDrawer, type E2eFlow } from "./component"

/**
 * Global E2E-result drawer — the CONNECTED half of the lesson "view E2E proof" feature
 * (the trigger is `E2eResultButton` in the lesson footer, not part of this pilot). Open-state
 * lives in the shared overlay store (`e2eResult` key) instead of local `useState`; the recorded
 * per-language Playwright proofs are read from the active lesson in redux and handed to the
 * presentational {@link _E2eResultDrawer}. Models 1:1 on the real
 * `src/components/drawers/E2eResultDrawer/index.tsx` (same overlay hook, same redux selector,
 * same mobile-bottom/desktop-right placement) — mounted once by `DrawerContainer` in the real app.
 */
export const E2eResultDrawer = () => {
    const { isOpen, setOpen } = useE2eResultOverlayState()
    const { isMobile } = useSmViewpoint()
    const content = useAppSelector((state) => state.content.entity)
    // The reader shell keeps `content.entity` warm before this drawer can be opened (same
    // assumption the real `E2eResultDrawer` makes), so `content == null` reads as "not loaded
    // yet" rather than a separate SWR loading flag — there isn't one for this slice.
    const isSkeleton = content == null
    const flows = (content?.e2eFlows ?? []) as Array<E2eFlow>

    return (
        <_E2eResultDrawer
            isOpen={isOpen}
            onOpenChange={setOpen}
            placement={isMobile ? "bottom" : "right"}
            isSkeleton={isSkeleton}
            flows={flows}
        />
    )
}
