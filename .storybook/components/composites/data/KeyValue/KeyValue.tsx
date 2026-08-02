import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { SnippetIcon } from "@sb-components/atoms/display/SnippetIcon/SnippetIcon"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { GAP_CLASS, type AllowedGap } from "@sb-components/frames/_spacing"

/**
 * `KeyValue.*` — the label–value pair composite, for spec tables, order summaries,
 * and invoices where "one name, one number" repeats.
 *
 * | Member | Shape | Content channel |
 * |---|---|---|
 * | `.Row`  | ONE label–value pair | data props (`label`/`value`/`hint`) |
 * | `.List` | N pairs stacked vertically | `items` DATA — children forbidden |
 *
 * The composite carries no domain content and does NOT format money/dates/units —
 * the consumer passes an already-formatted `string` into `value` (`"1,200,000 ₫"`).
 * `label`/`value` are `string`, never `ReactNode`; the row wraps each in
 * `Typography` itself, which is what lets it shimmer either one while `isSkeleton`.
 * `emphasis` is a visual stress for a total row only — the number is still supplied
 * by the consumer (no self-computed totals). Text goes through `Typography.*`,
 * rules through `Divider`. The gap scale is enforced by type ({@link AllowedGap},
 * `1..8`).
 */


/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "KeyValue" } as const

// ─────────────────────────────────────────────────────────────────────────────
// .Row — ONE label–value pair
// ─────────────────────────────────────────────────────────────────────────────

