import React from "react"
import type { ReactNode } from "react"
import { SidebarIcon } from "@phosphor-icons/react"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT — `HeadhuntingCompaniesLayout`: the wrapper for every route under
 * `courses/[courseId]/headhunting-companies/**`. Sticky desktop course-nav
 * rail beside the routed content — nothing else.
 *
 * WHY THIS IS A LAYOUT AND NOT A PAGE (RULE 12): it answers "what wraps every
 * route in this scope", not "what does the user come here to do". It mounts
 * once per scope-entry, takes a MANDATORY `children`, and outlives whatever
 * page the router swaps underneath it — the one place `ReactNode` is valid
 * above frame tier.
 *
 * A MUCH THINNER SIBLING OF THE (not-yet-built) `LearnShell`, on purpose:
 *   - no mobile bar — the rail simply disappears below the desktop tier
 *     (`hidden … @app-lg:block`), there is no bottom-nav substitute for it.
 *   - no right rail — one aside only, unlike `learn/layout.tsx`'s outline +
 *     leaderboard rail on the other side.
 *   - no `p-6` ownership — this layout does not decide the reading column's
 *     inset; whatever page mounts inside `children` owns its own padding,
 *     same discipline `Container` already enforces one tier down.
 *   - no panel toggles — the rail is fixed, not `ResizableRail`-collapsible;
 *     `learn/layout.tsx` earns that machinery because its rail carries THREE
 *     stacked panels, this one carries one nav list.
 *
 * ⭐ §B3 SCOPE GAP, MARKED, NOT FAKED: the real nav rail is `LearnSidebar`'s
 * sibling for this route — a genuine domain block (course chapter/lesson
 * tree) that is out of reach in this pass. Rather than hand-roll a `div` that
 * pretends to be that content, the aside slot renders `AsyncContentEmpty` as
 * an HONEST placeholder: it says a nav list belongs here and has not been
 * built yet, instead of silently rendering nothing or a fake list. Composing
 * a composite directly at layout tier is the deliberate exception this
 * stands for — swap it for the real domain block the day it exists, and this
 * paragraph goes with it.
 *
 * TWO LEAVES, by STRUCTURE:
 *   - `CourseNavSidebarGap` — the aside slot, badged directly on the
 *     `AsyncContentEmpty` it renders (its `anatPart` override, per that
 *     composite's own contract) rather than on a synthetic wrapper `div`, so
 *     `check-orphan-parts` has a real story to link the badge to.
 *   - The `children` passthrough is a CALLER SLOT (§ `check-orphan-parts`,
 *     offender kind 3): whatever the router puts there belongs to that page,
 *     not to this layout's own anatomy, so the `flex-1` wrapper around it is
 *     deliberately left UNBADGED rather than claimed as a part called
 *     `ContentSlot` this layout does not actually own.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link HeadhuntingCompaniesLayout}. */
export interface HeadhuntingCompaniesLayoutProps {
    /**
     * The routed page content for this scope. MANDATORY (RULE 12) — a layout
     * with no children would be a page pretending to wrap something it doesn't.
     */
    children: ReactNode
    /** Extra class on the root track. */
    className?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this layout so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The scope wrapper for `headhunting-companies/**`. See the file header for
 * why it is a layout, why it is thinner than `LearnShell`, and why its aside
 * is a marked gap rather than a rebuilt block.
 *
 * @param props - {@link HeadhuntingCompaniesLayoutProps}
 */
const HeadhuntingCompaniesLayout = ({
    children,
    className,
}: HeadhuntingCompaniesLayoutProps) => {
    const navAndContent = (
        <>
            {/* Desktop-only rail: below the `@app-lg` tier it does not collapse into
                anything, it is simply absent — the real screen has no mobile bar. */}
            <div className="hidden shrink-0 @app-lg:sticky @app-lg:top-0 @app-lg:block @app-lg:w-64">
                <AsyncContentEmpty
                    title="Course navigation"
                    description="The course chapter/lesson tree is not built in this pass — the slot is here, the content comes later."
                    icon={SidebarIcon}

                />
            </div>
            {/* CALLER SLOT — deliberately unbadged, see file header. */}
            <div className="min-w-0 flex-1">
                {children}
            </div>
        </>
    )

    return (
        <StackH gap={6} align="start" className={className} body={navAndContent} />
    )
}

export { HeadhuntingCompaniesLayout }
