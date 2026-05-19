"use client"

import { cn } from "@heroui/react"
import type { FoundationCategoryEntity } from "@/modules/types"
import React from "react"
import { FoundationCategoryThumbnail } from "../FoundationCategoryThumbnail"

export interface FoundationCategoryCardProps {
    /** Foundation category from API. */
    category: FoundationCategoryEntity
    /** Navigates to the category learn page. */
    onPress: (category: FoundationCategoryEntity) => void
}

/**
 * Clickable card for one foundation category in the overview grid.
 * @param props.category - Category row (title, description, thumbnail).
 * @param props.onPress - Called when the user selects this category.
 */
export const FoundationCategoryCard = ({
    category,
    onPress,
}: FoundationCategoryCardProps) => {
    return (
        <button
            type="button"
            className={cn(
                "card card--default flex h-full flex-col overflow-hidden rounded-xl border",
                "border-divider/60 text-left transition-colors",
                "hover:border-accent/40 hover:bg-accent/5",
            )}
            onClick={() => onPress(category)}
        >
            <FoundationCategoryThumbnail
                thumbnailUrl={category.thumbnailUrl}
                title={category.title}
            />
            <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-1">
                <span className="text-lg font-semibold">{category.title}</span>
                {category.description ? (
                    <p className="text-muted line-clamp-3 text-sm">{category.description}</p>
                ) : null}
            </div>
        </button>
    )
}
