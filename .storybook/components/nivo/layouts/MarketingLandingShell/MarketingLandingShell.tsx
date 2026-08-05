"use client"

import { useEffect, useState } from "react"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { BackToTop } from "@sb-components/atoms/buttons/BackToTop/BackToTop"
import { Footer, type FooterProps } from "@sb-components/nivo/blocks/landing/Footer/Footer"
import { MarketingNavbar, type MarketingNavbarProps } from "@sb-components/nivo/blocks/landing/MarketingNavbar/MarketingNavbar"

/**
 * `MarketingLandingShell` — the LAYOUT the public `/` landing route sits in:
 * `MarketingNavbar` on top, the route's own section stack in the CENTER,
 * `Footer` closing it, and a floating `BackToTop`. `content` is the one slot
 * a route's shape enters — mirrors `DashboardShell`'s own `content` slot, so
 * `isSkeleton` (loaded vs loading) is the only structural state a story maps.
 * `AnatomyTier` has no `layout` member, so this story passes `tier="screen"`
 * (story.md: a layout's story is the top arrangement tier).
 */

/** Props for {@link MarketingLandingShell}. */
export interface MarketingLandingShellProps {
    /** The dark top bar's resolved data, forwarded to `MarketingNavbar`. */
    navbar: MarketingNavbarProps
    /** The footer's resolved data, forwarded to `Footer`. */
    footer: FooterProps
    /** The routed page's own section stack, mounted in the CENTER. */
    content: ComponentTypeWithSkeleton
    /** Accessible name for the floating back-to-top control. */
    backToTopLabel: string
    /** Render the `content` slot in its skeleton (loading) state. */
    isSkeleton?: boolean
}

/** How far (px) the reader scrolls before `BackToTop` reveals itself — mirrors the prototype's own fold threshold. */
const BACK_TO_TOP_REVEAL_PX = 560

/**
 * The landing route shell. See the file header for why the shell forces its
 * own dark surface and why `BackToTop`'s placement is decided here, not
 * inside the atom.
 *
 * @param props - {@link MarketingLandingShellProps}
 */
const MarketingLandingShell = ({
    navbar,
    footer,
    content: Content,
    backToTopLabel,
    isSkeleton,
}: MarketingLandingShellProps) => {
    // Scroll-driven reveal is UI state the shell owns locally — not domain data,
    // so it sits beside `isSkeleton` rather than replacing it (the two are
    // independent: a first-load skeleton can still be scrolled past).
    const [isPastFold, setIsPastFold] = useState(false)

    useEffect(() => {
        const onScroll = () => setIsPastFold(window.scrollY > BACK_TO_TOP_REVEAL_PX)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <div data-tier="layout" data-component="MarketingLandingShell" className="dark flex min-h-dvh flex-col bg-background text-foreground">
            <MarketingNavbar {...navbar} />

            <main className="flex-1">
                <Content isSkeleton={isSkeleton} />
            </main>

            <Footer {...footer} />

            <div className="fixed bottom-6 end-6 z-40">
                <BackToTop
                    isVisible={isPastFold}
                    label={backToTopLabel}
                    onPress={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                />
            </div>
        </div>
    )
}

export { MarketingLandingShell }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "layout", name: "MarketingLandingShell" } as const
