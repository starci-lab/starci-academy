import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { type SkeletonProps } from "@/components/frames/_slot"
import { Button } from "@/components/atoms/buttons/Button"
import { type ButtonSize, type ButtonVariant, type IconComponent } from "@/components/atoms/buttons/Button/button-tokens"
import { ResponsiveCluster, type ResponsiveClusterItem } from "@/components/frames/ResponsiveCluster"
import type { ResponsiveRowSwitch } from "@/components/frames/ResponsiveRow"
import type { PrincipleToken } from "@/components/frames/_principles"
import { PRINCIPLE_STYLE } from "@/components/frames/_principle-style"
import type { AllowedGap, LayoutJustify } from "@/components/frames/_spacing"

/**
 * `ButtonGroup` — a row of buttons described by `items` data: the HOMOGENEOUS case
 * (a filter row, a toolbar of icon buttons, N elements of the same kind). The
 * heterogeneous case (Submit / Save draft / Cancel, three different ROLES) is
 * `ActionBar`, a separate composite.
 *
 * Rebuilt on `ResponsiveCluster`: imports `Button`, renders one per item, and hands
 * the row itself to the frame below — this composite adds no arrangement of its own.
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
     * Container step this row leaves the full-width column for the packed row at.
     * Default `sm` — a button row needs far less room than a page split to pack.
     */
    at?: ResponsiveRowSwitch
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** Component-tier metadata for `ButtonGroup` — registers it as a composite named `ButtonGroup`. */
export const meta = { tier: "composite", name: "ButtonGroup" } as const

/** A responsive row of same-size buttons that packs into a cluster below the given breakpoint. */
export const ButtonGroup = ({
    items,
    size = "md",
    isSkeleton = false,
    principle = "flex-action",
    at = "sm",
    classNames,
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
            justify={justify}
            classNames={classNames}
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
