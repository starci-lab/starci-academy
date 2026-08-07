"use client"

import React, {
    useCallback,
} from "react"
import {
    Chip,
    Typography,
} from "@heroui/react"
import {
    FileTextIcon,
    ClockIcon,
    FlameIcon,
} from "@phosphor-icons/react"
import {
    useRouter,
} from "next/navigation"
import {
    useTranslations,
} from "next-intl"
import {
    pathConfig,
} from "@/resources/path"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { StackH } from "@/components/frames/Stack"
import { type ContentEntity, getContentChallengeCount } from "@/modules/types/entities/content"

/** Props for {@link BookmarkCard} (list item — per-item content data only). */
export interface BookmarkCardProps {
    /** Saved content entity rendered by this row. */
    content: ContentEntity
}

/**
 * One saved-content row inside the bookmark {@link SurfaceListCard}: a file icon,
 * the lesson title (the link — underlines on hover), the owning course as a
 * subtitle, and read-time / premium / challenge meta. The whole row navigates to
 * the content page (the title IS the link, so hover underlines it rather than
 * filling the row).
 *
 * List item: receives its own content entity and self-navigates via the router.
 * @param props - {@link BookmarkCardProps}
 */
export const BookmarkCard = ({
    content,
}: BookmarkCardProps) => {
    const t = useTranslations()
    const router = useRouter()
    const challengeCount = getContentChallengeCount(content)

    const onPress = useCallback(
        () => {
            if (content.displayId) {
                router.push(pathConfig().locale().publicContent(content.displayId).build())
            }
        },
        [
            content.displayId,
            router,
        ],
    )

    return (
        <SurfaceListCardRow
            hover="underline"
            onPress={onPress}
            leading={() => (
                <IconTile
                    size="sm"
                    tone="neutral"
                    src={content.module?.course?.coverImageUrl}
                    icon={<FileTextIcon />}
                    alt={content.title ?? ""}
                />
            )}
            title={content.title}
            subtitle={content.module?.course?.title}
            meta={() => (
                <>
                    {content.isPremium ? (
                        <Chip size="sm" variant="soft" color="warning">
                            <Chip.Label>{t("bookmarks.premium")}</Chip.Label>
                        </Chip>
                    ) : null}
                    <StackH
                        as="span"
                        inline
                        gap={2}
                        align="center"
                        principle="icon-text"
                        explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                        items={[
                            () => <ClockIcon aria-hidden className="size-4 text-muted" />,
                            () => (
                                <Typography type="body-xs" color="muted">
                                    {t("content.minutesRead", { minutes: content.minutesRead })}
                                </Typography>
                            ),
                        ]}
                    />
                    {challengeCount > 0 ? (
                        <StackH
                            as="span"
                            inline
                            gap={2}
                            align="center"
                            principle="icon-text"
                            explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                            items={[
                                () => <FlameIcon aria-hidden className="size-4 text-muted" />,
                                () => (
                                    <Typography type="body-xs" color="muted">
                                        {challengeCount}
                                    </Typography>
                                ),
                            ]}
                        />
                    ) : null}
                </>
            )}
        />
    )
}
