import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ResponsiveRowSwitch } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { principlesAttr, type PrincipleToken } from "@sb-components/frames/_principles"

/**
 * `SplitWorkspace` -- the read-column + sticky-aside workspace layout frame.
 * Every size is hard-owned. `main`/`aside` stack full-width below `@app-xl`
 * (mobile/tablet) and go side-by-side only from `@app-xl` (1280px) up.
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
    /**
     * Caller-supplied part name for the Storybook anatomy overlay. Emitted as
     * `data-anat-part`. The frame never names itself.
     */
    anatPart?: string
    /** Where this sits inside its parent. Appearance is not passable -- it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises -- a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, ...). Emitted as `data-principles` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * A frame does not KNOW its pattern -- the caller does -- so it is passed in.
     * One token per instance.
     */
    principles?: PrincipleToken
}

/**
 * Switch step -> the wrapper classes that flip the workspace from stacked to a
 * side-by-side row from that step up. Written out per step for the same reason
 * `ResponsiveRow`'s table is: Tailwind never emits an interpolated `@app-${step}:flex-row`.
 */
const WORKSPACE_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:flex-row @app-sm:items-start @app-sm:gap-8",
    md: "@app-md:flex-row @app-md:items-start @app-md:gap-8",
    lg: "@app-lg:flex-row @app-lg:items-start @app-lg:gap-8",
    xl: "@app-xl:flex-row @app-xl:items-start @app-xl:gap-8",
}

/** Switch step -> the sticky, fixed-width `aside` classes from that step up. */
const ASIDE_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:sticky @app-sm:top-24 @app-sm:max-h-[calc(100dvh-7rem)] @app-sm:w-[360px] @app-sm:self-start @app-sm:overflow-y-auto",
    md: "@app-md:sticky @app-md:top-24 @app-md:max-h-[calc(100dvh-7rem)] @app-md:w-[360px] @app-md:self-start @app-md:overflow-y-auto",
    lg: "@app-lg:sticky @app-lg:top-24 @app-lg:max-h-[calc(100dvh-7rem)] @app-lg:w-[360px] @app-lg:self-start @app-lg:overflow-y-auto",
    xl: "@app-xl:sticky @app-xl:top-24 @app-xl:max-h-[calc(100dvh-7rem)] @app-xl:w-[360px] @app-xl:self-start @app-xl:overflow-y-auto",
}

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
    principles,
    anatPart,
}: SplitWorkspaceProps) => (
    <div
        data-tier="frame"
        data-component="SplitWorkspace"
        data-anat-part={anatPart}
        data-principles={principlesAttr(principles)}
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
