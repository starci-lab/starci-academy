import { type SkeletonProps } from "@sb-components/frames/_slot"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { type ButtonSize, type ButtonVariant, type IconComponent } from "@sb-components/atoms/buttons/Button/button-tokens"
import { ResponsiveCluster, type ResponsiveClusterItem } from "@sb-components/frames/ResponsiveCluster/ResponsiveCluster"
import type { ResponsiveRowSwitch } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"
import type { PrincipleToken, ExplainReason } from "@sb-components/frames/_principles"
import { PRINCIPLE_STYLE } from "@sb-components/frames/_principle-style"
import type { AllowedGap, LayoutJustify } from "@sb-components/frames/_spacing"

/**
 * `ButtonGroup` — a layout cluster that arranges buttons built from `items`, with a
 * cluster-level `size`. Composes `ButtonBase`; per-button props
 * (`variant`/`prefixIcon`/`isPending`/`isDisabled`) belong to `Button`, not the cluster.
 */

/** One button in a {@link ButtonGroup} — described as data, not JSX. */
export interface ButtonGroupItem {
    /** React key + action identifier. */
    key: string
    /** Button label. Omit for an icon-only button (then `prefixIcon` + `ariaLabel` are required). */
    label?: string
    /** Icon component — leading glyph when `label` is set, sole glyph otherwise. */
    prefixIcon?: IconComponent
    /** Accessible name — required when there is no `label`. */
    ariaLabel?: string
    /** Action intent → variant. Default `primary`. */
    variant?: ButtonVariant
    onPress?: () => void
    isDisabled?: boolean
    /** `true` marks this button busy: spinner + locked press, scoped to this button only. */
    isPending?: boolean
}

/** Props for {@link ButtonGroup} — a row cluster of buttons. */
export interface ButtonGroupProps {
    /** The row's buttons, described as data. An item with `label` renders labeled; without, icon-only. */
    items: Array<ButtonGroupItem>
    /** Scale shared by the whole row (default `md`) — every button in a cluster is the same size. */
    size?: ButtonSize
    /** `true` renders a skeleton mirroring the item count (pill/square per item). */
    isSkeleton?: boolean
    /**
     * Layout seam for this control row. Default `flex-action`.
     * Use `flex-action-end` / `flex-action-start` / `flex-action-between` when the
     * main-axis distribution is part of the meaning (form closing rows).
     */
    principle?: PrincipleToken
    /**
     * Why this layer exists - one sentence, forwarded to the owning cluster beside `principle`.
     */
    explain?: ExplainReason
    /**
     * Container step this row leaves the full-width column for the packed row at.
     * Default `sm` — a button row needs far less room than a page split to pack.
     */
    at?: ResponsiveRowSwitch
}

/** Source-level tier metadata. */
export const meta = { tier: "composite", name: "ButtonGroup" } as const

/** Cluster of related buttons that wrap together at a breakpoint. */
export const ButtonGroup = ({
    items,
    size = "md",
    isSkeleton = false,
    principle = "flex-action",
    explain,
    at = "sm",
}: ButtonGroupProps) => {
    const entry = PRINCIPLE_STYLE[principle]
    const gap: AllowedGap = entry.kind === "gap" ? entry.step : 3
    const justify: LayoutJustify | undefined = entry.kind === "gap" ? entry.justify : undefined
    return (
        <ResponsiveCluster
            data-tier="composite"
            data-component="ButtonGroup"
            at={at}
            gap={gap}
            principle={principle}
            explain={explain}
            justify={justify}
            isSkeleton={isSkeleton}
            items={items.map((item): ResponsiveClusterItem => {
                const shared = {
                    variant: item.variant,
                    size,
                    onPress: item.onPress,
                    isDisabled: item.isDisabled,
                    isPending: item.isPending,
                } as const
                const { label, prefixIcon, ariaLabel } = item
                if (label != null) {
                    return {
                        key: item.key,
                        content: ({ isSkeleton: skeleton }: SkeletonProps) => (
                            <Button label={label} prefixIcon={prefixIcon} isSkeleton={skeleton} {...shared} />
                        ),
                    }
                }
                if (prefixIcon != null) {
                    return {
                        key: item.key,
                        content: ({ isSkeleton: skeleton }: SkeletonProps) => (
                            <Button
                                isIconOnly
                                prefixIcon={prefixIcon}
                                ariaLabel={ariaLabel ?? ""}
                                isSkeleton={skeleton}
                                {...shared}
                            />
                        ),
                    }
                }
                return { key: item.key, content: () => null }
            })}
        />
    )
}
