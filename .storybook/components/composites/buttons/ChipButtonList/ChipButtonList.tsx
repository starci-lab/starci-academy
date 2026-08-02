import { cn } from "@heroui/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { IconComponent } from "@sb-components/atoms/buttons/Button/button-tokens"

/**
 * `ChipButtonList` — a shared list of chip-shaped buttons (leading bare icon +
 * label, `justify-start text-start`) used for suggestion chips, retrieval-skill
 * chips, quick-asks, and skill menus.
 *
 * Composes the base {@link Button} for every item (not HeroUI directly) —
 * press/pending/disabled live on the Button; this composite owns only LAYOUT
 * (cluster vs column) and icon size (the leading icon is forced to
 * `size-4 shrink-0 text-muted`, not routed through Button's trailing icon slot).
 *
 * `direction`:
 * - `"wrap"` — a cluster of suggestion chips: default variant `secondary`,
 *   `flex-wrap gap-2`, auto-width, label as Button's own bare children.
 * - `"column"` — a vertical skill-menu list: default variant `ghost`, full-width
 *   `px-3 py-2` rows, label through {@link Typography} (`weight="medium"`, `truncate`).
 */

/** One chip/row item. */
export interface ChipButtonItem {
    /** Stable key; falls back to array index. */
    id?: string
    /** Chip label — text the composite renders (via Typography in `column`, as bare children in `wrap`). */
    label: string
    /** Leading icon, passed as a COMPONENT reference (not built JSX) — the composite calls it itself and forces its size (§5). */
    icon?: IconComponent
    onPress?: () => void
    isDisabled?: boolean
}

export type ChipButtonListVariant = "secondary" | "ghost"
export type ChipButtonListDirection = "wrap" | "column"

/** Props for the {@link ChipButtonList} composite. */
export interface ChipButtonListProps {
    items: Array<ChipButtonItem>
    /** Button variant applied to every item. Defaults follow `direction` (wrap→secondary · column→ghost) when omitted. */
    variant?: ChipButtonListVariant
    /** `"wrap"` = a flex-wrap chip cluster · `"column"` = a full-width vertical list (menu). Defaults `"wrap"`. */
    direction?: ChipButtonListDirection
    /** `true` → render N placeholder `Button`s (`isSkeleton`) instead of `items` — same real `Button`, its own shimmer mirror. */
    isSkeleton?: boolean
    /** How many skeleton items to render when `isSkeleton` (the real `items` count isn't known yet). Defaults to 3. */
    skeletonCount?: number
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

const DEFAULT_VARIANT: Record<ChipButtonListDirection, ChipButtonListVariant> = {
    wrap: "secondary",
    column: "ghost",
}

const CONTAINER_CLS: Record<ChipButtonListDirection, string> = {
    wrap: "flex flex-wrap gap-2",
    column: "flex flex-col gap-1",
}

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ChipButtonList" } as const

/**
 * ChipButtonList — a row of secondary "suggestion" chips OR a vertical ghost "menu"
 * list, both composing the base {@link Button}. See the file header for the two
 * `direction` shapes.
 *
 * @param props - {@link ChipButtonListProps}
 */
export const ChipButtonList = ({
    items,
    variant,
    direction = "wrap",
    isSkeleton = false,
    skeletonCount = 3,
    classNames,
}: ChipButtonListProps) => {
    const resolvedVariant = variant ?? DEFAULT_VARIANT[direction]

    // ONE render path (§12c) — every item is the SAME real `Button`, whether the
    // count comes from `items` (real) or `skeletonCount` (loading, the composite's
    // own decision how many rows to guess). `Button` already owns an `isSkeleton`
    // mirror sized to its own box (pill for `wrap`, full-width row for `column`);
    // handing it the flag replaces the old hand-rolled icon+text shimmer row.
    const rendered = isSkeleton
        ? Array.from({ length: skeletonCount }, (_, index) => (
            <Button
                key={index}
                isSkeleton
                variant={resolvedVariant}
                size={direction === "wrap" ? "sm" : "md"}
            />
        ))
        : items.map((item, index) => {
            const Icon = item.icon
            return (
                <Button
                    key={item.id ?? index}
                    variant={resolvedVariant}
                    size={direction === "wrap" ? "sm" : "md"}
                    align="start"
                    onPress={item.onPress}
                    isDisabled={item.isDisabled}
                    label={
                        <>
                            {Icon ? (
                                <span aria-hidden className="[&_svg]:size-4 shrink-0 text-muted">
                                    <Icon />
                                </span>
                            ) : null}
                            {direction === "column" ? (
                                <Typography size="sm"
                                    weight="medium"
                                    truncate
                                    classNames={["min-w-0", "flex-1"]}
                                    text={item.label}
                                />
                            ) : (
                                item.label
                            )}
                        </>
                    }
                />
            )
        })

    return (
        <div
            className={cn(CONTAINER_CLS[direction], classNames)}

            data-tier="composite"
            data-component="ChipButtonList"
            data-principles={direction === "wrap" ? "flex-action" : undefined}
        >
            {rendered}
        </div>
    )
}
