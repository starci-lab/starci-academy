import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { TypographyIcon } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `IconLabelValueRow` — a leading icon beside a flex-1 label with a trailing value
 * pinned to the row's end: the flat "spec line" shape (a permission row, a
 * plan-limit line, a settings line reporting its value). One seam, not two —
 * icon↔label and label↔value both ride the same `content-row` gap (step 4, 12px),
 * with no sub-grouping inside the row.
 *
 * `label`/`value` are `string`: the row wraps each in its own `Typography` and owns
 * the tone — `label` is the row's own text (`default`, medium weight), `value` is
 * the fact it reports (`muted`). `icon` is a bare `ComponentType` (a Phosphor
 * `*Icon`), sized `size-5` and coloured to follow the label (`text-foreground`).
 *
 * No bare icon-shaped skeleton atom exists yet, so while `isSkeleton` the icon slot
 * shimmers as a flat `bg-default` placeholder span, and `label`/`value` shimmer
 * through `Typography`'s own `isSkeleton` bar.
 */

/** Props for {@link IconLabelValueRow}. */
export interface IconLabelValueRowProps {
    /**
     * Leading icon, a COMPONENT reference (a Phosphor `*Icon`, never
     * already-built JSX) — the row renders it and owns its size/colour, not a
     * prop threaded into the icon itself.
     */
    icon: TypographyIcon
    /**
     * The row's own text — e.g. a permission name, a setting's label. Wrapped
     * in `Typography` (`default`, medium weight), truncated to one line.
     */
    label: string
    /**
     * The fact the row reports — e.g. "Enabled", "12 / 20", a plan limit.
     * Wrapped in `Typography` (`muted`), pinned to the row's trailing end.
     */
    value: string
    /** `true` → render the skeleton mirror (icon placeholder + two bars) instead of the live row. */
    isSkeleton?: boolean
    /** Layout utilities on the root, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
}

/**
 * Leading icon + flex-1 label + trailing value, one `content-row` seam (12px).
 * See the file header for the full contract.
 *
 * @param props - {@link IconLabelValueRowProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "IconLabelValueRow" } as const

const IconLabelValueRow = ({
    icon: Icon,
    label,
    value,
    isSkeleton = false,
    classNames,
}: IconLabelValueRowProps) => (
    <div
        className={cn("flex min-w-0 items-center gap-3", classNames)}
        data-tier="composite"
        data-component="IconLabelValueRow"
        data-principles="content-row"

    >
        {isSkeleton ? (
            <span
                aria-hidden
                className="size-5 shrink-0 rounded-md bg-default"

            />
        ) : (
            <span
                className="shrink-0 text-foreground [&_svg]:size-5"

            >
                <Icon aria-hidden focusable="false" />
            </span>
        )}
        <Typography
            size="sm"
            weight={isSkeleton ? undefined : "medium"}
            color={isSkeleton ? undefined : "default"}
            truncate={isSkeleton ? undefined : true}
            isSkeleton={isSkeleton}
            classNames={isSkeleton ? ["w-1/3"] : ["flex-1", "min-w-0"]}
            text={label}
        />
        <Typography
            size="sm"
            color={isSkeleton ? undefined : "muted"}
            isSkeleton={isSkeleton}
            classNames={isSkeleton ? ["w-1/4"] : ["shrink-0"]}
            text={value}
        />
    </div>
)

export { IconLabelValueRow }
