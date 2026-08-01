"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "@heroui/react"
import { SidebarSimpleIcon } from "@phosphor-icons/react"
import { ButtonBase } from "@sb-components/atoms/buttons/Button/ButtonBase"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { DragScrollArea } from "@sb-components/behaviors/DragScrollArea/DragScrollArea"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE (PREREQUISITE) — `CollapsibleSidebar`: the content-agnostic shell that the
 * real `src` `LearnSidebar` (and any future left-nav sidebar) mounts into. Owns
 * ONLY the chrome — collapse/expand, the width animation, persisting the choice
 * to `localStorage`, and handing `collapsed` down via context — and knows NOTHING
 * about what a nav row is. Ported near-verbatim from
 * `src/components/blocks/navigation/CollapsibleSidebar/index.tsx` (read-only
 * reference); this pass only re-homes it as a Storybook-driven port.
 *
 * ⚠️ FOLDER JUDGMENT CALL: per the team's §5b architecture call (see
 * `.claude/fe/steps/11-overlays-layouts-brainstorm.md` §5b) this is genuinely
 * COMPOSITE tier — a shared, domain-blind shell — and belongs under
 * `components/composites/`. This run's write scope is restricted to
 * `components/starci/**`/`stories/starci/**` (STARCI app only), and
 * `components/composites/` is read-only reference for this agent. It is filed
 * here, next to `WorkSessionHeader`/`NavLinks` (the existing `navigation` group),
 * built to composite discipline regardless of folder (no domain knowledge, no
 * feature wording, no business decision) — flag for a follow-up move to
 * `components/composites/layout/` by whichever pass owns that folder.
 *
 * REUSE, not hand-roll (per this run's REUSE FIRST rule):
 *   • `DragScrollArea` (frame/behavior tier) for the nav's scroll region instead
 *     of a bare HeroUI `ScrollShadow` — it already hides the scrollbar AND adds
 *     the Windows-safe pointer-pan fallback, exactly the "hidden scrollbar region
 *     usable on Windows" need a nav rail has. It does not itself lay out children
 *     in a column, so a `StackV` sits inside it for the `gap={4}` rhythm the
 *     real component wrote by hand as `flex flex-col gap-3`.
 *   • `ButtonBase` (`isIconOnly`) for the toggle instead of raw HeroUI `Button`.
 *   • `Typography` (`size="h5"` `weight="bold"` `truncate`) for the title instead
 *     of raw HeroUI `Typography`.
 *
 * The outer `motion.aside` stays a bespoke element (not `Container`/`Stack`):
 * no frame in this tree can express an ANIMATED width or the collapsed-vs-
 * expanded ASYMMETRIC padding (`px-3 py-6` rail vs `p-6` panel — `Stack`/`Flex`
 * padding is a single uniform `InsetScale` step). Same precedent as `Toolbar` /
 * `ModalShell` / `DrawerShell`, which also hand-write their own root chrome
 * classes rather than nesting themselves inside another frame.
 *
 * `SidebarCollapsedContext` is inlined here (not a sibling `context.ts`, unlike
 * the `src` original) so the whole port stays the two files this run asked for;
 * `useSidebarCollapsed` is exported for whatever nav-row block eventually
 * consumes it (that block is out of scope this pass).
 *
 * NO `isSkeleton` — chrome only, not requested in this pass's prop list, and
 * `title` is caller-owned copy known synchronously, same reasoning as
 * `ContentModeNav`'s "never skeletonised, on purpose".
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Expanded panel width (full nav). */
const EXPANDED_WIDTH = "16rem"
/** Collapsed rail width — fits a centered icon row + the toggle. */
const COLLAPSED_WIDTH = "4rem"

/**
 * Named transition shapes (not inline object literals at the call site — check-inline-types
 * gate) for the width animation: a spring when motion is welcome, instant when the reader (or
 * their OS) asked for reduced motion.
 */
const SPRING_TRANSITION = { type: "spring" as const, stiffness: 420, damping: 38 }
const INSTANT_TRANSITION = { duration: 0 }
/** Title fade — quick cross-fade, same instant fallback under reduced motion. */
const FADE_TRANSITION = { duration: 0.15 }

/**
 * Collapsed flag shared with nav-row children so a row can drop to icon-only in
 * the rail. Internal UI chrome state — not an app store.
 */
const SidebarCollapsedContext = createContext(false)

/** Read whether the surrounding {@link CollapsibleSidebar} is collapsed (icon-rail). */
export const useSidebarCollapsed = (): boolean => useContext(SidebarCollapsedContext)

/** Props for the {@link CollapsibleSidebar} composite. */
export interface CollapsibleSidebarProps {
    /** Heading shown in the panel header (hidden while collapsed). */
    title: string
    /** Accessible label for the collapse toggle (expanded state). */
    collapseLabel: string
    /** Accessible label for the expand toggle (collapsed state). */
    expandLabel: string
    /**
     * Stable key under which the collapsed flag persists in `localStorage`, so
     * the choice survives navigation between pages that share this sidebar.
     */
    storageKey: string
    /**
     * Optional node pinned BETWEEN the header and the scrollable nav — always
     * visible (outside the scroll area). Rendered inside the collapsed-context
     * provider, so it can adapt to the rail (e.g. a resume pill → play icon).
     */
    topSlot?: ReactNode
    /** The panel body — nav rows/groups; content-agnostic, this shell never inspects them. */
    children: ReactNode
    className?: string
}

/**
 * A left navigation sidebar that collapses IN PLACE: the panel animates between
 * a full {@link EXPANDED_WIDTH} (title + nav) and a thin {@link COLLAPSED_WIDTH}
 * rail (just the toggle), and the surrounding content reflows beside it — no
 * overlay/Drawer. Self-contained: the collapsed state is local UI chrome,
 * hydrated from storage on mount (SSR-safe — starts expanded, then syncs).
 *
 * @param props - {@link CollapsibleSidebarProps}
 */
export const CollapsibleSidebar = ({
    title,
    collapseLabel,
    expandLabel,
    storageKey,
    topSlot,
    children,
    className,
}: CollapsibleSidebarProps) => {
    const reduceMotion = useReducedMotion()
    const [collapsed, setCollapsed] = useState(false)

    // hydrate the persisted choice after mount (avoids SSR/client mismatch)
    useEffect(() => {
        const stored = window.localStorage.getItem(storageKey)
        if (stored !== null) {
            setCollapsed(stored === "true")
        }
    }, [storageKey])

    /** Flip + persist the collapsed flag. */
    const toggle = () => {
        setCollapsed((prev) => {
            const next = !prev
            window.localStorage.setItem(storageKey, String(next))
            return next
        })
    }

    // header: toggle always present; title fades out while collapsed
    const headerRow = (
        <>
            <AnimatePresence initial={false}>
                {!collapsed ? (
                    <motion.div
                        key="title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={reduceMotion ? INSTANT_TRANSITION : FADE_TRANSITION}
                        className="min-w-0"
                    >
                        <Typography
                            size="h5"
                            weight="bold"
                            truncate
                            text={title}

                        />
                    </motion.div>
                ) : null}
            </AnimatePresence>
            <ButtonBase
                isIconOnly
                variant="ghost"
                size="sm"
                ariaLabel={collapsed ? expandLabel : collapseLabel}
                prefixIcon={SidebarSimpleIcon}
                onPress={toggle}

            />
        </>
    )

    // §10a: the vertical rhythm between header / topSlot / nav is owned by THIS
    // StackV's gap — no section carries its own margin (a prior draft put
    // `mb-6` on the header row itself, flagged by check-padding as a second
    // owner for the same seam).
    const panel = (
        <>
            <StackH gap={3} justify={collapsed ? "center" : "between"} body={headerRow} />

            {/* pinned top slot (e.g. resume pill) — above the scroll area, always
                visible. min-w-0: a column-flex item defaults to content-width
                (min-width: auto), which would let it overflow the rail and get
                hard-clipped by overflow-hidden instead of shrinking so its own
                `truncate` text can ellipsize. */}
            <div className="min-w-0">
                {topSlot}
            </div>

            {/* body: the nav — ALWAYS rendered; row content decides its own icon-only
                look off `useSidebarCollapsed`. `DragScrollArea` owns the overflow
                (hidden scrollbar + Windows-safe pointer-pan); `StackV` gives the
                column its `gap={4}` rhythm and default `align="stretch"` (rows
                fill the rail's width whether expanded or collapsed), since the scroll
                frame itself lays out nothing. */}
            <nav
                className="flex min-h-0 flex-1 flex-col"

            >
                <DragScrollArea size={40} className="flex-1">
                    <StackV gap={4} body={children} />
                </DragScrollArea>
            </nav>
        </>
    )

    return (
        <SidebarCollapsedContext.Provider value={collapsed}>
            <motion.aside

                initial={false}
                animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
                transition={reduceMotion ? INSTANT_TRANSITION : SPRING_TRANSITION}
                className={cn(
                    // ONE padding wrapper for the whole rail: p-6 expanded / px-3 py-6
                    // collapsed. No frame in this tree types an asymmetric inset, so this
                    // stays hand-written on the composite's own bespoke root (§13c precedent:
                    // Toolbar/ModalShell/DrawerShell do the same on theirs).
                    "flex h-full shrink-0 overflow-hidden border-r border-default",
                    collapsed ? "px-3 py-6" : "p-6",
                    className,
                )}
            >
                <StackV gap={6} classNames={["min-h-0", "flex-1"]} body={panel} />
            </motion.aside>
        </SidebarCollapsedContext.Provider>
    )
}
