import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ResponsiveRowSwitch } from "@/components/frames/ResponsiveRow"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { principleAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME (frame) -- `SplitWorkspace`: the READ-COLUMN + STICKY-ASIDE workspace
 * shape -- a brief/content column that grows, beside a fixed-width action column
 * that pins to the viewport once there's room for both side by side.
 *
 * AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1): renamed the tier
 * label "LAYOUT" → "FRAME" -- this file lives in the `frames/` folder, and
 * naming §6 already SETTLED (2026-07-29, the disc as referee):
 * `frame` = `frames/`, `layout` = `<app>/layouts/`, two different tiers. Also
 * removed the fake `.Base` namespace declaration below -- this file really
 * exports BARE (confirmed across every call-site), not a namespace.
 *
 * WHY THIS FRAME EXISTS (per the teacher's note, 2026-07-29: "desktop should
 * render as flex, shouldn't it?"). Real `src` has this EXACT shape TWICE, byte-for-byte identical CSS --
 * `ChallengeView/index.tsx:195` and `PersonalProjectWorkspace/index.tsx:61` --
 * and BOTH corresponding Storybook screens (`ChallengePage`, `PersonalProjectTaskPage`)
 * worked around its absence with `StackH gap="section" align="start" wrap`
 * holding two `StackV` children, each self-flagging the exact same comment:
 * *"the BEST-AVAILABLE substitute... this design system has no dedicated
 * 'reading column + fixed aside' frame yet"*. `StackH` is a FIXED horizontal
 * axis (§13, by design -- two `Stack.*` members = two axes, chosen by the
 * caller, never switching on their own) -- with `wrap` and the main column's
 * `min-w-0 flex-1` (free to shrink without limit), the row almost never
 * actually wraps, so the split was rendering side-by-side at EVERY width,
 * mobile included, instead of stacking cleanly below desktop like `src` does.
 *
 * `flex-col` (mobile/tablet) → `@app-xl:flex-row` (desktop, `src`'s own
 * breakpoint) is not a generic "responsive Stack" ask -- it is THIS one named
 * shape, so it gets its own frame instead of a new prop bolted onto `Stack.*`
 * that would blur what "two axes" means there.
 *
 * `at` NAMES THE BREAKPOINT (FRAME-10), EVERY OTHER NUMBER STAYS HARD-OWNED
 * (§6c: a layout frame owns its internal sizing). Both real `src` sources agree
 * on `@app-xl` as the switch step, so `at` defaults to `xl` and an unmigrated
 * caller renders identically -- but the step itself is now a
 * `ResponsiveRowSwitch` prop instead of a bare string in `cn(...)`, so it is
 * readable from the prop list. `gap-6`/`gap-8`, `w-[360px]`, `top-24` and
 * `max-h-[calc(100dvh-7rem)]` are the SAME in both sources -- there is no second
 * shape to generalize for yet. Add a prop for one of those only when a THIRD
 * real consumer actually disagrees with it.
 *
 * FRAME API LAW (§13b): two DISTINCT roles ⇒ two NAMED slots (`main`/`aside`),
 * not a single `children` -- a workspace has no "one obvious slot" the way
 * `Container`/`Stack` do.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link SplitWorkspace}. */
export interface SplitWorkspaceProps {
    /** The reading column -- grows, shrinks without limit (`min-w-0 flex-1`). */
    main: ComponentTypeWithSkeleton
    /**
     * The action column -- full width and stacked below `main` under `@app-xl`;
     * pins to a `360px` sticky rail beside it from `@app-xl` up.
     */
    aside: ComponentTypeWithSkeleton
    /** Renders `main`/`aside` in their skeleton state. */
    isSkeleton?: boolean
    /**
     * Container step `aside` drops below `main` and pins beside it at.
     * Defaults to `xl` -- the step both real sources agree on.
     */
    at?: ResponsiveRowSwitch
    /** Where this sits inside its parent. Appearance is not passable -- it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises - one token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, ...). Emitted as `data-principle` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * Query as `[data-principle="token"]`. A frame does not KNOW its pattern - the caller does - so it is passed in.
     */
    principle?: PrincipleToken
    /**
     * Why this layer exists - one sentence, emitted as `data-explain` beside the token.
     * A reason, never a restatement of `principle`.
     */
    explain?: ExplainReason
    /**
     * Caller identity to wear on this workspace's root instead of `SplitWorkspace`'s own --
     * pass this when a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a
     * shape of its own) is using this workspace AS its root element, instead of wrapping it
     * in a raw `<div data-tier=... data-component=...>`. See `_identity.ts`. Omitted → this
     * workspace keeps emitting `data-tier="frame" data-component="SplitWorkspace"`, unchanged.
     */
    identity?: CallerIdentity
}

/**
 * Switch step → the wrapper classes that flip the workspace from stacked to a
 * side-by-side row from that step up. Written out per step for the same reason
 * `ResponsiveRow`'s table is: Tailwind never emits an interpolated `@app-${step}:flex-row`.
 */
const WORKSPACE_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:flex-row @app-sm:items-start @app-sm:gap-8",
    md: "@app-md:flex-row @app-md:items-start @app-md:gap-8",
    lg: "@app-lg:flex-row @app-lg:items-start @app-lg:gap-8",
    xl: "@app-xl:flex-row @app-xl:items-start @app-xl:gap-8"}

/** Switch step → the sticky, fixed-width `aside` classes from that step up. */
const ASIDE_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:sticky @app-sm:top-24 @app-sm:max-h-[calc(100dvh-7rem)] @app-sm:w-[360px] @app-sm:self-start @app-sm:overflow-y-auto",
    md: "@app-md:sticky @app-md:top-24 @app-md:max-h-[calc(100dvh-7rem)] @app-md:w-[360px] @app-md:self-start @app-md:overflow-y-auto",
    lg: "@app-lg:sticky @app-lg:top-24 @app-lg:max-h-[calc(100dvh-7rem)] @app-lg:w-[360px] @app-lg:self-start @app-lg:overflow-y-auto",
    xl: "@app-xl:sticky @app-xl:top-24 @app-xl:max-h-[calc(100dvh-7rem)] @app-xl:w-[360px] @app-xl:self-start @app-xl:overflow-y-auto"}

/**
 * The read-column + sticky-aside split. See the file header for why this is
 * its own frame and why `at` is its only sizing prop.
 *
 * @param props - {@link SplitWorkspaceProps}
 */
const SplitWorkspace = ({
    main: Main,
    aside: Aside,
    at = "xl",
    isSkeleton,
    classNames,
    principle,
    explain,
    identity}: SplitWorkspaceProps) => (
    <div
        {...resolveIdentity(identity, { tier: "frame", name: "SplitWorkspace" })}
        data-principle={principleAttr(principle)}
        data-explain={explainAttr(explain)}
        className={cn("flex flex-col gap-6", WORKSPACE_SWITCH_CLASS[at], classNames)}
    >
        {/* `main`/`aside` are CALLER SLOTS -- the node inside belongs to whoever passed it, not
            to this frame, so neither gets a badge of its own (same as `Container.body`'s bare
            render -- a badge here would be "declare it or stop badging it" with nothing to
            declare, since there is no `SplitWorkspace`-owned content at either position). */}
        <div className="min-w-0 flex-1">
            <Main isSkeleton={isSkeleton} />
        </div>
        <aside className={cn("w-full shrink-0", ASIDE_SWITCH_CLASS[at])}>
            <Aside isSkeleton={isSkeleton} />
        </aside>
    </div>
)

export { SplitWorkspace }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "SplitWorkspace" } as const
