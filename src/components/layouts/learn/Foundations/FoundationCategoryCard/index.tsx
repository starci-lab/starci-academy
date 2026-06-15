"use client"

import { cn } from "@heroui/react"
import type { FoundationCategoryEntity, WithClassNames } from "@/modules/types"
import React, { useCallback } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppDispatch, useAppSelector } from "@/redux"
import {
    setFoundation,
    setFoundationCategory,
    setFoundationCategoryId,
    setFoundationId,
    setFoundations,
} from "@/redux/slices"
import { FoundationCategoryThumbnail } from "../FoundationCategoryThumbnail"
import { PressableCard } from "@/components/reuseable"

export interface FoundationCategoryCardProps extends WithClassNames<undefined> {
    /** Foundation category from API. */
    category: FoundationCategoryEntity
}

/**
 * Clickable card for one foundation category in the overview grid.
 * @param props.category - Category row (title, description, thumbnail).
 * @param props.className - Optional root class names.
 */
export const FoundationCategoryCard = ({
    category,
    className,
}: FoundationCategoryCardProps) => {
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    /** Select this category: persist to store, reset foundation state, navigate. */
    const onPress = useCallback(() => {
        dispatch(setFoundationCategoryId(category.id))
        dispatch(setFoundationCategory(category))
        dispatch(setFoundationId(undefined))
        dispatch(setFoundation(undefined))
        dispatch(setFoundations(undefined))

        if (!courseDisplayId) {
            return
        }
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .learn()
                .foundations(category.id)
                .build(),
        )
    }, [
        category,
        courseDisplayId,
        dispatch,
        locale,
        router,
    ])

    return (
        <PressableCard
            ariaLabel={category.title}
            className={cn(
                "card card--default !p-0 flex h-full w-full flex-col overflow-hidden rounded-xl transition-colors",
                "hover:bg-accent/5",
                className,
            )}
            onPress={onPress}
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
