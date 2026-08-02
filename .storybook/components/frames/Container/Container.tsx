import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
import { paddingClassNames, type PaddingValue, type Responsive } from "@sb-components/frames/_spacing"

/**
 * `Container` — a LAYOUT frame for CONTENT MEASURE. One member; width and padding
 * are props. A wrapping frame ⇒ one named slot `body` (`children` is shorthand
 * for it); no repeating list, so no `items`.
 *
 * Applies `mx-auto` + `max-w` so pages don't hand-roll their own measure.
 *
 * Opens its OWN `@container`: `@app-sm/md/lg/xl` variants inside it measure this
 * measure, not the app column, so a grid in a narrow measure knows it is narrow.
 *
 * `size` speaks the same language as the breakpoints — both come from the
 * `--container-app-*` token set in `globals.css`:
 *
 * | `size` | width | `@app-*` tiers reachable inside |
 * |---|---|---|
 * | `sm` | 40rem | `@app-sm` |
 * | `md` | 48rem | `@app-sm` · `@app-md` |
 * | `lg` | 64rem | plus `@app-lg` |
 * | `xl` | 80rem | plus `@app-xl` |
 * | `full` | unbounded | up to the parent |
 *
 * Asking for `columns={{ lg: 4 }}` inside `size="md"` requests a tier that never
 * fires — the grid stays at the `md` tier; the measure is just too narrow.
 *
 * `padding` is a {@link Responsive}<{@link PaddingValue}> — off-scale is a tsc
 * error at the call site. No domain content, no behavior — layout only.
 */

/**
 * Measure width. Each tier points DIRECTLY at a `--container-app-*` token, so the
 * measure and the breakpoint never drift apart (see the table in the header).
 */
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full"

/**
 * Tier → `max-w-*` utility generated from the same `--container-app-*` token.
 *
 * Written as literals because Tailwind never emits an interpolated string like
 * `max-w-app-${size}`.
 * ⚠️ DON'T swap these for `max-w-3xl`/`max-w-5xl` to "tidy up": those numbers match
 * today's values (48rem/64rem) but are a DIFFERENT SOURCE — if the token changes,
 * the measure and the breakpoint drift apart silently, with no error to catch it.
 */
const SIZE_CLASS: Record<ContainerSize, string> = {
    sm: "max-w-app-sm",
    md: "max-w-app-md",
    lg: "max-w-app-lg",
    xl: "max-w-app-xl",
    full: "max-w-none",
}

/** Props for {@link Container}. */
export interface ContainerBaseProps {
    /**
     * Max width of the measure. Default `md` (48rem) — measured against the real app:
     * `max-w-3xl` (exactly 48rem) is the most-used measure, 72 times.
     */
    size?: ContainerSize
    /**
     * Padding around the content. Default `6`. Set `1`
     * (`p-0`) when the child hugs the edge itself (edge-to-edge cover image, a table that
     * scrolls horizontally).
     */
    padding?: Responsive<PaddingValue>
    /**
     * The content this measure wraps. ONE region — a measure has no second one.
     * A measure owns exactly one thing: how wide the reading column is.
     *
     * BUILDABLE — an uncalled `ComponentType<{isSkeleton?}>` the measure renders itself
     * (`<Body isSkeleton={isSkeleton} />`), so it can build both the real and shimmer state
     * from one source instead of a caller hand-mirroring a skeleton beside the real content.
     */
    body?: ComponentTypeWithSkeleton
    /** `true` → passes `isSkeleton` down to `body` so the measure's content shimmers. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this frame's seam realises — a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, …). Emitted as `data-principles` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * A frame does not KNOW its pattern — the caller does — so it is passed in.
     * ⚠️ Unlike every other frame, `Container`'s OUTER div (which carries `data-tier`/
     * `data-component`) has NO padding — it is the unpadded `@container` +
     * `max-w` measure (see header note on why padding must live on a second, inner div). The
     * padding class is on the INNER div, so `data-principles` lands there too — the element that
     * actually carries the gap, per this change's own rule, not the element beside the other
     * data-* markers.
     */
    pattern?: string
}

/**
 * Content measure: centered, width-capped by `size`, self-padding, and OPENS
 * `@container` so every `@app-*` inside measures itself (see header).
 *
 * With no `header` and no `footer`, `body` renders RAW — no extra wrapping `div`.
 *
 * @param props - {@link ContainerBaseProps}
 */
const ContainerBase = ({
    size = "md",
    padding = 6,
    body: Body,
    isSkeleton,
    classNames,
    pattern,
}: ContainerBaseProps) => {
    return (
        // TWO layers, not one. A `@container` measures its QUERY CONTAINER'S
        // OWN content-box, which EXCLUDES that same element's own padding — so
        // putting `p-*` on the SAME div that opens `@container` silently shrinks
        // the measured width by the padding amount. For most `size` steps this
        // is invisible (there's slack between the cap and the next `@app-*`
        // tier up), but `size="xl"` caps at EXACTLY `max-w-app-xl` = the SAME
        // token `@app-xl` itself fires at — so the padded content-box can NEVER
        // reach 80rem, at ANY viewport width, and `@app-xl:` children never
        // fire. Split fixes it — the
        // OUTER div owns `@container`+`max-w` (unpadded, so it can actually
        // reach the full `size` cap), the INNER div owns padding.
        <div
            data-tier="frame"
            data-component="Container"

            className={cn(
                "@container mx-auto w-full",
                SIZE_CLASS[size],
                classNames,
            )}
        >
            <div data-principles={pattern} className={cn(...paddingClassNames(padding))}>
                {Body && <Body isSkeleton={isSkeleton} />}
            </div>
        </div>
    )
}

/**
 * `Container.*` — CONTENT MEASURE frame. Namespace, no bare component export (§13a).
 *
 * | Member | Content entry point |
 * |---|---|
 * | `.Base` | slot `header`/`body`/`footer` (+ `children` = body) |
 */
export { ContainerBase as Container }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "Container" } as const
