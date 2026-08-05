import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ResponsiveRowSwitch } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { principlesAttr, type PrincipleToken } from "@sb-components/frames/_principles"

/**
 * WARNING: STATE SCOPE: `RailShell` is a frame with a LEADING rail + a shrinking body. The
 * state it produces is the relationship between the TWO NAMED SIDES across the
 * `@app-md` threshold: stacked when narrow, two columns when wide, and whether the
 * rail is pinned or not. The rail width (288px) and the threshold (`@app-md`) are
 * SELF-OWNED by the frame, not a prop -- the two real `src` sources agree on both
 * numbers, disagreeing only on sticky.
 *
 * WARNING: SELF-CONTAINED `@container`: this frame opens its OWN container query context
 * rather than trusting an ancestor to have opened one -- the `dashboard` real `src`
 * mounts it inside a bare `<div>` (no `Container`), so if the switch depended on an
 * ancestor `@container`, `@app-md:flex-row` never fires and the shell is stuck in
 * its stacked shape at every width, `side="end"` included. TWO layers, the same
 * split `Container` uses and for the same reason: a container query can only be
 * answered by a DESCENDANT of the element that opens it, never by that element
 * itself, so the OUTER node opens `@container` (identity + `classNames` live here)
 * and the INNER node -- a real descendant -- carries the `flex`/`gap`/switch classes
 * that actually answer `@app-md`.
 *
 * WARNING: APP-WIRE HANDOFF -- the EXACT two things apps/app must have for this to render
 * as a right rail instead of the stacked list the shell shipped with:
 * 1. The class this component now puts on its own outer node -- the Tailwind v4
 *    utility `@container` (compiles to `container-type: inline-size`). Nothing
 *    ELSE needs to open a container context; `RailShell` no longer trusts an
 *    ancestor for this (see the note above) -- it is self-contained as of this fix.
 * 2. The `--container-app-sm/md/lg/xl` custom properties, declared inside an
 *    `@theme { }` block in THIS book's `src/app/globals.css` (40rem / 48rem / 64rem
 *    / 80rem -- pinned to the viewport `sm/md/lg/xl` pixel values, see that file's
 *    comment for why). These are what make the `@app-sm:`/`@app-md:`/`@app-lg:`/
 *    `@app-xl:` utility CLASSES exist in the compiled CSS at all -- Tailwind only
 *    generates a `@app-md:` variant where `--container-app-md` is defined somewhere
 *    in the build's `@theme`. Point 1 without point 2 compiles fine and renders
 *    stacked forever with NO error, because the `@app-md:flex-row` class name is
 *    real but matches nothing. apps/app must declare the SAME four custom
 *    properties (identical rem values) in its own global stylesheet -- either by
 *    literally copying the `@theme { --container-app-* }` block, or by importing a
 *    stylesheet that does -- before `RailShell`/`DashboardShell` will lay out
 *    correctly there. This is the one step this book fix CANNOT do on apps/app's
 *    behalf; the story fixtures below only work because `.storybook/preview.tsx`
 *    imports this book's `src/app/globals.css`, which already carries that
 *    `@theme` block.
 */

