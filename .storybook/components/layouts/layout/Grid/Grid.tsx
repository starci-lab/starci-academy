import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { GAP_CLASS, type SpaceScale } from "@sb-components/layouts/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Grid.*`: the responsive lưới of equal cells. One member,
 * `Grid.Base` (a grid has one shape; density is a PROP, §6b).
 *
 * KHUNG API LAW (§13b) — REPEATING LIST ⇒ `items` DATA, `children` FORBIDDEN.
 * A grid's premise is that every cell is the same kind of thing; children would
 * let one cell be something else and quietly break the premise.
 *
 * ⭐ CONTAINER QUERIES, NOT VIEWPORT (`@app-*`, `globals.css`): the app shell is a
 * split — the whole app renders in a left column that a docked AI rail can narrow
 * at will. A grid that read `md:` would keep 3 columns while its own column had
 * been squeezed to 400px. `@app-sm/md/lg` are pinned to the SAME pixel values as
 * the viewport scale, so the steps read the same but measure the CONTAINER.
 * (Tailwind's built-in `@sm/@md/@lg` are a DIFFERENT, half-size scale — using
 * them here would silently halve every breakpoint.) These variants resolve
 * against the nearest `@container` ancestor, which the app shell (and the
 * Storybook preview) already provides — this khung deliberately does NOT open its
 * own container, or every grid would answer to its own width instead of the shell's.
 *
 * §10: `gap` is a {@link SpaceScale} union literal and REQUIRED.
 * §13: no domain content, no behaviour — placement only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One cell of a {@link Grid.Base}. */
export interface GridItem {
    /** Stable React key. */
    key: string
    /** The cell's content — a card, a tile, a stat. */
    content: ReactNode
}

/**
 * Column count per CONTAINER step. Every step is OPTIONAL and INHERITS the last
 * one set below it, so `{ base: 1, md: 2 }` means 1 column until the `@app-md`
 * step and 2 from there up. Counts are capped per step on purpose: 4 columns
 * inside a narrow shell would be unreadable, so the type refuses it.
 */
export interface GridColumns {
    /** Columns at the narrowest. Default `1`. */
    base?: 1 | 2
    /** From the `@app-sm` container step (40rem / 640px). */
    sm?: 1 | 2 | 3
    /** From the `@app-md` container step (48rem / 768px). */
    md?: 1 | 2 | 3 | 4
    /** From the `@app-lg` container step (64rem / 1024px). */
    lg?: 1 | 2 | 3 | 4
}

// Tailwind never emits an interpolated `@app-md:grid-cols-${n}` — every supported
// count is written out so the class actually ships in the compiled CSS.
/** Base (narrowest) column count → literal class. */
const BASE_COLUMNS_CLASS: Record<1 | 2, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
}
/** `@app-sm` step → literal class. */
const SM_COLUMNS_CLASS: Record<1 | 2 | 3, string> = {
    1: "@app-sm:grid-cols-1",
    2: "@app-sm:grid-cols-2",
    3: "@app-sm:grid-cols-3",
}
/** `@app-md` step → literal class. */
const MD_COLUMNS_CLASS: Record<1 | 2 | 3 | 4, string> = {
    1: "@app-md:grid-cols-1",
    2: "@app-md:grid-cols-2",
    3: "@app-md:grid-cols-3",
    4: "@app-md:grid-cols-4",
}
/** `@app-lg` step → literal class. */
const LG_COLUMNS_CLASS: Record<1 | 2 | 3 | 4, string> = {
    1: "@app-lg:grid-cols-1",
    2: "@app-lg:grid-cols-2",
    3: "@app-lg:grid-cols-3",
    4: "@app-lg:grid-cols-4",
}

/** Props for {@link Grid.Base}. */
export interface GridBaseProps {
    /**
     * The cells, in reading order. REQUIRED — repeat list = DATA, never children
     * (§13b). An empty array renders an empty track; the empty MESSAGE is the
     * caller's to phrase, not the khung's.
     */
    items: ReadonlyArray<GridItem>
    /**
     * Column count per container step — REQUIRED, so the reflow is always a
     * decision. Steps are emitted in ascending width order (later wins).
     */
    columns: GridColumns
    /** Seam between cells on the §10 scale — REQUIRED, union literal only. Both axes. */
    gap: SpaceScale
    className?: string
    /** `true` → tag each cell with `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The responsive lưới. See the file header for why the steps are container
 * queries and not viewport breakpoints.
 *
 * @param props - {@link GridBaseProps}
 */
const GridBase = ({ items, columns, gap, className, showAnatomy = false }: GridBaseProps) => (
    <div
        className={cn(
            "grid",
            GAP_CLASS[gap],
            BASE_COLUMNS_CLASS[columns.base ?? 1],
            // Ascending order: a later (wider) step must be able to win.
            columns.sm != null && SM_COLUMNS_CLASS[columns.sm],
            columns.md != null && MD_COLUMNS_CLASS[columns.md],
            columns.lg != null && LG_COLUMNS_CLASS[columns.lg],
            className,
        )}
    >
        {items.map((item) =>
            showAnatomy ? (
                // `min-w-0` keeps a long-text cell from blowing out its track
                // (grid items default to `min-width:auto`).
                <div key={item.key} className="min-w-0" data-anat-part="Cell">
                    {item.content}
                </div>
            ) : (
                <React.Fragment key={item.key}>{item.content}</React.Fragment>
            ),
        )}
    </div>
)

/**
 * `Grid.*` — the responsive lưới khung namespace. Namespace only — no bare
 * component export (§13a).
 */
export const Grid = {
    Base: GridBase,
}
