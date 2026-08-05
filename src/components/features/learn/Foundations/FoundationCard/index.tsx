"use client"

import { CaretRightIcon, StackIcon } from "@phosphor-icons/react"
import { Chip, cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import React, { useCallback } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { resolveFoundationMountFileUrl } from "../utils"
import { FoundationKind } from "@/modules/types/enums/foundation-kind"
import type { FoundationEntity } from "@/modules/types/entities/foundation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { pathConfig } from "@/resources/path"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setFoundation, setFoundationId } from "@/redux/slices/foundation"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"

/** Props for {@link FoundationCard}. */
export interface FoundationCardProps extends WithClassNames<undefined> {
    /** Foundation resource row from API. Absent only while {@link FoundationCardProps.isSkeleton}. */
    foundation?: FoundationEntity
    /** 0-based position in the sorted list (for display numbering). */
    displayIndex?: number
    /** Whether this card is the active selection. */
    selected?: boolean
    /**
     * First load, nothing in hand → this row shimmers in place. The resting state lives
     * HERE, in the same file as the loaded one, so the two shapes cannot drift apart
     * (`loading-and-skeleton.md`) — there is no separate `FoundationCardSkeleton` twin.
     */
    isSkeleton?: boolean
    /** Bottom divider — set on every row except the last, while shimmering. */
    divider?: boolean
}

/**
 * One foundation resource as a link-and-caret list row (block {@link ListRow}).
 *
 * Replaces the former pressable card: a small square thumbnail, the numbered
 * title + one-line description, the resource KIND chip (+ "recommended" badge) in
 * the meta slot, and a trailing caret. Tags + author are intentionally dropped for
 * the compact list — they live on the resource itself. The feature owns only the
 * select dispatch + open-resource side effect; the row owns all styling.
 * @param props.foundation - Foundation entity from the category list.
 * @param props.displayIndex - Position in the sorted list (shown as 1-based label).
 * @param props.selected - Highlights the row when true.
 * @param props.divider - Bottom border for all but the last row in the joined list.
 * @param props.className - Optional root class names.
 */
export const FoundationCard = ({
    foundation,
    displayIndex = 0,
    selected = false,
    isSkeleton = false,
    divider = false,
    className,
}: FoundationCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const categoryId = useAppSelector((state) => state.foundation.categoryId)

    /**
     * Open the resource: external links go to a new tab; document/video resources
     * navigate to their dedicated page (no modal).
     */
    const onPress = useCallback(() => {
        if (!foundation) {
            return
        }
        dispatch(setFoundation(foundation))
        dispatch(setFoundationId(foundation.id))

        // external links live off-site — open in a new tab, no in-app page
        if (foundation.kind === FoundationKind.ExternalLink) {
            if (foundation.value?.trim()) {
                window.open(
                    resolveFoundationMountFileUrl(foundation.value),
                    "_blank",
                    "noopener,noreferrer",
                )
            }
            return
        }

        // document / video → the dedicated resource page
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
    }, [
        dispatch,
        foundation,
        courseDisplayId,
        categoryId,
        locale,
        router,
    ])

    // The resting state of THIS row, in THIS file — the shape it mirrors is right below,
    // so the two cannot drift the way a separate `*Skeleton` twin file does.
    if (isSkeleton || !foundation) {
        return (
            <Skeleton.ListRow
                withTrailing
                className={cn("px-3", divider && "border-b border-separator", className)}
            />
        )
    }

    return (
        <SurfaceListCardRow
            leading={(
                <IconTile
                    src={foundation.thumbnailUrl}
                    icon={<StackIcon />}
                    alt={foundation.title}
                    size="sm"
                />
            )}
            title={`${displayIndex + 1}. ${foundation.title}`}
            subtitle={foundation.description ?? undefined}
            meta={(
                <>
                    <Chip size="sm" variant="secondary" color="accent">
                        <Chip.Label>{t(`foundations.kind.${foundation.kind}`)}</Chip.Label>
                    </Chip>
                    {foundation.isRecommended ? (
                        <Chip size="sm" variant="secondary" color="success" className="bg-success-soft text-success-soft-foreground">
                            <Chip.Label>{t("foundations.recommended")}</Chip.Label>
                        </Chip>
                    ) : null}
                </>
            )}
            trailing={(
                <CaretRightIcon
                    aria-hidden
                    focusable="false"
                    weight="bold"
                    className="size-4 text-muted"
                />
            )}
            onPress={onPress}
            selected={selected}
            className={className}
        />
    )
}
