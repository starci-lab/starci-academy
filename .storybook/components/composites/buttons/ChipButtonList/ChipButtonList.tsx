import { cn } from "@heroui/react"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { IconComponent } from "@sb-components/atoms/buttons/Button/button-tokens"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — a NEW composite (no `src` yet; synced later).
 *
 * Ported from 4 near-identical call-sites in `ContentAiChat`
 * (`src/components/features/learn/ContentAiChat/index.tsx:1329-1449`) that each
 * hand-roll a list of `secondary`/`ghost` Buttons with the SAME shape — leading bare
 * icon (optional) + label, `justify-start text-start` — for: empty-state suggestion
 * chips, retrieval-skill chips, selected-passage quick-asks, and the skill menu.
 * Folded into ONE shared composite (§4 ownership): anywhere that needs "a row of
 * suggestion chips" or "a skill-menu row" composes THIS composite — no hand-rolling
 * a Button list again.
 *
 * COMPOSES the base {@link Button} for EVERY item (does NOT import HeroUI directly) —
 * press/pending/disabled live on the base Button (§4); this composite only owns
 * LAYOUT (cluster vs column) + icon size (§5: the leading icon is always forced to
 * `size-4 shrink-0 text-muted` — it does NOT use `Button`'s own trailing/sliding
 * `icon` slot; a chip's icon stays put, leading the label).
 *
 * `direction`:
 * - `"wrap"` — a cluster of suggestion chips: default variant `secondary`,
 *   `flex-wrap gap-2`, each chip auto-width, the label is Button's own bare
 *   children (not routed through Typography — same as how the base Button already
 *   displays its own label).
 * - `"column"` — a vertical skill-menu list: default variant `ghost`, each row is
 *   full-width `px-3 py-2`, the label goes through {@link Typography}
 *   (`weight="medium"`, `truncate`) instead of a hand-typed `text-sm font-medium
 *   text-foreground` className (canon §1: color/weight go through a PROP, not a
 *   `text-*`/`font-*` class on Typography).
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
    anatPart?: string
    /** `true` → emit `data-anat-part` on every part (Button/icon/Typography) for {@link BlockAnatomy}. */
    showAnatomy?: boolean
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

const ITEM_CLS: Record<ChipButtonListDirection, string> = {
    wrap: "justify-start text-start",
    column: "h-auto w-full justify-start gap-3 px-3 py-2 text-start",
}

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
    anatPart,
    showAnatomy = false,
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
                className={ITEM_CLS[direction]}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        ))
        : items.map((item, index) => {
            const Icon = item.icon
            return (
                <Button
                    key={item.id ?? index}
                    variant={resolvedVariant}
                    size={direction === "wrap" ? "sm" : "md"}
                    className={ITEM_CLS[direction]}
                    onPress={item.onPress}
                    isDisabled={item.isDisabled}
                    anatPart={showAnatomy ? "Button" : undefined}
                >
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
                            showAnatomy={showAnatomy}
                            text={item.label}
                        />
                    ) : (
                        item.label
                    )}
                </Button>
            )
        })

    return (
        <div
            className={cn(CONTAINER_CLS[direction], classNames)}
            data-anat-part={anatPart}
            data-tier="composite"
            data-component="ChipButtonList"
            data-principles={direction === "wrap" ? "flex-action" : undefined}
        >
            {rendered}
        </div>
    )
}
