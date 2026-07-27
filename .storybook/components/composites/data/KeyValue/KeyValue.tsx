import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { GAP_CLASS, type SeamScale } from "@sb-components/frames/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE TIER (§13) — `KeyValue.*`: the LABEL–VALUE pair COMPOSITE.
 *
 * | Member | Shape | Content channel |
 * |---|---|---|
 * | `.Row`  | ONE label–value pair | data props (`label`/`value`/`hint`) |
 * | `.List` | N pairs stacked vertically | **`items` DATA — children FORBIDDEN** (§13b) |
 *
 * Use for spec tables, order summaries, invoices — anywhere "one name, one number"
 * repeats into a block.
 *
 * COMPOSITE API LAW:
 *   • The composite carries NO domain content and **does NOT format** money/dates/units —
 *     the consumer passes an ALREADY-formatted node into `value` (`"1,200,000 ₫"`,
 *     `<Chip.Base/>`…).
 *   • The composite does NOT grow functionality (no self-computed totals): `emphasis` is
 *     only a visual STRESS for a total row, the number is still supplied by the consumer.
 *   • `.List` is a repeated list ⇒ `items` is REQUIRED, children are forbidden.
 *
 * COMPOSE (§13c): text goes ENTIRELY through the `Typography.*` atom (§9 — no scattered
 * `text-*`/`font-*`), rules go through the `Divider.Base` atom. The composite only handles
 * LAYOUT + the spacing scale.
 *
 * §10 — the gap scale is ENFORCED BY TYPE ({@link SeamScale}): only `0·1·2·3·6·8`, the
 * composite doesn't accept arbitrary numbers so it can't drift off the scale.
 * ─────────────────────────────────────────────────────────────────────────────
 */


// ─────────────────────────────────────────────────────────────────────────────
// .Row — ONE label–value pair
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link KeyValue.Row}. */
export interface KeyValueRowProps {
    /** Label (left side) — §9a SECONDARY text ⇒ muted; `emphasis` pulls it up to foreground medium. */
    label: ReactNode
    /** Value (right side) — an ALREADY-formatted node; the composite does not format it. */
    value: ReactNode
    /** Sub-line below the label (explanation/unit/condition) — muted, smaller size. */
    hint?: ReactNode
    /** `true` → a TOTAL row: label goes to foreground medium, value goes to base size + bold. */
    emphasis?: boolean
    /** `true` → draws a SEPARATOR line below the row (seam between this row and the next). */
    divider?: boolean
    /** Gap between the row's content and the `divider` line (§10). Default `3`. */
    gap?: SeamScale
    /**
     * Anatomy tag for THIS composite itself — lets the PARENT badge it as ONE node (§11a.1).
     * Without this prop the composite doesn't make it into the Deps tree: using a
     * `frame`/`composite` tier node that the panel can't see counts as not using it.
     */
    anatPart?: string
    /** Extra classes on the row. */
    className?: string
    /** `true` → attach `data-anat-part` to each part for the BlockAnatomy badge. */
    showAnatomy?: boolean
}

/**
 * One label–value row: label (+`hint`) sits left, value sits right, `tabular-nums`
 * keeps the digits aligned in a column when rows stack (§3). `emphasis` is the
 * STRESS level for a total row.
 *
 * @param props - {@link KeyValueRowProps}
 */
const KeyValueRow = ({
    label,
    value,
    hint,
    emphasis = false,
    divider = false,
    gap = "grouped",    className,
    showAnatomy = false,
    anatPart,
}: KeyValueRowProps) => {
    const row = (
        <div
            className={cn("flex items-start justify-between gap-2", className)}
            data-anat-part={anatPart ?? (showAnatomy ? "Row" : undefined)}
        >
            {/* Label column: label + hint form a TIGHT cluster (§10b `tight` = gap-1). */}
            <div className="flex min-w-0 flex-col gap-1">
                <span data-anat-part={showAnatomy ? "Label" : undefined}>
                    <Typography.Base size="sm"
                        text={label}
                        color={emphasis ? undefined : "muted"}
                        weight={emphasis ? "medium" : undefined}
                    />
                </span>
                {hint != null ? (
                    <span data-anat-part={showAnatomy ? "Hint" : undefined}>
                        <Typography.Base size="xs" text={hint} color="muted" />
                    </span>
                ) : null}
            </div>
            <span className="shrink-0" data-anat-part={showAnatomy ? "Value" : undefined}>
                {emphasis ? (
                    <Typography.Base text={value} weight="bold" tabularNums />
                ) : (
                    <Typography.Base size="sm" text={value} weight="medium" tabularNums />
                )}
            </span>
        </div>
    )
    if (!divider) {
        return row
    }
    return (
        <div className={cn("flex flex-col", GAP_CLASS[gap])}>
            {row}
            <span className="block" data-anat-part={showAnatomy ? "Divider" : undefined}>
                <Divider.Base variant="tertiary" />
            </span>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .List — N pairs stacked vertically (repeated list ⇒ items)
// ─────────────────────────────────────────────────────────────────────────────

/** ONE row in {@link KeyValue.List} — described as DATA, not JSX. */
export interface KeyValueListItem {
    /** React key. */
    key: string
    /** Label (left side). */
    label: ReactNode
    /** Value (right side) — an already-formatted node. */
    value: ReactNode
    /** Sub-line below the label. */
    hint?: ReactNode
    /** `true` → a TOTAL row (visual emphasis). */
    emphasis?: boolean
}

/** Props for {@link KeyValue.List}. */
export interface KeyValueListProps {
    /** The rows, in reading order. REQUIRED — a repeated list = data (§13b). */
    items: ReadonlyArray<KeyValueListItem>
    /** Gap between rows, ENFORCED by the §10 scale. Default `3` (vertical rows = `grouped`). */
    gap?: SeamScale
    /** `true` → draws a separator line BETWEEN rows (the last row has none). */
    divider?: boolean
    /**
     * Anatomy tag for THIS composite itself — lets the PARENT badge it as ONE node (§11a.1).
     * Without this prop the composite doesn't make it into the Deps tree: using a
     * `frame`/`composite` tier node that the panel can't see counts as not using it.
     */
    anatPart?: string
    /** Extra classes on the column. */
    className?: string
    /** `true` → attach `data-anat-part` to each part for the BlockAnatomy badge. */
    showAnatomy?: boolean
}

/**
 * A column of {@link KeyValue.Row} rows built from `items`. The separator line (if
 * enabled) is decided by the LIST — the LAST row has none, so the seam always sits
 * BETWEEN two rows instead of leaving a stray line dangling at the bottom. The gap
 * around each row-and-line shares the list's `gap` ⇒ the rhythm above/below the line
 * is always even (§10a: one seam, one owner).
 *
 * @param props - {@link KeyValueListProps}
 */
const KeyValueList = ({ items, gap = "grouped", divider = false, className, showAnatomy = false, anatPart }: KeyValueListProps) => (
    <div data-anat-part={anatPart} className={cn("flex flex-col", GAP_CLASS[gap], className)}>
        {items.map(({ key, ...item }, index) => (
            <KeyValueRow
                key={key}
                {...item}
                divider={divider && index < items.length - 1}
                gap={gap}
                showAnatomy={showAnatomy}
            />
        ))}
    </div>
)

/**
 * `KeyValue.*` — the label–value pair composite (COMPOSITE tier §13). `Row` (one pair) ·
 * `List` (N pairs, `items`). Visual variants = PROP (`emphasis`/`divider`), §6b.
 */
export const KeyValue = {
    Row: KeyValueRow,
    List: KeyValueList,
}
