import type { ComponentType, SVGProps } from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `KpiTile` — one account-health stat: a label + icon row, a large value, and
 * an optional footer that is either a plain note or an accent call-to-action.
 * `footer` is the one thing that changes the tile's meaning, so the story
 * renders both of its shapes plus the value formats they pair with.
 */

/** An icon component (e.g. a phosphor `*Icon`), not JSX — the atom scales it itself. */
export type KpiTileIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** How {@link KpiTileProps.value} is rendered — a raw VND amount or a plain count. */
export type KpiValueFormat = "vnd" | "count"

/**
 * The tile's footer line — a discriminated union so the DATA decides the shape:
 * a `note` never carries a press handler, and a `cta` never carries a tone.
 */
export type KpiTileFooter =
    | { kind: "note"; text: string; tone?: "positive" | "neutral" }
    | { kind: "cta"; label: string; onPress: () => void }

/** Props for {@link KpiTile}. */
export interface KpiTileProps {
    /** The stat's icon. */
    icon: KpiTileIcon
    /** The stat's label (e.g. "Monthly revenue"). */
    label: string
    /** The raw figure — VND or a count, per {@link KpiTileProps.format}. */
    value: number
    /** How {@link KpiTileProps.value} is formatted. */
    format: KpiValueFormat
    /** Optional footer line — a note or a call-to-action; see {@link KpiTileFooter}. */
    footer?: KpiTileFooter
    /**
     * `true` → the tile's own first fetch is in flight: the label, the value,
     * and the footer all shimmer in place, matching the loaded shape.
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
}

/** Money is a raw VND `Int`; the tile owns the grouping + suffix, never a formatted string in. */
const formatValue = (value: number, format: KpiValueFormat) =>
    format === "vnd" ? `${value.toLocaleString("en-US")} VND` : value.toLocaleString("en-US")

/**
 * The stat tile. See the file header for why the footer is a discriminated
 * union rather than two independent optional props.
 *
 * @param props - {@link KpiTileProps}
 */
const KpiTile = ({ icon, label, value, format, footer, isSkeleton = false }: KpiTileProps) => {
    const footerNode = isSkeleton
        ? () => <Typography size="xs" isSkeleton />
        : footer == null
            ? null
            : footer.kind === "cta"
                ? () => (
                    <Typography
                        size="xs"
                        weight="semibold"
                        color="accent"
                        isButton
                        suffixIcon={ArrowRightIcon}
                        iconSlide
                        text={footer.label}
                        onPress={footer.onPress}
                    />
                )
                : () => (
                    <Typography
                        size="xs"
                        color={footer.tone === "positive" ? "success" : "muted"}
                        text={footer.text}
                    />
                )

    return (
        <div data-tier="block" data-component="KpiTile">
            <SurfaceCard
                padding={3}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={3}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Typography size="xs" weight="bold" color="muted" isSkeleton={isSkeleton} text={label} />,
                                        () => <IconTile icon={icon} tone="accent" size="sm" isSkeleton={isSkeleton} />,
                                    ]}
                                />
                            ),
                            () => (
                                <Typography
                                    size="h2"
                                    weight="bold"
                                    tabularNums
                                    isSkeleton={isSkeleton}
                                    text={formatValue(value, format)}
                                />
                            ),
                            ...(footerNode ? [footerNode] : []),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { KpiTile }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "KpiTile" } as const