/** Props every {@link KeyValueRow} carries regardless of loading state. */
interface KeyValueRowOwnProps {
    /**
     * Sub-line below the label (explanation/unit/condition) — muted, smaller size.
     * A plain `string`: the row wraps it in `Typography` itself (COMPOSITE-8) — a
     * built node here would already be called and unable to shimmer.
     */
    hint?: string
    /** `true` → a TOTAL row: label goes to foreground medium, value goes to base size + bold. */
    emphasis?: boolean
    /** `true` → draws a SEPARATOR line below the row (seam between this row and the next). */
    divider?: boolean
    /** Gap between the row's content and the `divider` line (§10). Default `4` (`gap-3`). */
    gap?: AllowedGap
    /**
     * `true` → renders a one-tap {@link SnippetIcon} copy affordance beside the
     * value, copying the row's `value` string to the clipboard. Additive:
     * default `false`, so an existing row with no `copyable` renders exactly as
     * before. The affordance is skipped entirely while `isSkeleton` — there is
     * nothing real yet to copy, so the row decides not to draw it rather than
     * shimmer a control with no value behind it (COMPOSITE-10).
     */
    copyable?: boolean
    /**
     * Anatomy tag for THIS composite itself — lets the PARENT badge it as ONE node (§11a.1).
     * Without this prop the composite doesn't make it into the Deps tree: using a
     * `frame`/`composite` tier node that the panel can't see counts as not using it.
     */
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for {@link KeyValueRow}. `label`/`value` are REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer row has no real pair to show yet.
 */
export type KeyValueRowProps = KeyValueRowOwnProps &
    (
        | { isSkeleton: true; label?: string; value?: string }
        | { isSkeleton?: false; label: string; value: string }
    )

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
    gap = 4,
    copyable = false,
    isSkeleton = false,
    classNames,
}: KeyValueRowProps) => {
    // COMPOSITE-10: ONE render path — same two-column `StackH`, same label+hint
    // `StackV` cluster, in both states. Every piece of text goes through
    // `Typography`'s own `isSkeleton` (§12c: the atom draws its own bar, sized to
    // its own value) — there is no second, hand-built skeleton pair to keep in
    // sync with this one.
    // Label column: label + hint form a TIGHT cluster (§10b `tight` = gap-1) — the
    // same "a label continuing into its hint" shape the registry names `title-subtitle`.
    const pairContent = (
        <>
            <StackV
                gap={2}
                classNames={["min-w-0"]}
                pattern="title-subtitle"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <span>
                            <Typography size="sm"
                                text={label}
                                color={isSkeleton ? undefined : (emphasis ? undefined : "muted")}
                                weight={isSkeleton ? undefined : (emphasis ? "medium" : undefined)}
                                isSkeleton={isSkeleton}
                                classNames={isSkeleton ? ["w-1/3"] : undefined}
                            />
                        </span>
                    ),
                    ...(hint != null ? [() => (
                        <span>
                            <Typography size="xs"
                                text={hint}
                                color={isSkeleton ? undefined : "muted"}
                                isSkeleton={isSkeleton}
                                classNames={isSkeleton ? ["w-1/4"] : undefined}
                            />
                        </span>
                    )] : []),
                ]}
            />
            <span
                className={cn("flex shrink-0 items-center", copyable && !isSkeleton && "gap-2")}
                data-principles={copyable && !isSkeleton ? "flex-action" : undefined}
            >
                <span>
                    {emphasis ? (
                        <Typography text={value} weight={isSkeleton ? undefined : "bold"} tabularNums={!isSkeleton} isSkeleton={isSkeleton} classNames={isSkeleton ? ["w-1/4"] : undefined} />
                    ) : (
                        <Typography size="sm" text={value} weight={isSkeleton ? undefined : "medium"} tabularNums={!isSkeleton} isSkeleton={isSkeleton} classNames={isSkeleton ? ["w-1/4"] : undefined} />
                    )}
                </span>
                {copyable && !isSkeleton ? (
                    <span>
                        {/* `value` is guaranteed a real string whenever `!isSkeleton` (the
                            discriminated union above) — the `?? ""` only satisfies narrowing
                            across the destructure and is never seen. */}
                        <SnippetIcon copyString={value ?? ""} />
                    </span>
                ) : null}
            </span>
        </>
    )
    const row = (
        <StackH
            align="start"
            justify="between"
            gap={3}
            classNames={classNames}
            isSkeleton={isSkeleton}
            items={[() => pairContent]}
        />
    )
    if (!divider) {
        return row
    }
    return (
        <div className={cn("flex flex-col", GAP_CLASS[gap])}>
            {row}
            <span className="block">
                <Divider variant="tertiary" />
            </span>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .List — N pairs stacked vertically (repeated list ⇒ items)
// ─────────────────────────────────────────────────────────────────────────────

/** ONE row in {@link KeyValueList} — described as DATA, not JSX. */
export interface KeyValueListItem {
    /** React key. */
    key: string
    /** Label (left side). `string` — the row wraps it in `Typography` itself. */
    label: string
    /** Value (right side) — an already-formatted `string` (COMPOSITE-8). */
    value: string
    /** Sub-line below the label. Plain `string` — see {@link KeyValueRowOwnProps.hint}. */
    hint?: string
    /** `true` → a TOTAL row (visual emphasis). */
    emphasis?: boolean
    /** `true` → this row gets the {@link KeyValueRowOwnProps.copyable} copy affordance. */
    copyable?: boolean
}

/** Props for {@link KeyValueList}. */
export interface KeyValueListProps {
    /** The rows, in reading order. REQUIRED — a repeated list = data (§13b). */
    items: ReadonlyArray<KeyValueListItem>
    /** Gap between rows, ENFORCED by the §10 scale. Default `4` (`gap-3`, vertical rows). */
    gap?: AllowedGap
    /** `true` → draws a separator line BETWEEN rows (the last row has none). */
    divider?: boolean
    /**
     * `true` → render `skeletonRows` placeholder rows instead of `items` (same
     * contract as `List.Labeled`'s own `isSkeleton`/`skeletonRows` pair).
     */
    isSkeleton?: boolean
    /** Placeholder row count while `isSkeleton`. Defaults to `3`. */
    skeletonRows?: number
    /**
     * Anatomy tag for THIS composite itself — lets the PARENT badge it as ONE node (§11a.1).
     * Without this prop the composite doesn't make it into the Deps tree: using a
     * `frame`/`composite` tier node that the panel can't see counts as not using it.
     */
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * A column of {@link KeyValueRow} rows built from `items`. The separator line (if
 * enabled) is decided by the LIST — the LAST row has none, so the seam always sits
 * BETWEEN two rows instead of leaving a stray line dangling at the bottom. The gap
 * around each row-and-line shares the list's `gap` ⇒ the rhythm above/below the line
 * is always even (§10a: one seam, one owner).
 *
 * @param props - {@link KeyValueListProps}
 */
const KeyValueList = ({
    items,
    gap = 4,
    divider = false,
    isSkeleton = false,
    skeletonRows = 3,
    classNames,
}: KeyValueListProps) => (
    <div

        className={cn("flex flex-col", GAP_CLASS[gap], classNames)}
        data-tier="composite"
        data-component="KeyValueList"
    >
        {isSkeleton
            ? Array.from({ length: skeletonRows }, (_unused, index) => (
                <KeyValueRow key={index} isSkeleton divider={divider && index < skeletonRows - 1} gap={gap} />
            ))
            : items.map(({ key, ...item }, index) => (
                <KeyValueRow
                    key={key}
                    {...item}
                    divider={divider && index < items.length - 1}
                    gap={gap}

                />
            ))}
    </div>
)

/**
 * `KeyValue.*` — the label–value pair composite (COMPOSITE tier §13). `Row` (one pair) ·
 * `List` (N pairs, `items`). Visual variants = PROP (`emphasis`/`divider`), §6b.
 */
export { KeyValueRow, KeyValueList }
