import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ResponsiveRowSwitch } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME (khung) — `RailShell`: a LEADING rail that introduces the page, beside a
 * body column that grows. The rail comes FIRST in reading order and never
 * shrinks; the body follows and absorbs every remaining pixel.
 *
 * ⭐ WHY THIS IS NOT `SplitWorkspace`. That khung is the mirror image and a
 * different job: its `main` reading column comes first and the `aside` is a
 * 360px action rail that pins beside it. Here the rail LEADS — it is who you
 * are, or where you are, and the body is what you came to read. Same two boxes,
 * opposite reading order, opposite shrink strategy. Folding both into one khung
 * would need a `railFirst` flag, and a flag that reverses reading order is not
 * a variant of one shape, it is two shapes sharing a file.
 *
 * ⭐ WHY IT EXISTS AT ALL (audit 2026-07-30, dashboard overview). Real `src` has
 * this exact shape TWICE and both wrote it by hand:
 *   • `features/dashboard/index.tsx:61-67` — identity rail, then the open tab
 *   • `features/profile/Settings/SettingsLayout/index.tsx:62-96` — settings nav
 *     rail, then the settings panel
 * Both hand-rolled `@app-md:flex-row` on the wrapper, `shrink-0` on the aside
 * and `min-w-0 flex-1` on the main — the 44th and 45th call sites of the
 * shrink-strategy pattern `Split` was built to own in ONE place. Two independent
 * cases stating the same lack is the bar for a new khung (`frame` decision
 * sheet), and it is met.
 *
 * ⭐ THE RAIL IS `shrink-0`, THE BODY IS `min-w-0`. This is the whole contract,
 * and it is why the sides are NAMED. A caller who writes the two columns by
 * hand has to remember both classes at every call site; naming them puts the
 * rule in one file. Without `min-w-0` the body refuses to shrink below its
 * content and pushes the rail off-screen — a failure that only shows up once
 * real long content arrives.
 *
 * ⭐ `at` NAMES THE BREAKPOINT (FRAME-10), 288px IS STILL HARD-OWNED. Both real
 * sources agree on the switch step and on the rail width, so the width stays a
 * constant (§6c: a khung owns its own sizing) — but the STEP itself is a
 * `ResponsiveRowSwitch` prop, defaulting to `md` (both sources' step), so the
 * threshold is readable from the prop list instead of buried in a class string.
 * They DISAGREE on sticky — dashboard scrolls its rail with the page, settings
 * pins its rail to the viewport — so `isRailSticky` is a prop for the same
 * reason. A number becomes a prop when a real consumer disagrees, not before.
 *
 * ⭐ NO `wrap`. The breakpoint is declared, not hoped for. `wrap` carries no
 * threshold: the body shrinks without limit so the row almost never wraps, which
 * is exactly how two screens shipped with their columns glued together at every
 * width including mobile (`responsive` decision sheet).
 *
 * KHUNG API LAW (§13b): two DISTINCT roles ⇒ two NAMED slots (`rail`/`body`),
 * never a single `children`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link RailShell}. */
export interface RailShellProps {
    /**
     * The LEADING column — identity, navigation, standing. Full width and stacked
     * above `body` under `@app-md`; a fixed `288px` column beside it from `@app-md` up.
     * Never shrinks.
     */
    rail: ReactNode
    /**
     * The FOLLOWING column — the content the reader came for. Grows into whatever
     * the rail leaves, and shrinks without limit (`min-w-0`) so long content
     * truncates inside it rather than pushing the rail away.
     */
    body: ReactNode
    /**
     * Container step the rail drops below `body` and becomes a side-by-side row at.
     * Defaults to `md` — the step both real sources agree on.
     */
    at?: ResponsiveRowSwitch
    /**
     * Pin the rail to the viewport once the two sit side by side. Off by default:
     * the rail scrolls with the page. Turn it on only when the rail is navigation
     * the reader returns to while the body scrolls past it.
     */
    isRailSticky?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises — a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, …). Emitted as `data-principles` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * A frame does not KNOW its pattern — the caller does — so it is passed in.
     */
    pattern?: string
}

/**
 * Switch step → the wrapper classes that flip the shell from stacked to a side-by-side
 * row from that step up. Written out per step for the same reason `ResponsiveRow`'s table
 * is: Tailwind never emits an interpolated `@app-${step}:flex-row`.
 */
const SHELL_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:flex-row @app-sm:items-start @app-sm:gap-8",
    md: "@app-md:flex-row @app-md:items-start @app-md:gap-8",
    lg: "@app-lg:flex-row @app-lg:items-start @app-lg:gap-8",
    xl: "@app-xl:flex-row @app-xl:items-start @app-xl:gap-8",
}

/** Switch step → the fixed `288px` rail width from that step up. */
const RAIL_WIDTH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:w-72",
    md: "@app-md:w-72",
    lg: "@app-lg:w-72",
    xl: "@app-xl:w-72",
}

/** Switch step → the sticky-rail classes, applied only when `isRailSticky`. */
const RAIL_STICKY_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:sticky @app-sm:top-24 @app-sm:max-h-[calc(100dvh-7rem)] @app-sm:self-start @app-sm:overflow-y-auto",
    md: "@app-md:sticky @app-md:top-24 @app-md:max-h-[calc(100dvh-7rem)] @app-md:self-start @app-md:overflow-y-auto",
    lg: "@app-lg:sticky @app-lg:top-24 @app-lg:max-h-[calc(100dvh-7rem)] @app-lg:self-start @app-lg:overflow-y-auto",
    xl: "@app-xl:sticky @app-xl:top-24 @app-xl:max-h-[calc(100dvh-7rem)] @app-xl:self-start @app-xl:overflow-y-auto",
}

/**
 * The leading-rail shell. See the file header for why this is its own khung and
 * why `at` and `isRailSticky` are its only props beyond the two slots.
 *
 * @param props - {@link RailShellProps}
 */
const RailShell = ({
    rail,
    body,
    at = "md",
    isRailSticky = false,
    classNames,
    pattern,
}: RailShellProps) => (
    <div
        data-tier="frame"
        data-component="RailShell"

        data-principles={pattern}
        className={cn("flex flex-col gap-6", SHELL_SWITCH_CLASS[at], classNames)}
    >
        {/* `rail`/`body` are CALLER SLOTS — whatever sits inside belongs to whoever passed
            it, so neither gets an anatomy badge of its own (same restraint as
            `SplitWorkspace`'s two slots). */}
        <aside
            className={cn(
                "flex w-full shrink-0 flex-col",
                RAIL_WIDTH_CLASS[at],
                isRailSticky && RAIL_STICKY_CLASS[at],
            )}
        >
            {rail}
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
            {body}
        </main>
    </div>
)

export { RailShell }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "RailShell" } as const
