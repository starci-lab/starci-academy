"use client"

import React, { type ComponentType } from "react"
import {
    cn,
} from "@heroui/react"
import {
    CaretRightIcon as ChevronRightIcon,
} from "@phosphor-icons/react"
import {
    PressableCard,
} from "../PressableCard"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * Props for {@link SummaryCard}. Every field is an already-resolved shape
 * (icon, value, label, hint) — this card takes no domain entity, which is
 * why it lives at the composite tier despite sitting in `blocks/cards`
 * (BLOCK-7): the folder names a tier the component never earned.
 */
export interface SummaryCardProps {
    /** Leading icon for the metric — a buildable slot, not a built element. */
    icon: ComponentType
    /** Headline value (e.g. a count). */
    value: string
    /** Short label under the value. */
    label: string
    /** Optional one-line hint under the label. */
    hint?: string
    /** Called when the card is activated (e.g. jump to a tab). */
    onPress?: () => void
    /**
     * Where this sits inside its parent. Appearance is not passable — it is
     * already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "SummaryCard" } as const

/**
 * A compact pressable metric card (icon + big value + label, with a trailing
 * chevron) used in the profile overview to surface a deeper tab. Built on
 * {@link PressableCard} for the spring/hover feel; layers its own outlined
 * "default" card look on top of that surface. Presentational — the caller
 * wires `onPress`.
 *
 * `PressableCard` has not itself been ported to the closed `classNames`
 * vocabulary, so its `className` string prop is composed here with `cn`
 * (COMPOSITE-5 — appearance is this tier's job); `SummaryCard` renders no
 * `<div>` of its own beyond what `PressableCard`'s button/anchor already
 * emits, so it carries no separate `data-tier`/`data-component` badge —
 * `PressableCard` offers no slot for one, and wrapping it in an extra `<div>`
 * just to hang the badge on would be the identity wrapper the composite tier
 * says not to add.
 *
 * @param props - {@link SummaryCardProps}
 */
export const SummaryCard = ({
    icon: Icon,
    value,
    label,
    hint,
    onPress,
    classNames,
}: SummaryCardProps) => {
    const rows = [
        () => (
            <StackH
                gap={4}
                justify="between"
                items={[
                    () => <span className="text-accent-soft-foreground"><Icon /></span>,
                    () => <ChevronRightIcon className="size-5 text-muted" />,
                ]}
            />
        ),
        () => (
            <StackV
                gap={1}
                items={[
                    () => <Typography size="h4" weight="bold" text={value} />,
                    () => <Typography size="sm" weight="medium" text={label} />,
                    ...(hint ? [() => <Typography size="xs" color="muted" text={hint} />] : []),
                ]}
            />
        ),
    ]

    return (
        <PressableCard
            onPress={onPress}
            className={cn(
                "card card--default h-full rounded-xl border border-divider/60 p-4 transition-colors",
                "hover:border-accent/40 hover:bg-accent/5",
                classNames,
            )}
        >
            <StackV gap={4} items={rows} />
        </PressableCard>
    )
}
