"use client"

import React from "react"
import {
    Chip,
    Tooltip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import type {
    ModuleSummaryItem,
} from "../types"

/** Props for {@link ModuleSummaryChips}. */
export interface ModuleSummaryChipsProps {
    /** Summary items (content/video/challenge counters) to render as chips. */
    items: Array<ModuleSummaryItem>
}

/**
 * Row of summary chips (icon + count + tooltip) shown under a module title.
 *
 * Presentational: renders the supplied items. `"use client"` because HeroUI
 * `Tooltip`/`Chip` are interactive.
 * @param props - the summary items to render
 */
export const ModuleSummaryChips = ({
    items,
}: ModuleSummaryChipsProps) => {
    const t = useTranslations()
    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {items.map((item) => {
                const ItemIcon = item.icon
                return (
                    <Tooltip key={item.id} delay={400}>
                        <Tooltip.Trigger>
                            <Chip
                                size="sm"
                                color="accent"
                                variant="soft"
                                className="cursor-default"
                            >
                                <ItemIcon className="size-4 shrink-0" />
                                <Chip.Label>{item.quantity}</Chip.Label>
                            </Chip>
                        </Tooltip.Trigger>
                        <Tooltip.Content placement="top" showArrow>
                            <Tooltip.Arrow />
                            {t(item.tooltipKey)}
                        </Tooltip.Content>
                    </Tooltip>
                )
            })}
        </div>
    )
}
