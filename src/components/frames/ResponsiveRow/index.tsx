import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { gapClassNames, type AllowedGap, type Responsive } from "@/components/frames/_spacing"
import { principlesAttr, type PrincipleToken } from "@/components/frames/_principles"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (frame) — `ResponsiveRow.*`: a repeat-list row that is a FIXED grid below
 * a container step and an EQUAL-SHARE flex row from it up. One member, `ResponsiveRow`.
 *
 * WHY THIS EXISTS (§13z, 2026-07-29). `StatRibbon` needs BOTH shapes on the same row: a
 * padded 2-column grid on a narrow shell, and — from `@app-sm` — one un-padded row where
 * N cells share the width evenly and a `border-l` marks the seam between them instead of a
 * gap. Neither existing frame covers this: `Grid` is always `display:grid` with a FIXED
 * column count, so 2 items in a 4-column grid leave two tracks empty instead of sharing the
 * row; `Flex`/`Stack` is always one display type, with no per-step switch at all. Measured
 * that day: exactly one call-site needed this (`StatRibbon`), so the frame stays narrow —
 * one switch step, one gap, columns capped at what a narrow shell can actually hold.
 *
 * FRAME API LAW (§13b) — REPEATING LIST ⇒ `items` DATA, `children` FORBIDDEN, same
 * contract as `Grid`/`Cluster`: every cell is the same kind of thing.
 *
 * WHY NO GAP ABOVE THE SWITCH STEP: a divided row (`border-l` between cells) has ONE seam
 * mechanism, not two — a `gap` AND a border would double the visible space on every cell
 * boundary. The row goes flush (`gap-0`) once flex takes over; the caller marks the seam
 * with a border on its own cell content instead (§10a: a divided row owns its rhythm with
 * a border, not a gap it would then have to strip off the first/last cell by hand).
 *
 * CONTAINER QUERIES, NOT VIEWPORT: same reasoning as `Grid` (see that file's header) —
 * `@app-sm/md/lg` answer the nearest `@container`, not the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Container step the row leaves the grid for the flex row at.
 *
 * The shared width-switch scale for the frame tier — any frame naming the container step it
 * changes shape at (FRAME-10) reuses this union rather than minting its own. `xl` exists for
 * `SplitWorkspace`, whose real `src` sources both switch at `@app-xl`.
 */
export type ResponsiveRowSwitch = "sm" | "md" | "lg" | "xl"

/** Props for {@link ResponsiveRow}. */
export interface ResponsiveRowProps {
    /**
     * The cells, in reading order — each an uncalled `ComponentType<{isSkeleton?}>` the row
     * renders itself (`<Item isSkeleton={isSkeleton} />`), so it can build both the real and
     * shimmer state from one source. REQUIRED — repeat list = DATA, never children (§13b).
     */
    items: ReadonlyArray<ComponentTypeWithSkeleton>
    /** `true` → passes `isSkeleton` down to every `items` component so the whole row shimmers. */
    isSkeleton?: boolean
    /**
     * Grid column count BELOW `at`. Capped at `1 | 2` — a narrow shell wide enough for a
     * 3+ column grid is wide enough for the flex row instead, so a caller needing more
     * belongs on `Grid`, not here.
     */
    columns: 1 | 2
    /** Container step the row switches from the fixed grid to the equal-share flex row at. */
    at: ResponsiveRowSwitch
    /** Seam BELOW `at` (the grid gap), on the house gap scale. At/above `at` the row goes flush — see the file header. */
    gap: Responsive<AllowedGap>
    /**
     * Anatomy tag for THIS frame itself — so the PARENT can badge it as ONE node (§11a.1).
     * Missing this prop means the frame is used but the panel cannot see it.
     */
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * The layout pattern this row's seam realises — a token from `test-runner/patterns.mjs`.
     * Emitted as `data-principles` on this same root, beside `data-tier`/`data-component`, so the
     * rendered-tree test can assert the seam is the step the pattern names. See `Flex`'s own
     * `pattern` doc for the full contract.
     */
    principles?: Array<PrincipleToken>
}

/** Grid column count → literal class. Tailwind never emits an interpolated `grid-cols-${n}`. */
const COLUMNS_CLASS: Record<1 | 2, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2"}

/**
 * Switch step → the literal classes that flip the row from grid to flex from that step up.
 * Written out per step for the same reason `Grid`'s own tables are: Tailwind never emits an
 * interpolated `@app-${step}:flex`.
 */
const SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:flex @app-sm:items-stretch @app-sm:gap-0",
    md: "@app-md:flex @app-md:items-stretch @app-md:gap-0",
    lg: "@app-lg:flex @app-lg:items-stretch @app-lg:gap-0",
    xl: "@app-xl:flex @app-xl:items-stretch @app-xl:gap-0"}

/**
 * The grid-below/flex-above row. See the file header for why it exists and what it
 * deliberately does not cover.
 *
 * @param props - {@link ResponsiveRowProps}
 */
const ResponsiveRowBase = ({
    items,
    columns,
    at,
    gap,
    isSkeleton,
    classNames,
    principles}: ResponsiveRowProps) => (
    <div
        data-tier="frame"
        data-component="ResponsiveRow"
        data-principles={principlesAttr(principles)}
        className={cn(
            "grid",
            COLUMNS_CLASS[columns],
            ...gapClassNames(gap),
            SWITCH_CLASS[at],
            classNames)}
    >
        {items.map((Item, index) => (
            <Item key={index} isSkeleton={isSkeleton} />
        ))}
    </div>
)

/**
 * `ResponsiveRow.*` — the grid-below/flex-above frame namespace. Namespace only — no bare
 * component export (§13a).
 */
export { ResponsiveRowBase as ResponsiveRow }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "frame", name: "ResponsiveRow" } as const
