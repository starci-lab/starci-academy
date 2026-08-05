"use client"

import React, {
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    ContentBodySkeleton,
} from "../../ContentBodySkeleton"
import {
    useAutoMarkContentRead,
} from "../useAutoMarkContentRead"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { useAppSelector } from "@/redux/hooks"
import { listContentBodyLangs, pickContentBodyByLang, resolveContentBody } from "@/modules/types/entities/content-body"
import { resolveActiveProgrammingLang } from "@/modules/types/utils/programming-language"
import { ScrollArea } from "@/components/frames/ScrollArea"
import { StackV } from "@/components/frames/Stack"
import { useQueryContentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentStatusSwr"
import { useQueryContentSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentSwr"

/**
 * SCHEMA V2 content body. Shares the toolbar / favorite / mark-as-read behaviour with the
 * legacy body; the body itself is the V2 entry point and will render the per-language
 * `@starci/replace` payload once that format lands. For now it renders the resolved markdown.
 */
export const ContentBodyV2 = () => {
    const t = useTranslations()
    const locale = useLocale()
    const queryContentSwr = useQueryContentSwr()
    const contentFromRedux = useAppSelector((state) => state.content.entity)
    const routeContentId = useAppSelector((state) => state.content.id)
    const contentSnapshot = contentFromRedux ?? queryContentSwr.data
    const content =
        contentSnapshot?.id && routeContentId && contentSnapshot.id === routeContentId
            ? contentSnapshot
            : undefined
    const queryContentStatusSwr = useQueryContentStatusSwr()
    const isSkeleton = queryContentSwr.isLoading && !content

    // SCHEMA V2 lesson body: all languages fetched up-front as `bodies`; a tab switches which one
    // is rendered, resolved to the active locale.
    const langs = useMemo(
        () => listContentBodyLangs(content?.bodies),
        [content?.bodies],
    )
    const selectedLang = useAppSelector((state) => state.content.selectedProgrammingLang)
    const activeLang = useMemo(
        () => resolveActiveProgrammingLang(selectedLang, langs),
        [
            selectedLang,
            langs,
        ],
    )
    const activeBody = useMemo(
        () => resolveContentBody(pickContentBodyByLang(content?.bodies, activeLang), locale),
        [content?.bodies, activeLang, locale],
    )

    // Auto mark-as-read on scroll: silent progress tick at the bottom sentinel,
    // dwell-gated XP + feed grant. Returns the ref for the sentinel element below.
    const sentinelRef = useAutoMarkContentRead({
        contentId: content?.id,
        isRead: queryContentStatusSwr.data?.isRead,
        isLoading: isSkeleton,
    })

    if (isSkeleton) {
        return <ContentBodySkeleton variant="v2" />
    }

    return (
        <ScrollArea
            identity={{ tier: "block", component: "ContentBodyV2" }}
            axis="x"
            body={() => (
                <StackV
                    gap={6}
                    items={[
                        // the per-language switcher lives in the tab toolbar (LessonReader →
                        // ContentTabBar rightSlot); this body just renders the active language.
                        () => <MarkdownContent reading markdown={activeBody || t("content.empty")} />,
                        // Mark-as-read sentinel only — reactions + comments render OUTSIDE this
                        // reading card, as their own blocks. Hidden for premium (paywall follows).
                        // A zero-height measurement target, not a shape: it has nothing to compose.
                        ...(contentFromRedux?.isPremium
                            ? []
                            : [() => <div ref={sentinelRef} className="h-1" />]),
                    ]}
                />
            )}
        />
    )
}
