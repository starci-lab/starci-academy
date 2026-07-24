import React from "react"
import { cn } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"
import { PressableCard } from "../PressableCard/PressableCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { TitledText } from "../../text/TitledText/TitledText"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/SummaryCard`. Authored in Storybook (not `src`);
 * synced back to `src` later.
 *
 * - **surface §1a**: leans on {@link PressableCard} for the top-level surface look
 *   (`shadow-surface` + `rounded-3xl`, NO border — top-level cards carry elevation
 *   via shadow, not a viền). SummaryCard adds only layout + the metric slots.
 * - **icon-own §4/§5a**: the primitive owns the leading-icon size (`[&_svg]:size-6`,
 *   matching the `text-2xl` value it sits above) — callers pass the icon TRẦN.
 * - **trailing caret §5a/§5b**: navigation caret = phosphor `CaretRightIcon` `size-3` muted, does NOT slide (only ARROW slides — caret stays put).
 * - **isSkeleton**: self-renders a skeleton mirror of the same layout — consumer just flips the flag.
 */

/** Props for {@link SummaryCard}. */
export interface SummaryCardProps {
    /** Leading icon for the metric (passed TRẦN — the card owns its size, §4). */
    icon: React.ReactNode
    /** Headline value (e.g. a count). */
    value: React.ReactNode
    /** Short label under the value. */
    label: React.ReactNode
    /** Optional one-line hint under the label. */
    hint?: React.ReactNode
    /** Called when the card is activated (e.g. jump to a tab). */
    onPress?: () => void
    /** `true` → render a skeleton mirror of the card (icon · value · label · hint). */
    isSkeleton?: boolean
    /** Extra classes on the card. */
    className?: string
}

/**
 * A compact pressable metric card (icon + big value + label, with a trailing
 * chevron) used in the profile overview to surface a deeper tab. Built on
 * {@link PressableCard} for the whole-card press + top-level surface look
 * (`shadow-surface`, `rounded-3xl`). Presentational — the caller wires `onPress`.
 * For a cluster of ≥2 metric cards use {@link SummaryCardGroup} (`SummaryCard.Group`).
 *
 * @param props - {@link SummaryCardProps}
 */
const SummaryCardBase = ({
    icon,
    value,
    label,
    hint,
    onPress,
    isSkeleton = false,
    className,
}: SummaryCardProps) => {
    // Skeleton mirror — same box (surface + p-3 + gap-3) and same slot tree,
    // each content node swapped for its Skeleton.* placeholder so layout never jumps.
    if (isSkeleton) {
        return (
            <div
                className={cn(
                    "flex h-full w-full flex-col gap-3 rounded-3xl bg-surface p-3 shadow-surface",
                    className,
                )}
            >
                <div className="flex items-center justify-between gap-3">
                    <Skeleton className="size-6 rounded-lg" />
                    <Skeleton className="size-5 rounded" />
                </div>
                {/* value · label · hint stat stack = TitledText (skeleton mirror delegated) */}
                <TitledText size="stat" title="" subtitle="x" hint={hint} isSkeleton />
            </div>
        )
    }

    return (
        <PressableCard
            onPress={onPress}
            className={cn("group flex h-full w-full flex-col gap-3", className)}
        >
            <div className="flex items-center justify-between gap-3">
                <span className="text-accent-soft-foreground [&_svg]:size-6">{icon}</span>
                <CaretRightIcon className="size-3 shrink-0 text-muted" aria-hidden focusable="false" />
            </div>
            {/* big value + label + optional hint = one TitledText (size=stat) — was 3 raw
                spans (§9 fix: value/label/hint font now flows through Typography). */}
            <TitledText size="stat" title={value} subtitle={label} hint={hint} />
        </PressableCard>
    )
}

/** Props for {@link SummaryCardGroup}. */
export interface SummaryCardGroupProps {
    /** The metric cards in the cluster — each an item config the group renders as a {@link SummaryCard}. */
    items: Array<SummaryCardProps>
    /** `true` → PASS `isSkeleton` down to every card (each self-renders its skeleton mirror). */
    isSkeleton?: boolean
    /** Extra classes on the group wrapper. */
    className?: string
}

/**
 * A cluster of ≥2 same-role {@link SummaryCard}s laid out as an equal-width wrap
 * row — the real profile-overview usage. The group OWNS layout (`gap-3`,
 * `basis-56 grow` per card so cards share width and wrap on narrow widths) and the
 * loading fan-out, so callers stop hand-itemizing `<div className="w-56">` wrappers
 * at the call-site. Mirrors the `ButtonGroup` pattern (foldrole cluster → 1 primitive).
 *
 * @param props - {@link SummaryCardGroupProps}
 */
const SummaryCardGroup = ({ items, isSkeleton = false, className }: SummaryCardGroupProps) => (
    <div className={cn("flex flex-wrap gap-3", className)}>
        {items.map((item, index) => (
            <div key={index} className="basis-56 grow">
                <SummaryCardBase {...item} isSkeleton={isSkeleton} />
            </div>
        ))}
    </div>
)

/** Metric card + its cluster group (`SummaryCard.Group`). */
export const SummaryCard = Object.assign(SummaryCardBase, { Group: SummaryCardGroup })
