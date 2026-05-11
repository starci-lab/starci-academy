"use client"

import React, { useMemo } from "react"
import { Chip, Skeleton, Tabs, cn, Button, Tooltip } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { WithClassNames } from "@/modules/types"
import { useQueryContentSwr, useQueryContentStatusSwr, useMutateToggleFavoriteSwr, useContentOverlayState, useShareOverlayState } from "@/hooks/singleton"
import { SwordIcon, ClockIcon, VideoIcon, BookOpenIcon, BookmarkSimpleIcon, ShareNetworkIcon, CheckCircleIcon, ArrowsOutIcon } from "@phosphor-icons/react"
import { LessonBody } from "./LessonBody"
import { ContentBody } from "./ContentBody"
import { ChallengeBody } from "./ChallengeBody"
import { ContentTab, setContentTab, setContentIsFavorite } from "@/redux/slices"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { runGraphQLWithToast } from "@/modules/toast"

export type ContentProps = WithClassNames<undefined>

/**
 * Learn content page layout for `/modules/[moduleId]/contents/[contentId]`.
 * @param {ContentProps} props Optional wrapper styling props.
 */
export const Content = ({ className }: ContentProps) => {
    const t = useTranslations()
    const content = useAppSelector((state) => state.content.entity)
    const isRead = useAppSelector((state) => state.content.isRead)
    const isFavorite = useAppSelector((state) => state.content.isFavorite)
    const queryContentSwr = useQueryContentSwr()
    useQueryContentStatusSwr()
    const mutateToggleFavoriteSwr = useMutateToggleFavoriteSwr()
    const contentOverlay = useContentOverlayState()
    const shareOverlay = useShareOverlayState()
    const dispatch = useAppDispatch()

    const tabItems = [
        {
            icon: BookOpenIcon,
            key: "content",
            label: t("content.tabs.content"),
            component: <ContentBody />
        },
        {
            icon: VideoIcon,
            key: "lessonVideos",
            label: t("content.tabs.lessonVideos"),
            component: <LessonBody />
        },
        {
            icon: SwordIcon,
            key: "challenges",
            label: t("content.tabs.challenges"),
            component: <ChallengeBody />
        }
    ]
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const contentTab = useAppSelector((state) => state.tabs.contentTab)
    const bodyComponent = useMemo(() => tabItems.find((item) => item.key === contentTab)?.component, [contentTab])
    const onTabChange = (key: React.Key) => {
        const nextTab = key as ContentTab
        dispatch(setContentTab(nextTab))
        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", nextTab)
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className={cn("", className)}>
            <div className="h-3" />
            {queryContentSwr.isLoading || !content ? (
                <div>
                    <div className="p-3">
                        <Skeleton className="h-6 py-1 rounded-full" />
                        <div className="h-3" />
                        <Skeleton className="h-[14px] my-[3px] w-full rounded-full" />
                        <Skeleton className="h-[14px] my-[3px] w-5/6 rounded-full" />
                        <div className="h-3" />
                        <Skeleton className="h-6 w-[100px] rounded-full" />
                    </div>
                    <Tabs selectedKey={contentTab} 
                        variant="secondary" 
                        onSelectionChange={onTabChange}
                    >
                        <Tabs.ListContainer>
                            <Tabs.List aria-label={t("module.tabListAria")}>
                                {tabItems.map((item) => (
                                    <Tabs.Tab
                                        key={item.key}
                                        id={item.key}
                                        className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon className="size-5" />
                                            <span>{item.label}</span>
                                        </div>
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs.ListContainer>
                    </Tabs>
                    <div className="h-6" />
                    <div/>
                </div>
            ) : (
                <div>
                    <div className="p-3">
                        <div className="text-2xl font-bold">{content?.title}</div>
                        <div className="h-2" />
                        <div className="text-sm text-muted">{content?.description}</div>
                        <div className="h-3" />
                        <div className="flex items-center gap-2 flex-wrap">
                            <Chip variant="secondary" color="accent">
                                <ClockIcon className="size-5" />
                                <Chip.Label>
                                    {t("content.minutesRead", {
                                        minutes: content?.minutesRead ?? 0,
                                    })}
                                </Chip.Label>
                            </Chip>
                            <Chip variant="secondary" color="accent">
                                <VideoIcon className="size-5" />
                                <Chip.Label>
                                    {t("content.lessonCount", {
                                        count: content?.numLessons ?? 0,
                                    })}
                                </Chip.Label>
                            </Chip>
                            <Chip variant="secondary" color="accent">
                                <SwordIcon className="size-5" />
                                <Chip.Label>
                                    {t("content.challengeCount", {
                                        count: content?.numChallenges ?? 0,
                                    })}
                                </Chip.Label>
                            </Chip>
                            {isRead && (
                                <Chip variant="secondary" color="success">
                                    <CheckCircleIcon className="size-5" weight="fill" />
                                    <Chip.Label>
                                        {t("content.read")}
                                    </Chip.Label>
                                </Chip>
                            )}
                        </div>
                        <div className="h-3" />
                        {/* Action buttons: Save + Share */}
                        <div className="flex items-center gap-2">
                            <Tooltip content={isFavorite ? t("content.unsave") : t("content.save")}>
                                <Button
                                    size="sm"
                                    variant={isFavorite ? "solid" : "outlined"}
                                    color={isFavorite ? "accent" : "default"}
                                    onPress={async () => {
                                        if (!content?.id) return
                                        const newFavorite = !isFavorite
                                        await runGraphQLWithToast(
                                            async () => {
                                                const env = await mutateToggleFavoriteSwr.trigger({
                                                    contentId: content.id,
                                                    isFavorite: newFavorite,
                                                })
                                                if (!env?.success) {
                                                    throw new Error(env?.error ?? env?.message ?? "Toggle favorite failed")
                                                }
                                                dispatch(setContentIsFavorite(newFavorite))
                                                return env
                                            },
                                            { showSuccessToast: true, showErrorToast: true },
                                        )
                                    }}
                                    isLoading={mutateToggleFavoriteSwr.isMutating}
                                    id="content-save-btn"
                                >
                                    <BookmarkSimpleIcon
                                        className="size-4"
                                        weight={isFavorite ? "fill" : "regular"}
                                    />
                                    {isFavorite ? t("content.saved") : t("content.save")}
                                </Button>
                            </Tooltip>
                            {!content?.isPremium && (
                                <Tooltip content={t("content.shareTooltip")}>
                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        color="default"
                                        onPress={() => shareOverlay.setOpen(true)}
                                        id="content-share-btn"
                                    >
                                        <ShareNetworkIcon className="size-4" />
                                        {t("content.share")}
                                    </Button>
                                </Tooltip>
                            )}
                            <Tooltip content={t("content.fullscreen")}>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    color="default"
                                    onPress={() => contentOverlay.setOpen(true)}
                                    id="content-fullscreen-btn"
                                >
                                    <ArrowsOutIcon className="size-4" />
                                </Button>
                            </Tooltip>
                        </div>
                        <div className="h-3" />
                    </div>
                    <Tabs selectedKey={contentTab} variant="secondary" onSelectionChange={onTabChange}>
                        <Tabs.ListContainer>
                            <Tabs.List aria-label={t("module.tabListAria")}>
                                {tabItems.map((item) => (
                                    <Tabs.Tab
                                        key={item.key}
                                        id={item.key}
                                        className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon className="size-5" />
                                            <span>{item.label}</span>
                                        </div>
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs.ListContainer>
                    </Tabs>
                    <div className="h-3" />
                    <div className="p-3">
                        {bodyComponent}
                    </div>
                </div>
            )}
        </div>
    )
}
