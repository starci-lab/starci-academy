"use client"

import React, { useMemo } from "react"
import { Button } from "@heroui/react"
import { XIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useWindowSize } from "usehooks-ts"
import { ResizableRail } from "@/components/blocks/layout/ResizableRail"
import { ContentAiChat } from "@/components/features/learn/ContentAiChat"
import { ContentAiScopePill } from "@/components/features/learn/ContentAiChat/ContentAiScopePill"
import { ContentAiChatModeSwitch } from "@/components/features/learn/ContentAiChat/ContentAiChatModeSwitch"
import { useContentAiChatOverlayState } from "@/hooks/zustand/overlay/hooks"

/**
 * The "rail" presentation of the content-AI chat — a RESIZABLE, full-viewport-height
 * panel docked to the window's right edge, mounted by `InnerLayout` as the RIGHT
 * half of the app split. NOT an overlay: the app column reflows beside it.
 *
 * It used to live in the learn shell's `rightRail` slot, under a full-width navbar,
 * because squeezing the whole app sideways broke a layout that keyed off the
 * VIEWPORT. That constraint is gone: the app column is a `@container` and its
 * breakpoints are `@app-*`, so it now re-lays-out against its own width and simply
 * goes compact when this rail widens. Hence the rail spans the navbar row too.
 *
 * Its own `lg:` classes stay VIEWPORT-based on purpose — whether the chat docks as
 * a rail at all is a question about the screen, not about the app column (below
 * `lg` the chat is a drawer instead).
 *
 * The drag handle is on the INNER (left) edge — drag left to widen — and the width
 * persists, capped so the app column never drops under its own `lg` breakpoint.
 * Header carries the content reference, the mode switch (jump to drawer), and a close.
 */
/** Smallest useful chat column — below this the composer + bubbles stop reading. */
const RAIL_MIN_WIDTH = 340

/**
 * Tailwind's `lg` breakpoint: the width at which the learn shell still has a
 * LEGAL desktop layout (icon rail + content-map rail + reading column).
 *
 * The rail must not squeeze the content column past this. The app is responsive
 * to the VIEWPORT, not to the column, so CSS goes on applying `lg:` rules to a
 * column that no longer has the room for them — which is exactly how a wide rail
 * left the left-hand side looking broken. Capping here keeps both sides honest
 * with no container-query refactor.
 */
const CONTENT_MIN_WIDTH = 1024

/** Never take more than half the window, however wide the screen gets. */
const MAX_WINDOW_SHARE = 0.5

/** Cap used before the window has been measured (SSR + first paint). */
const PRE_MEASURE_MAX_WIDTH = 640

export const ContentAiChatRail = () => {
    const t = useTranslations()
    const { setOpen } = useContentAiChatOverlayState()
    // the header no longer names the lesson/course itself — `ContentAiScopePill`
    // owns that, and reads the titles straight from the store
    const { width: windowWidth } = useWindowSize()

    // Widest the reader may drag: half the window, but never wide enough to push
    // the content column under `CONTENT_MIN_WIDTH`. A 2560 screen still gets a
    // true 50/50 split (1280); 1920 settles at 896.
    //
    // Residual, accepted: under ~1364px of window even `RAIL_MIN_WIDTH` cannot
    // leave the column its full 1024, so the floor wins and the column stays
    // tight. Fixing THAT needs the column to know its own width — see proposal
    // `container-responsive-split-shell`.
    const maxWidth = useMemo(() => {
        if (!windowWidth) {
            return PRE_MEASURE_MAX_WIDTH
        }
        return Math.max(
            RAIL_MIN_WIDTH,
            Math.min(windowWidth * MAX_WINDOW_SHARE, windowWidth - CONTENT_MIN_WIDTH),
        )
    }, [windowWidth])

    return (
        <ResizableRail
            storageKey="starci.contentAiChat.railWidth"
            defaultWidth={400}
            minWidth={RAIL_MIN_WIDTH}
            maxWidth={maxWidth}
            handleSide="left"
            ariaLabel={t("contentAi.mode.rail")}
            // exports the live width as `--app-rail-w` so the app column's fixed
            // chrome (mobile bars, FABs) can sit clear of the rail instead of
            // running underneath it.
            widthVar="--app-rail-w"
            // FULL-viewport-height rail pinned to the window edge — it is a sibling of
            // the entire app column now, not of the reading content, so it spans the
            // navbar row too. `self-start` + `top-0` keep it sticky against the page's
            // one scroll container. Handle on the inner (left) edge resizes; width
            // persists. Desktop only (mobile uses the drawer).
            // NO `relative` here. `ResizableRail` deliberately leaves the root
            // unpositioned so a caller can make it `sticky`; passing `relative`
            // back in silently WINS over `lg:sticky` (same specificity, and the
            // compiled sheet puts `.relative` last), which un-sticks the rail —
            // it then scrolls away with the page and the chat looks unscrollable.
            // `sticky` is itself a positioned context, so the drag handle's
            // `absolute` still anchors correctly once the rail is visible.
            className="hidden h-dvh shrink-0 flex-col self-start overflow-hidden border-l border-default bg-surface lg:sticky lg:top-0 lg:flex"
        >
            {/* ZONE 1 — identity + actions. The scope PILL is the identity: it names
                the same thing the old title did (lesson / course) but is also the
                control that changes it, so the panel no longer says its context
                twice (title up here, pill down by the composer). */}
            <div className="flex items-center gap-2 border-b border-default px-3 py-2">
                <ContentAiScopePill className="min-w-0 flex-1" />
                <ContentAiChatModeSwitch />
                <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    aria-label={t("contentAi.close")}
                    onPress={() => setOpen(false)}
                >
                    <XIcon className="size-4" />
                </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden p-3">
                <ContentAiChat />
            </div>
        </ResizableRail>
    )
}
