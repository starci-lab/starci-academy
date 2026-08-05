import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { GAP_CLASS, JUSTIFY_CLASS, type AllowedGap, type LayoutJustify } from "@/components/frames/_spacing"
import type { ResponsiveRowSwitch } from "@/components/frames/ResponsiveRow"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { principleAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@/components/frames/_principles"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME -- `ResponsiveCluster`: a repeat-list track that is a FULL-WIDTH COLUMN
 * below a named container step and a packed ROW from it up, ONE shared gap on
 * both sides. One member, `ResponsiveCluster`.
 *
 * See the blueprint (`.storybook/components/frames/ResponsiveCluster/ResponsiveCluster.tsx`)
 * for why this exists and why it stays internal-only for now.
 *
 * FRAME API LAW ⇒ REPEATING LIST ⇒ `items` DATA, `children` FORBIDDEN, same
 * contract as `Cluster`/`Grid`: every cell is the same kind of thing.
 *
 * FULL WIDTH BELOW THE SWITCH: each item is wrapped in `w-full`, released to
 * `w-auto` at the switch step -- the wrapper carries the class, not the item's
 * own content, so a caller's `Button` never has to know which form it is in.
 *
 * CONTAINER QUERIES, NOT VIEWPORT: same reasoning as `Grid`/`ResponsiveRow` --
 * `@app-sm/md/lg/xl` answer the nearest `@container`, not the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One cell of a {@link ResponsiveCluster}. */
export interface ResponsiveClusterItem {
    /** Stable React key. */
    key: string
    /**
     * The cell's content, fully built by the caller (the frame places, never styles).
     * Received UNCALLED (a component reference, never a built element) so the frame
     * can render it with `isSkeleton`.
     */
    content: ComponentTypeWithSkeleton
}

/** Props for {@link ResponsiveCluster}. */
export interface ResponsiveClusterProps {
    /** The cells, in reading order. REQUIRED -- repeat list = DATA, never children. */
    items: ReadonlyArray<ResponsiveClusterItem>
    /** Seam between cells on the house scale -- REQUIRED, ONE value, both forms. */
    gap: AllowedGap
    /** Container step the track leaves the full-width column for the packed row at. */
    at: ResponsiveRowSwitch
    /** Main-axis distribution once packed into a row. Left out means the browser default. */
    justify?: LayoutJustify
    /** Where this sits inside its parent. Appearance is not passable -- it is already a prop. */
    classNames?: Array<AllowedClassName>
    /**
     * Permanent contract marker (not anatomy tooling) -- hard-coded by whoever calls this
     * frame, because the frame has no public identity of its own yet. See the blueprint.
     */
    "data-tier"?: string
    /** Paired with `data-tier` -- the public name of the caller badging this root. */
    "data-component"?: string
    /**
     * The layout pattern this track's seam realises - one token from `test-runner/patterns.mjs`.
     * Emitted as `data-principle` on this same root, beside `data-tier`/`data-component`, so the
     * rendered-tree test can assert the seam is the step the pattern names. Query as
     * `[data-principle="token"]`. See `Flex`'s own `pattern` doc for the full contract.
     */
    principle?: PrincipleToken
    /**
     * Why this layer exists - one sentence, emitted as `data-explain` beside the token.
     * A reason, never a restatement of `principle`.
     */
    explain?: ExplainReason
    /** Renders every cell's skeleton form instead of its content form. */
    isSkeleton?: boolean
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
 * The full-width-column/packed-row track. See the blueprint file header for why it
 * exists and what it deliberately does not cover.
 *
 * @param props - {@link ResponsiveClusterProps}
 */
const ResponsiveClusterBase = ({
    items,
    gap,
    at,
    justify,
    classNames,
    "data-tier": dataTier,
    "data-component": dataComponent,
    principle,
    explain,
    isSkeleton,
}: ResponsiveClusterProps) => (
    <div
        data-tier={dataTier}
        data-component={dataComponent}
        data-principle={principleAttr(principle)}
        data-explain={explainAttr(explain)}
        className={cn(
            "flex w-full flex-col items-center",
            GAP_CLASS[gap],
            DIRECTION_SWITCH_CLASS[at],
            justify != null && JUSTIFY_CLASS[justify],
            classNames,
        )}
    >
        {items.map((item) => {
            const Content = item.content
            return (
                <div key={item.key} className={cn("w-full", ITEM_WIDTH_SWITCH_CLASS[at])}>
                    <Content isSkeleton={isSkeleton} />
                </div>
            )
        })}
    </div>
)

/**
 * `ResponsiveCluster.*` -- namespace only, no bare component export (house convention
 * for every frame in this folder).
 */
export { ResponsiveClusterBase as ResponsiveCluster }
