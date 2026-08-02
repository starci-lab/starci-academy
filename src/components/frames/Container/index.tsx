import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { paddingClassNames, type PaddingValue, type Responsive } from "@/components/frames/_spacing"
import { principlesAttr, type PrincipleToken } from "@/components/frames/_principles"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Container.*`: CONTENT MEASURE. One member, `Container`
 * (one measure has one shape; width and padding are PROPS, §6b).
 *
 * KHUNG API LAW (§13b): a wrapping khung ⇒ ONE named slot `body`
 * are the main road, `children` is a shorthand for `body`. No repeating list, so
 * no `items`.
 *
 * ⭐ WHY THIS KHUNG EXISTS (teacher's call, 2026-07-26). The old `Page.Container`
 * had NO `mx-auto`, NO `max-w`, and padded only on the RIGHT side — so every page
 * hand-rolled its own measure: `mx-auto flex w-full max-w-3xl flex-col gap-6`
 * repeated 14 times, `mx-auto w-full max-w-3xl` 12 times, and `max-w-3xl` appeared
 * 72 times across `src`. Content measure is a REAL concept, so it deserves a named
 * khung, not a hand-copied class string.
 *
 * ⭐⭐ THIS KHUNG OPENS `@container` (teacher's call, 2026-07-26) — the single most
 * important decision in this file, read carefully before touching it:
 *
 * `@app-sm/md/lg/xl` are container queries — they measure the NEAREST `@container`.
 * Before this, only the shell (`InnerLayout`) opened one, so every grid in the app
 * listened to the APP COLUMN width — even a grid sitting inside a much narrower
 * `max-w-3xl` measure. Result: a `Grid` asking for 4 columns at the `lg` tier still
 * jumped to 4 columns even though its containing measure was only 48rem wide.
 *
 * This khung opens its OWN `@container` ⇒ every `@app-*` inside it measures **this
 * measure**, not the shell anymore. A grid in a narrow measure knows it's narrow.
 *
 * ⭐ THE NICE PAYOFF — `size` speaks the SAME LANGUAGE as the breakpoint. Both come
 * from ONE token set, `--container-app-*`, declared in `globals.css` (Tailwind v4
 * `@theme`): that same token produces both the `@app-md:` variant AND the
 * `max-w-app-md` utility. So:
 *
 * | `size` | width | `@app-*` tiers still reachable INSIDE |
 * |---|---|---|
 * | `sm` | 40rem | `@app-sm` (exact edge) |
 * | `md` | 48rem | `@app-sm` · `@app-md` (exact edge) |
 * | `lg` | 64rem | plus `@app-lg` |
 * | `xl` | 80rem | plus `@app-xl` |
 * | `full` | unbounded | up to the parent |
 *
 * Reading this table BACKWARDS also holds, and that's where it's actually useful:
 * asking for `columns={{ lg: 4 }}` inside `size="md"` is **asking for a tier that
 * never fires** — the grid will sit still at the `md` tier. Not a bug, just a
 * measure too narrow for 4 columns.
 *
 * `padding` is a {@link Responsive}<{@link PaddingValue}> — off-scale is a tsc error at
 * the call site, not something caught in review.
 * §13: no domain content, no behavior — layout only.
 * ─────────────────────────────────────────────────────────────────────────────
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
    full: "max-w-none"}

/** Props for {@link Container}. */
export interface ContainerBaseProps {
    /**
     * Max width of the measure. Default `md` (48rem) — measured against the real app:
     * `max-w-3xl` (exactly 48rem) is the most-used measure, 72 times.
     */
    size?: ContainerSize
    /**
     * Padding around the content. Default `6` (teacher's call: web measure = `p-6`). Set `1`
     * (`p-0`) when the child hugs the edge itself (edge-to-edge cover image, a table that
     * scrolls horizontally).
     */
    padding?: Responsive<PaddingValue>
    /**
     * The content this measure wraps. ONE region — a measure has no second one.
     *
     * ⭐ 2026-07-27: `header`/`footer`/`gap` were REMOVED. A container that owns page
     * regions AND the rhythm between them is doing a second job, and it did that job
     * badly: `gap` only applied when a slot was used, so `CourseContents` wrote
     * `gap="page"` and MEASURED 0px. The fix in the field was `Container > StackV` —
     * i.e. the slots were a weaker copy of `StackV`, and reality already voted.
     * A measure now owns exactly one thing: how wide the reading column is.
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
     * Name THIS measure itself in the BlockAnatomy panel, so a PARENT composition can badge
     * it as one node (§11a.1) — exactly `SurfaceCard.*`'s own contract: no default guess, the
     * caller states the name explicitly and declares it (with a real `storyId`) wherever it
     * nests this measure. ⚠️ 2026-07-28: this used to fall back to a hardcoded default name
     * `"Container"` whenever `` was on, even with no caller in sight — nobody
     * ever nested this measure as a badged part, so every one of THIS file's own stories kept
     * emitting an undeclared "Container" node the panel could never show, exactly the
     * "badge that leads nowhere" the anatomy gate exists to catch.
     */
    /**
     * The layout pattern this frame's seam realises — a token from `test-runner/patterns.mjs`
     * (`flex-action`, `label-field`, `group-boundary`, …). Emitted as `data-principles` on the element
     * that carries the gap, so the rendered-tree test can assert the seam is the step the pattern names.
     * A frame does not KNOW its pattern — the caller does — so it is passed in.
     * ⚠️ Unlike every other frame, `Container`'s OUTER div (which carries `data-tier`/
     * `data-component`) has NO padding — it is the unpadded `@container` + `max-w` measure (see
     * header note on why padding must live on a second, inner div). The padding class is on the
     * INNER div, so `data-principles` lands there too — the element that actually carries the gap.
     */
    principles?: Array<PrincipleToken>
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
    principles}: ContainerBaseProps) => {
    return (
        // TWO layers, not one (teacher 2026-07-29, "shouldn't desktop render as
        // flex?" — traced to here). A `@container` measures its QUERY CONTAINER'S
        // OWN content-box, which EXCLUDES that same element's own padding — so
        // putting `p-*` on the SAME div that opens `@container` silently shrinks
        // the measured width by the padding amount. For most `size` steps this
        // is invisible (there's slack between the cap and the next `@app-*`
        // tier up), but `size="xl"` caps at EXACTLY `max-w-app-xl` = the SAME
        // token `@app-xl` itself fires at — so the padded content-box can NEVER
        // reach 80rem, at ANY viewport width, and `@app-xl:` children never
        // fire. Confirmed live: `SplitWorkspace` inside `Container size="xl"`
        // stuck at `flex-col` even at a 1920px window. Split fixes it — the
        // OUTER div owns `@container`+`max-w` (unpadded, so it can actually
        // reach the full `size` cap), the INNER div owns padding.
        <div
            data-tier="frame"
            data-component="Container"
            className={cn(
                "@container mx-auto w-full",
                SIZE_CLASS[size],
                classNames)}
        >
            <div data-principles={principlesAttr(principles)} className={cn(...paddingClassNames(padding))}>
                {Body && <Body isSkeleton={isSkeleton} />}
            </div>
        </div>
    )
}

/**
 * `Container.*` — CONTENT MEASURE khung. Namespace, no bare component export (§13a).
 *
 * | Member | Content entry point |
 * |---|---|
 * | `.Base` | slot `header`/`body`/`footer` (+ `children` = body) |
 */
export { ContainerBase as Container }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "Container" } as const
