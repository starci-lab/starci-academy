import { cn } from "@heroui/react"
import type { ResponsiveRowSwitch } from "@/components/frames/ResponsiveRow"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { principleAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

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
 * WARNING: APP-WIRE HANDOFF -- the EXACT two things the app must have for this to render
 * as a right rail instead of the stacked list the shell shipped with:
 * 1. The class this component now puts on its own outer node -- the Tailwind v4
 *    utility `@container` (compiles to `container-type: inline-size`). Nothing
 *    ELSE needs to open a container context; `RailShell` no longer trusts an
 *    ancestor for this (see the note above) -- it is self-contained as of this fix.
 * 2. The `--container-app-sm/md/lg/xl` custom properties, declared inside an
 *    `@theme { }` block in this book's `src/app/globals.css` (40rem / 48rem / 64rem
 *    / 80rem -- pinned to the viewport `sm/md/lg/xl` pixel values, see that file's
 *    comment for why). These are what make the `@app-sm:`/`@app-md:`/`@app-lg:`/
 *    `@app-xl:` utility CLASSES exist in the compiled CSS at all -- Tailwind only
 *    generates a `@app-md:` variant where `--container-app-md` is defined somewhere
 *    in the build's `@theme`. Point 1 without point 2 compiles fine and renders
 *    stacked forever with NO error, because the `@app-md:flex-row` class name is
 *    real but matches nothing.
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
    /**
     * The layout pattern this frame's seam realises -- a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, ...). Emitted as `data-principle` on the
     * element that carries the gap, so the rendered-tree test can assert the seam is the step
     * the pattern names. One token per instance.
     */
    principle?: PrincipleToken
    /**
     * Why this layer exists -- one sentence, emitted as `data-explain` beside the token.
     * A reason, never a restatement of `principle`.
     */
    explain?: ExplainReason
    /**
     * Caller identity to wear on this shell's root instead of the frame's own -- pass this when
     * a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its own)
     * is using this shell AS its root element, instead of wrapping it in a raw `<div
     * data-tier=... data-component=...>`. See `_identity.ts`. Omitted -> this shell keeps emitting
     * its own `data-tier="frame" data-component="RailShell"`, unchanged.
     */
    identity?: CallerIdentity
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
 * The leading-rail shell. See the file header for why this is its own frame and
 * why `at`, `isRailSticky`, and `side` are its only props beyond the two slots.
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
    
    principle,
    explain,
    identity,
}: RailShellProps) => {
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
    return (
        <div
            {...resolveIdentity(identity, { tier: "frame", name: "RailShell" })}
            className={cn("@container w-full")}
        >
            <div
                data-principle={principleAttr(principle)}
                data-explain={explainAttr(explain)}
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
