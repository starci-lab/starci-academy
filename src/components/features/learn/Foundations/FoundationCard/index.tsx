"use client"

import { Typography, cn } from "@heroui/react"
import type { FoundationEntity, WithClassNames } from "@/modules/types"
import React, { useCallback } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppDispatch, useAppSelector } from "@/redux"
import {
    setFoundation,
    setFoundationId,
} from "@/redux/slices"
import { FoundationItemThumbnail } from "../FoundationItemThumbnail"
import { FoundationMeta } from "../shared/FoundationMeta"
import { PressableCard } from "@/components/reuseable"
import { useOpenFoundationResource } from "../hooks"

export interface FoundationCardProps extends WithClassNames<undefined> {
    /** Foundation resource row from API. */
    foundation: FoundationEntity
    /** 0-based position in the sorted list (for display numbering). */
    displayIndex: number
    /** Whether this card is the active selection. */
    selected?: boolean
}

/**
 * Selectable foundation card in the category list (master pane).
 * @param props.foundation - Foundation entity from the category list.
 * @param props.displayIndex - Position in the sorted grid (shown as 1-based label).
 * @param props.selected - Highlights the card when true.
 * @param props.className - Optional root class names.
 */
export const FoundationCard = ({
    foundation,
    displayIndex,
    selected = false,
    className,
}: FoundationCardProps) => {
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const categoryId = useAppSelector((state) => state.foundation.categoryId)
    const openFoundationResource = useOpenFoundationResource()

    /** Select this foundation: persist to store, deep-link URL, open viewer. */
    const onPress = useCallback(() => {
        dispatch(setFoundation(foundation))
        dispatch(setFoundationId(foundation.id))

        if (courseDisplayId && categoryId) {
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .foundations(categoryId)
                    .item(foundation.id)
                    .build(),
            )
        }

        openFoundationResource(foundation)
    }, [
        dispatch,
        foundation,
        courseDisplayId,
        categoryId,
        locale,
        router,
        openFoundationResource,
    ])

    return (
        <PressableCard
            ariaLabel={foundation.title}
            className={cn(
                "card !p-0 flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl transition-colors",
                selected
                    ? "bg-accent/10 ring-1 ring-accent/30"
                    : "card--default hover:bg-accent/5",
                className,
            )}
            onPress={onPress}
        >
            <FoundationItemThumbnail
                thumbnailUrl={foundation.thumbnailUrl}
                title={foundation.title}
                size="card"
            />
            <div className="flex flex-1 flex-col p-3">
                <Typography type="h4" weight="semibold">
                    {displayIndex + 1}. {foundation.title}
                </Typography>
                <div className="mt-2">
                    <FoundationMeta foundation={foundation} />
                </div>
                {foundation.description ? (
                    <Typography type="body-sm" color="muted" className="mt-2 line-clamp-2">
                        {foundation.description}
                    </Typography>
                ) : null}
            </div>
        </PressableCard>
    )
}
