"use client"

import React from "react"
import type { ReactNode } from "react"
import { Button, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    ArrowDownIcon,
    ArrowUpIcon,
    TrashIcon,
} from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link RepeatableItemCard}. */
export interface RepeatableItemCardProps extends WithClassNames<undefined> {
    /** Field controls for this one item. */
    children: ReactNode
    /** Remove this item from its block. */
    onRemove: () => void
    /** Move this item one slot up among its siblings; omit/hide when already first. */
    onMoveUp?: () => void
    /** Move this item one slot down among its siblings; omit/hide when already last. */
    onMoveDown?: () => void
    /** Optional trailing slot in the header row (e.g. a source `Chip`). */
    headerEnd?: ReactNode
}

/**
 * Shared shell for ONE repeatable entry inside a repeatable {@link CvBlock}
 * (one job, one school, one project, one achievement) — a bordered surface
 * card with a reorder-up / reorder-down / remove header row, and the block's
 * own fields as `children`. Every repeatable block editor renders its items
 * through this so remove/reorder read + behave identically everywhere.
 *
 * @param props - {@link RepeatableItemCardProps}
 */
export const RepeatableItemCard = ({
    className,
    children,
    onRemove,
    onMoveUp,
    onMoveDown,
    headerEnd,
}: RepeatableItemCardProps) => {
    const t = useTranslations()

    return (
        <div className={cn("flex flex-col gap-3 rounded-2xl border border-default bg-transparent px-4 py-3", className)}>
            <div className="flex items-center justify-end gap-2">
                {headerEnd}
                <div className="flex items-center gap-2">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="tertiary"
                        isDisabled={!onMoveUp}
                        aria-label={t("cv.blocks.common.moveUp")}
                        onPress={onMoveUp}
                    >
                        <ArrowUpIcon aria-hidden className="size-4" />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="tertiary"
                        isDisabled={!onMoveDown}
                        aria-label={t("cv.blocks.common.moveDown")}
                        onPress={onMoveDown}
                    >
                        <ArrowDownIcon aria-hidden className="size-4" />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="danger-soft"
                        aria-label={t("cv.blocks.common.removeItem")}
                        onPress={onRemove}
                    >
                        <TrashIcon aria-hidden className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {children}
            </div>
        </div>
    )
}
