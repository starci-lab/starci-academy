"use client"

import { cn } from "@heroui/react"
import type { FoundationEntity } from "@/modules/types"
import React from "react"
import { FoundationItemThumbnail } from "../FoundationItemThumbnail"
import { FoundationMeta } from "../FoundationMeta"
import { PressableCard } from "@/components/reuseable"

export interface FoundationCardProps {
    /** Foundation resource row from API. */
    foundation: FoundationEntity
    /** 0-based position in the sorted list (for display numbering). */
    displayIndex: number
    /** Whether this card is the active selection. */
    selected?: boolean
    /** Called when the user selects this card. */
    onSelect: (foundation: FoundationEntity) => void
}

/**
 * Selectable foundation card in the category list (master pane).
 * @param props.foundation - Foundation entity from the category list.
 * @param props.displayIndex - Position in the sorted grid (shown as 1-based label).
 * @param props.selected - Highlights the card when true.
 * @param props.onSelect - Invoked on card press with the foundation row.
 */
export const FoundationCard = ({
    foundation,
    displayIndex,
    selected = false,
    onSelect,
}: FoundationCardProps) => {
    return (
        <PressableCard
            ariaLabel={foundation.title}
            className={cn(
                "card !p-0 flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl transition-colors",
                selected
                    ? "bg-accent/10 ring-1 ring-accent/30"
                    : "card--default hover:bg-accent/5",
            )}
            onPress={() => onSelect(foundation)}
        >
            <FoundationItemThumbnail
                thumbnailUrl={foundation.thumbnailUrl}
                title={foundation.title}
                size="card"
            />
            <div className="flex flex-1 flex-col p-3">
                <span className="text-lg font-semibold">
                    {displayIndex + 1}. {foundation.title}
                </span>
                <div className="mt-2">
                    <FoundationMeta foundation={foundation} />
                </div>
                {foundation.description ? (
                    <p className="text-muted mt-2 line-clamp-2 text-sm">{foundation.description}</p>
                ) : null}
            </div>
        </PressableCard>
    )
}
