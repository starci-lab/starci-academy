import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ResponsiveRowSwitch } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"

/**
 * `RailShell` — a FRAME: a LEADING rail that introduces the page, beside a body
 * column that grows. The rail comes first in reading order and never shrinks
 * (`shrink-0`); the body follows and absorbs every remaining pixel (`min-w-0`).
 * The two sides are NAMED (`rail`/`body`) so those width rules live in one file.
 *
 * Mirror image of `SplitWorkspace`, whose reading column comes first and whose
 * aside is a pinned action rail — opposite reading order, opposite shrink
 * strategy, so it is a separate frame rather than a `railFirst` flag.
 *
 * `at` names the switch breakpoint (a `ResponsiveRowSwitch` prop, default `md`);
 * the 288px rail width stays a hard-owned constant. `isRailSticky` is a prop
 * because real consumers disagree (a scrolling identity rail vs. a viewport-pinned
 * settings rail). No `wrap` — the breakpoint is declared, not hoped for.
 *
 * Two distinct roles ⇒ two named slots, never a single `children`.
 */

/** Props for {@link RailShell}. */
export interface RailShellProps {
    /**
     * The LEADING column — identity, navigation, standing. Full width and stacked
     * above `body` under `@app-md`; a fixed `288px` column beside it from `@app-md` up.
     * Never shrinks.
     */
    rail: ComponentTypeWithSkeleton
    /**
     * The FOLLOWING column — the content the reader came for. Grows into whatever
     * the rail leaves, and shrinks without limit (`min-w-0`) so long content
     * truncates inside it rather than pushing the rail away.
     */
    body: ComponentTypeWithSkeleton
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
    /** Renders `rail`/`body` in their skeleton state. */
    isSkeleton?: boolean
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
    rail: Rail,
    body: Body,
    at = "md",
    isRailSticky = false,
    isSkeleton,
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
            <Rail isSkeleton={isSkeleton} />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
            <Body isSkeleton={isSkeleton} />
        </main>
    </div>
)

export { RailShell }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "RailShell" } as const
