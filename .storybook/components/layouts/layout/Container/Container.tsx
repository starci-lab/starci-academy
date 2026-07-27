import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { GAP_CLASS, PADDING_CLASS, type SpaceScale } from "@sb-components/layouts/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Container.*`: CONTENT MEASURE. One member, `Container.Base`
 * (one measure has one shape; width and padding are PROPS, §6b).
 *
 * KHUNG API LAW (§13b): a wrapping khung ⇒ named slots `header`/`body`/`footer`
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
 * §10: `padding` and `gap` are {@link SpaceScale} union literals — off-scale is a
 * tsc error at the call site, not something caught in review.
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
    full: "max-w-none",
}

/** Props for {@link Container.Base}. */
export interface ContainerBaseProps {
    /**
     * Max width of the measure. Default `md` (48rem) — measured against the real app:
     * `max-w-3xl` (exactly 48rem) is the most-used measure, 72 times.
     */
    size?: ContainerSize
    /**
     * Padding around the content, §10c scale. Default `6` (teacher's call: web
     * measure = `p-6`). Set `0` when the child hugs the edge itself (edge-to-edge
     * cover image, a table that scrolls horizontally).
     */
    padding?: SpaceScale
    /**
     * Vertical seam between `header` ↔ `body` ↔ `footer`. Default `8` — PAGE rhythm,
     * deliberately wider than the rhythm inside a card (§10b). Only takes effect when
     * there's more than one region.
     */
    gap?: SpaceScale
    /** Top region — usually a `Page.Header`. */
    header?: ReactNode
    /** Main region. Equivalent to `children`; wins over `children` when both are passed. */
    body?: ReactNode
    /** Bottom region IN FLOW (page footer, closing CTA row). Not a bottom-pinned bar. */
    footer?: ReactNode
    /** Shorthand for {@link ContainerBaseProps.body} — a wrapping khung can wrap anything. */
    children?: ReactNode
    /** Extra class for the measure. */
    className?: string
    /**
     * Name THIS measure itself in the BlockAnatomy panel — overrides the default name
     * `"Container"`. Exists so the caller (screen) doesn't have to wrap an extra empty
     * `div` just to attach `data-anat-part`; same mold as `SurfaceCard.*`.
     */
    anatPart?: string
    /**
     * `true` → each region emits `data-anat-part` so the BlockAnatomy panel can attach
     * a badge. Off in production.
     */
    showAnatomy?: boolean
}

/**
 * Content measure: centered, width-capped by `size`, self-padding, and OPENS
 * `@container` so every `@app-*` inside measures itself (see header).
 *
 * With no `header` and no `footer`, `body` renders RAW — a children-only call gets
 * the minimal DOM tree, no extra wrapping `div`.
 *
 * @param props - {@link ContainerBaseProps}
 */
const ContainerBase = ({
    size = "md",
    padding = 6,
    gap = 8,
    header,
    body,
    footer,
    children,
    className,
    anatPart,
    showAnatomy = false,
}: ContainerBaseProps) => {
    const main = body ?? children
    const content = header == null && footer == null
        ? main
        : (
            <div className={cn("flex flex-col", GAP_CLASS[gap])}>
                {header != null ? <div data-anat-part={showAnatomy ? "Header" : undefined}>{header}</div> : null}
                {main != null ? <div data-anat-part={showAnatomy ? "Body" : undefined}>{main}</div> : null}
                {footer != null ? <div data-anat-part={showAnatomy ? "Footer" : undefined}>{footer}</div> : null}
            </div>
        )

    return (
        // `@container` MUST sit on the same element capped by `max-w`: a container
        // query measures the box of the element that opens the container, so
        // placing it here is what lets children measure the actual measure.
        <div
            data-anat-part={anatPart ?? (showAnatomy ? "Container" : undefined)}
            className={cn(
                "@container mx-auto w-full",
                SIZE_CLASS[size],
                PADDING_CLASS[padding],
                className,
            )}
        >
            {content}
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
export const Container = {
    Base: ContainerBase,
}
