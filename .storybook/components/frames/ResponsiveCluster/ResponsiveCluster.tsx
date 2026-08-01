import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { GAP_CLASS, JUSTIFY_CLASS, type AllowedGap, type LayoutJustify } from "@sb-components/frames/_spacing"
import type { ResponsiveRowSwitch } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME — `ResponsiveCluster`: a repeat-list track that is a FULL-WIDTH COLUMN
 * below a named container step and a packed ROW from it up, ONE shared gap on
 * both sides. One member, `ResponsiveCluster`.
 *
 * WHY THIS EXISTS (Wave 3, 2026-08-01, `ButtonGroup` rebuild). `ButtonGroup`
 * needs a homogeneous row (a filter bar, a toolbar of icon buttons) that packs
 * into a row once there is room and stacks full width in a narrow container —
 * with ONE real gap in both forms. Neither existing frame covers this:
 * `Cluster` wraps onto a new line but never commits to a full column and never
 * stops being a row; `ResponsiveRow` switches shape at a named step but goes
 * FLUSH (`gap-0`) once it turns into a row — correct for its own caller
 * (`StatRibbon`, whose row marks its seam with a border instead of a gap) and
 * wrong here, where nothing else marks the seam between two buttons. Widening
 * either would fix one caller by breaking the one it already serves, which is
 * the thing this migration's own rule forbids — so this is a new, narrow
 * frame, not a change to either. `examples/composite.md`'s own text ("both
 * switch from a row to a full-width column at a named container width … the
 * frame under them owns the seam") describes exactly this shape for BOTH
 * `ButtonGroup` and `ActionBar` — this frame is offered as that shared frame,
 * not yet promoted to its own Storybook story (see the INTERNAL note below).
 *
 * ⚠️ INTERNAL-only for now, same posture as `Flex` (2026-07-27): no story here,
 * built to satisfy one call site (`ButtonGroup`) inside this same change. It
 * takes `data-tier`/`data-component` as literal pass-through attributes rather
 * than asserting its own — it has no public identity of its own yet, so the
 * composite calling it supplies one, exactly the way `Flex` takes `anatPart`
 * from `Stack` instead of badging itself. Promote it (a name, a story, its own
 * `data-tier="frame"`) the day a second caller needs it verified independently.
 *
 * FRAME API LAW ⇒ REPEATING LIST ⇒ `items` DATA, `children` FORBIDDEN, same
 * contract as `Cluster`/`Grid`: every cell is the same kind of thing.
 *
 * FULL WIDTH BELOW THE SWITCH: each item is wrapped in `w-full`, released to
 * `w-auto` at the switch step — the wrapper carries the class, not the item's
 * own content, so a caller's `Button` never has to know which form it is in.
 *
 * CONTAINER QUERIES, NOT VIEWPORT: same reasoning as `Grid`/`ResponsiveRow` —
 * `@app-sm/md/lg/xl` answer the nearest `@container`, not the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One cell of a {@link ResponsiveCluster}. */
export interface ResponsiveClusterItem {
    /** Stable React key. */
    key: string
    /** The cell's content, fully built by the caller (the frame places, never styles). */
    content: ReactNode
}

/** Props for {@link ResponsiveCluster}. */
export interface ResponsiveClusterProps {
    /** The cells, in reading order. REQUIRED — repeat list = DATA, never children. */
    items: ReadonlyArray<ResponsiveClusterItem>
    /** Seam between cells on the house scale — REQUIRED, ONE value, both forms. */
    gap: AllowedGap
    /** Container step the track leaves the full-width column for the packed row at. */
    at: ResponsiveRowSwitch
    /** Main-axis distribution once packed into a row. Left out means the browser default. */
    justify?: LayoutJustify
    /**
     * Anatomy tag for THIS frame itself — so the PARENT can badge it as ONE node.
     * Missing this prop means the frame is used but the panel cannot see it.
     */
    anatPart?: string
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * Permanent contract marker (not anatomy tooling) — hard-coded by whoever calls this
     * frame, because the frame has no public identity of its own yet. See the file header.
     */
    "data-tier"?: string
    /** Paired with `data-tier` — the public name of the caller badging this root. */
    "data-component"?: string
    /**
     * The layout pattern this track's seam realises — a token from `test-runner/patterns.mjs`.
     * Emitted as `data-principles` on this same root, beside `data-tier`/`data-component`, so the
     * rendered-tree test can assert the seam is the step the pattern names. See `Flex`'s own
     * `pattern` doc for the full contract.
     */
    pattern?: string
}

/** Switch step → the class that flips the track from a column to a row from that step up. */
const DIRECTION_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:flex-row",
    md: "@app-md:flex-row",
    lg: "@app-lg:flex-row",
    xl: "@app-xl:flex-row",
}

/** Switch step → the class releasing an item from full width back to its own width. */
const ITEM_WIDTH_SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:w-auto",
    md: "@app-md:w-auto",
    lg: "@app-lg:w-auto",
    xl: "@app-xl:w-auto",
}

/**
 * The full-width-column/packed-row track. See the file header for why it exists and
 * what it deliberately does not cover.
 *
 * @param props - {@link ResponsiveClusterProps}
 */
const ResponsiveClusterBase = ({
    items,
    gap,
    at,
    justify,
    anatPart,
    classNames,
    "data-tier": dataTier,
    "data-component": dataComponent,
    pattern,
}: ResponsiveClusterProps) => (
    <div
        data-tier={dataTier}
        data-component={dataComponent}
        data-anat-part={anatPart}
        data-principles={pattern}
        className={cn(
            "flex w-full flex-col items-center",
            GAP_CLASS[gap],
            DIRECTION_SWITCH_CLASS[at],
            justify != null && JUSTIFY_CLASS[justify],
            classNames,
        )}
    >
        {items.map((item) => (
            <div key={item.key} className={cn("w-full", ITEM_WIDTH_SWITCH_CLASS[at])}>
                {item.content}
            </div>
        ))}
    </div>
)

/**
 * `ResponsiveCluster.*` — namespace only, no bare component export (house convention
 * for every frame in this folder).
 */
export { ResponsiveClusterBase as ResponsiveCluster }
