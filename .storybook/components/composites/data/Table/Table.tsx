import type { ReactNode } from "react"
import { Table as HeroTable, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
import { Box } from "@sb-components/frames/Box/Box"

/**
 * `Table` — a table frame. Owns the column configuration (`columns`: alignment + width),
 * building rows from `items`, and the three frame states of a list: empty (`emptyContent`),
 * loading (`isSkeleton`), and pressable rows (`onRowPress`). Does not format content — every
 * cell is a `ReactNode` the consumer passes in.
 */

/** Which edge a column's content aligns to (reading start, or the right edge for numbers/actions). */
export type TableAlign = "start" | "end"

/** Declares ONE column — data configuration, not a JSX child. */
export interface TableColumnSpec {
    /** Column key: both the React key and the key used to read the cell in each `item`. */
    key: string
    /**
     * Column header text. `string`, not `ReactNode` (COMPOSITE-8): the frame renders it through
     * the `Typography` atom itself rather than accepting an already-built node it cannot reopen.
     */
    header: string
    /** Content alignment for the column (applies to BOTH the header and every cell). Default `start`. */
    align?: TableAlign
    /** Fixed CSS width for the column (`"96px"`, `"20%"`). Omit to size to content. */
    width?: string
}

/**
 * ONE row: `key` (React key + row id) plus one node for EVERY `column.key`.
 * Already-formatted nodes — the frame knows nothing about the domain.
 */
export type TableRowItem = Record<string, ReactNode> & { key: string }

/** Props for {@link Table}. */
export interface TableBaseProps {
    /** Column configuration, in reading order. The first column is the row-header (a11y). */
    columns: ReadonlyArray<TableColumnSpec>
    /** The rows. REQUIRED — a repeated list is data, never children (§13b). */
    items: ReadonlyArray<TableRowItem>
    /**
     * The table's name for screen readers. REQUIRED: react-aria's `Table` has no
     * implicit label — omitting it reads the whole table as nameless (tsc/eslint do NOT catch this).
     */
    ariaLabel: string
    /**
     * Rendered INSIDE the table body when `items` is empty — so "empty" reads as
     * intentional. Takes a COMPONENT reference (COMPOSITE-8): the frame calls it,
     * forwarding `isSkeleton`, rather than receiving an already-built node it cannot shimmer.
     */
    emptyContent?: ComponentTypeWithSkeleton
    /**
     * `true` → keeps the REAL frame + header, replaces every cell with a skeleton
     * bar instead (§8 keeps the container real). Mirror row count = `items.length`,
     * or `3` when empty.
     */
    isSkeleton?: boolean
    /** A handler set → every row becomes a press target (react-aria row action), receiving `item.key`. */
    onRowPress?: (key: string) => void
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Table" } as const

/** Default mirror row count when there is no data yet to count. */
const SKELETON_ROWS_FALLBACK = 3

/** Content alignment — set on the CHILD span (wins over inheritance), see the file header note. */
const ALIGN_CLS: Record<TableAlign, string> = {
    start: "text-start",
    end: "text-end",
}

/** Wraps one cell/header's content so the FRAME owns alignment (§4), instead of it leaking to the call site. */
/** Params for the local {@link CellBox} — one table cell's alignment wrapper (internal, not a public slot). */
interface CellBoxArgs {
    /** Horizontal alignment of the cell content. */
    align?: TableAlign
    /** Cell content. */
    children: ReactNode
}

const CellBox = ({ align, children }: CellBoxArgs) => (
    <span className={cn("block", ALIGN_CLS[align ?? "start"])}>{children}</span>
)

/**
 * Table frame: a `columns` configuration + an `items` array, the frame builds its
 * own header/rows/cells. Empty → `emptyContent`; loading → mirrors the skeleton
 * within the same frame; `onRowPress` set → rows become press targets (a11y handled by react-aria).
 *
 * @param props - {@link TableBaseProps}
 */
const TableBase = ({
    columns,
    items,
    ariaLabel,
    emptyContent: EmptyContent,
    isSkeleton = false,
    onRowPress,
    classNames,
}: TableBaseProps) => {
    // The header is CONFIGURATION (known before any data arrives) → the skeleton keeps
    // the REAL header, only cells become bars; the frame/column widths never jump once data lands (§8).
    const header = (
        <HeroTable.Header>
            {columns.map((column, index) => (
                <HeroTable.Column
                    key={column.key}
                    id={column.key}
                    isRowHeader={index === 0}
                    style={column.width != null ? { width: column.width } : undefined}

                >
                    <CellBox align={column.align}>
                        <Typography size="sm" text={column.header} />
                    </CellBox>
                </HeroTable.Column>
            ))}
        </HeroTable.Header>
    )

    const body = isSkeleton ? (
        <HeroTable.Body>
            {Array.from({ length: items.length || SKELETON_ROWS_FALLBACK }).map((_, rowIndex) => (
                <HeroTable.Row key={rowIndex} id={`skeleton-${rowIndex}`}>
                    {columns.map((column) => (
                        <HeroTable.Cell key={column.key}>
                            {/* The bar is 14px tall < the real cell's 20px line-height → wrap it in an
                                `h-5` box so the mirror row is the EXACT height of a real row (§8, no
                                layout jump). Balance the height with `items-center`, NOT with margin
                                (§10a). The tag sits OUTSIDE the atom (the atom takes no rest props) —
                                same reason as `CellBox`. */}
                            <span className="flex h-5 items-center">
                                <Typography size="sm" isSkeleton classNames={["w-2/3"]} />
                            </span>
                        </HeroTable.Cell>
                    ))}
                </HeroTable.Row>
            ))}
        </HeroTable.Body>
    ) : (
        <HeroTable.Body

            renderEmptyState={
                EmptyContent != null
                    ? () => (
                        <Box principles={["page-pad"]} className="text-center">
                            <EmptyContent isSkeleton={isSkeleton} />
                        </Box>
                    )
                    : undefined
            }
        >
            {items.map((item) => (
                <HeroTable.Row
                    key={item.key}
                    id={item.key}
                    onAction={onRowPress != null ? () => onRowPress(item.key) : undefined}

                >
                    {columns.map((column) => (
                        <HeroTable.Cell key={column.key}>
                            <CellBox align={column.align}>{item[column.key]}</CellBox>
                        </HeroTable.Cell>
                    ))}
                </HeroTable.Row>
            ))}
        </HeroTable.Body>
    )

    return (
        <HeroTable
            variant="primary"
            className={cn(classNames)}

            data-tier="composite"
            data-component="Table"
        >
            <HeroTable.ScrollContainer>
                <HeroTable.Content aria-label={ariaLabel}>
                    {header}
                    {body}
                </HeroTable.Content>
            </HeroTable.ScrollContainer>
        </HeroTable>
    )
}

/**
 * `Table.*` — data-table frame (COMPOSITE tier §13). `Base` is the only shape;
 * variants (alignment, width, empty, loading, pressable rows) are PROPS on it (§6b).
 */
export { TableBase as Table }