/** Props for {@link RailShell}. */
export interface RailShellProps {
    /**
     * The LEADING column -- identity, navigation, standing. Full width and stacked
     * above `body` under `@app-md`; a fixed `288px` column beside it from `@app-md` up.
     * Never shrinks.
     */
    rail: ComponentTypeWithSkeleton
    /**
     * The FOLLOWING column -- the content the reader came for. Grows into whatever
     * the rail leaves, and shrinks without limit (`min-w-0`) so long content
     * truncates inside it rather than pushing the rail away.
     */
    body: ComponentTypeWithSkeleton
    /**
     * Container step the rail drops below `body` and becomes a side-by-side row at.
     * Defaults to `md` -- the step both real sources agree on.
     */
    at?: ResponsiveRowSwitch
    /**
     * Pin the rail to the viewport once the two sit side by side. Off by default:
     * the rail scrolls with the page. Turn it on only when the rail is navigation
     * the reader returns to while the body scrolls past it.
     */
    isRailSticky?: boolean
    /**
     * Which end of the row the rail sits at. `"start"` (default) keeps the rail
     * LEADING -- before `body` in the DOM and on the left once the two sit side by
     * side. `"end"` moves it to the FOLLOWING side -- after `body` in the DOM and on
     * the right -- for a shell whose navigation lives on the trailing edge. Because
     * the stacked (below-`at`) order follows the DOM order, `"end"` also drops the
     * rail BELOW the body when narrow. Left unset, behaviour is unchanged.
     */
    side?: "start" | "end"
    /** Renders `rail`/`body` in their skeleton state. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable -- it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises -- a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, ...). Emitted as `data-principles` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * A frame does not KNOW its pattern -- the caller does -- so it is passed in.
     */
    principles?: Array<PrincipleToken>
}

/**
 * Switch step -> the wrapper classes that flip the shell from stacked to a side-by-side
 * row from that step up. Written out per step for the same reason `ResponsiveRow`'s table
 * is: Tailwind never emits an interpolated `@app-${step}:flex-row`.
 */
const SHELL_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:flex-row @app-sm:items-start @app-sm:gap-8",
    md: "@app-md:flex-row @app-md:items-start @app-md:gap-8",
    lg: "@app-lg:flex-row @app-lg:items-start @app-lg:gap-8",
    xl: "@app-xl:flex-row @app-xl:items-start @app-xl:gap-8",
}

/** Switch step -> the fixed `288px` rail width from that step up. */
const RAIL_WIDTH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:w-72",
    md: "@app-md:w-72",
    lg: "@app-lg:w-72",
    xl: "@app-xl:w-72",
}

/** Switch step -> the sticky-rail classes, applied only when `isRailSticky`. */
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
    side = "start",
    isSkeleton,
    classNames,
    principles,
}: RailShellProps) => {
    // `rail`/`body` are CALLER SLOTS -- whatever sits inside belongs to whoever passed
    // it, so neither gets an anatomy badge of its own (same restraint as
    // `SplitWorkspace`'s two slots).
    const railNode = (
        <aside
            key="rail"
            className={cn(
                "flex w-full shrink-0 flex-col",
                RAIL_WIDTH_CLASS[at],
                isRailSticky && RAIL_STICKY_CLASS[at],
            )}
        >
            <Rail isSkeleton={isSkeleton} />
        </aside>
    )
    const bodyNode = (
        <main key="body" className="flex min-w-0 flex-1 flex-col">
            <Body isSkeleton={isSkeleton} />
        </main>
    )
    // `side` only re-orders the two named columns; every self-owned number (the 288px
    // rail width, the `@app-*` threshold, `shrink-0` on the rail, `min-w-0` on the body)
    // is identical either way, so "end" is a mirror, not a second layout.
    return (
        // OUTER: opens `@container` + `w-full` so the switch below always has a query
        // context, whatever the caller wrapped this in (see file header). Carries
        // identity (`data-tier`/`data-component`) and `classNames` -- same split as
        // `Container`'s outer/inner, `classNames` living beside identity there too.
        <div
            data-tier="frame"
            data-component="RailShell"

            className={cn("@container w-full", classNames)}
        >
            {/* INNER: a real descendant of the `@container` above, so `@app-md:flex-row`
                actually answers it. Carries the gap, so `data-principles` lands here --
                the element that carries the gap, not the identity node beside it. */}
            <div
                data-principles={principlesAttr(principles)}
                className={cn("flex flex-col gap-6", SHELL_SWITCH_CLASS[at])}
            >
                {side === "end" ? [bodyNode, railNode] : [railNode, bodyNode]}
            </div>
        </div>
    )
}

export { RailShell }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "RailShell" } as const
