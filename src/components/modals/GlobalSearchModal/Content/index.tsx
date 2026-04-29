"use client"
import { useSearchOverlayState } from "@/hooks/singleton"
import {
    ArticleIcon,
    BracketsCurlyIcon,
    GraduationCapIcon,
    SwordIcon,
    VideoIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import React, { useCallback } from "react"
import { GlobalSearchContentBlock } from "./Block"
import { useAppSelector } from "@/redux"
import { ScrollShadow } from "@heroui/react"

/**
 * Grouped command-palette style results for global search (courses, modules, contents, challenges, lesson videos).
 */
export const GlobalSearchContent = () => {
    const t = useTranslations()
    const router = useRouter()
    const { setOpen } = useSearchOverlayState()

    const courses = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.courses)
    const modules = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.modules)
    const challenges = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.challenges)
    const contents = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.contents)
    const lessonVideos = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.lessonVideos)


    const onItemPress = useCallback(
        () => {
            setOpen(false)
        }, [setOpen, router])

    return (
        <ScrollShadow hideScrollBar className="max-h-[300px] p-3">
            <GlobalSearchContentBlock
                icon={GraduationCapIcon}
                label={t("search.suggestions.courses")}
                items={courses ?? []}
                onItemPress={onItemPress}
            />
            <GlobalSearchContentBlock
                icon={BracketsCurlyIcon}
                label={t("search.suggestions.modules")}
                items={modules ?? []}
                onItemPress={onItemPress}
            />
            <GlobalSearchContentBlock
                icon={ArticleIcon}
                label={t("search.suggestions.contents")}
                items={contents ?? []}
                onItemPress={onItemPress}
            />
            <GlobalSearchContentBlock
                icon={SwordIcon}
                label={t("search.suggestions.challenges")}
                items={challenges ?? []}
                onItemPress={onItemPress}
            />
            <GlobalSearchContentBlock
                icon={VideoIcon}
                label={t("search.suggestions.lessonVideos")}
                items={lessonVideos ?? []}
                onItemPress={onItemPress}
            />
        </ScrollShadow>
    )
}
