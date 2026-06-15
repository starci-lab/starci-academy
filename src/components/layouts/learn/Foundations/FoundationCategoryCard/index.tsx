"use client"

import { cn } from "@heroui/react"
import type { FoundationCategoryEntity } from "@/modules/types"
import React from "react"
import { FoundationCategoryThumbnail } from "../FoundationCategoryThumbnail"
import { PressableCard } from "@/components/reuseable"

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
        <PressableCard
            ariaLabel={category.title}
            className={cn(
                "card card--default !p-0 flex h-full w-full flex-col overflow-hidden rounded-xl transition-colors",
                "hover:bg-accent/5",
            )}
            onPress={() => onPress(category)}
        >
            <FoundationCategoryThumbnail
                thumbnailUrl={category.thumbnailUrl}
                title={category.title}
            />
            <div className="flex flex-1 flex-col gap-1.5 p-3">
                <span className="text-lg font-semibold">{category.title}</span>
                {category.description ? (
                    <p className="text-muted line-clamp-3 text-sm">{category.description}</p>
                ) : null}
            </div>
        </PressableCard>
    )
}
