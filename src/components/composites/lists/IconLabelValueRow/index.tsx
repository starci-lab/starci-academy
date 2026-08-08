import { Typography } from "@/components/atoms/text/Typography"
import type { TypographyIcon } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

/**
 * COMPOSITE — `IconLabelValueRow`: a leading icon beside a flex-1 label with a
 * trailing value pinned to the row's end — the flat "spec line" shape.
 */

/** Props for {@link IconLabelValueRow}. */
export interface IconLabelValueRowProps {
    /**
     * Leading icon, a COMPONENT reference (a Phosphor `*Icon`, never
     * already-built JSX) — the row renders it and owns its size/colour.
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
}

/**
 * Leading icon + flex-1 label + trailing value, one `content-row` seam (12px).
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
}: IconLabelValueRowProps) => (
    <StackH
        principle="content-row"
        explain="Keeps icon, label, and trailing value on one baseline — not icon-text, because the value is a third segment, not part of the glyph pair."
        isSkeleton={isSkeleton}
        items={[
            () => (
                isSkeleton ? (
                    <span aria-hidden className="size-5 shrink-0 rounded-md bg-default" />
                ) : (
                    <span className="shrink-0 text-foreground [&_svg]:size-5">
                        <Icon aria-hidden focusable="false" />
                    </span>
                )
            ),
            () => (
                <StackH
                    principle="flex-fill-base"
                    explain="Label takes remaining row width so truncate clips before the trailing value."
                    items={[
                        () => (
                            <Typography
                                size="sm"
                                weight={isSkeleton ? undefined : "medium"}
                                color={isSkeleton ? undefined : "default"}
                                truncate={isSkeleton ? undefined : true}
                                isSkeleton={isSkeleton}
                                text={label}
                            />
                        ),
                    ]}
                />
            ),
            () => (
                <Typography
                    size="sm"
                    color={isSkeleton ? undefined : "muted"}
                    isSkeleton={isSkeleton}
                    text={value}
                />
            ),
        ]}
    />
)

export { IconLabelValueRow }
