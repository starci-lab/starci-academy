import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import type { TypographyIcon } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE — `IconLabelValueRow`: a leading icon beside a flex-1 label with a
 * trailing value pinned to the row's end — the flat "spec line" shape (a
 * permission row, a plan-limit line, a settings line reporting its current
 * value) that `content-row`'s own definition names directly: "a list row's
 * segments — a leading icon, a title/meta block, a trailing action"
 * (`patterns.mjs`). ONE seam, not two: icon<->label and label<->value both ride the
 * SAME `content-row` gap (step 4, 12px) — there is no sub-grouping inside the
 * row (unlike `ListRow`, which also carries a title<->subtitle seam inside its
 * text column), so a single gap value between all three segments is the honest
 * read here.
 *
 * `label`/`value` are `string` (composite.md law 1): the row wraps each in its
 * own `Typography` and OWNS the tone — `label` reads as the row's own text
 * (`default`, medium weight), `value` reads as the fact it reports (`muted`),
 * the same foreground/muted split `ListRow`'s title/subtitle pairing and
 * `SurfaceCard`'s `metaText` already use for "the row's own line" vs. "what the
 * row is telling you".
 *
 * `icon` is a bare `ComponentType` (a Phosphor `*Icon` reference), not a
 * `ComponentTypeWithSkeleton` — it is one glyph, not "a whole region" (law 1's
 * distinction), so it carries no `isSkeleton` contract of its own; this row
 * decides its size/colour and its skeleton stand-in for it. Sized `size-5` and
 * coloured to follow the label (`text-foreground`, not muted) — the same call
 * `SurfaceCard`'s own `leadingIcon` data-path already makes: "an icon paired
 * with a label follows the label's colour, it doesn't drop to muted on its
 * own".
 *
 * ATOM GAP: no bare icon-shaped skeleton atom exists yet — the same gap
 * `Legend`'s swatch and `InlineIconLabel`'s glyph both already document. While
 * `isSkeleton`, the icon slot shimmers as a flat `bg-default` placeholder span
 * (a neutral fill, not a hand-drawn `animate-pulse`, and not a vendor
 * `Skeleton` import — COMPOSITE-10), while `label`/`value` shimmer through
 * `Typography`'s own `isSkeleton` bar (COMPOSITE-10: the atom draws its own
 * shape, this row only forwards the flag and picks each bar's width).
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** `true` -> render the skeleton mirror (icon placeholder + two bars) instead of the live row. */
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
        data-principle="content-row"
    >
        {isSkeleton ? (
            <span aria-hidden className="size-5 shrink-0 rounded-md bg-default" />
        ) : (
            <span className="shrink-0 text-foreground [&_svg]:size-5">
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
