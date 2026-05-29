"use client"

import React, {
    useCallback,
    useMemo,
    type Key,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    type WithClassNames,
} from "@/modules/types"
import {
    useQueryContentSwr,
    useQueryContentStatusSwr,
} from "@/hooks/singleton"
import {
    ContentTab,
    setContentTab,
} from "@/redux/slices"
import type {
    ContentTabItem,
} from "./types"
import {
    ContentBody,
} from "./ContentBody"
import {
    CodeLessonBody,
} from "./CodeLessonBody"
import {
    ChallengeBody,
} from "./ChallengeBody"
import {
    ContentTabBar,
} from "./ContentTabBar"
import {
    ContentHeader,
} from "./ContentHeader"
import {
    ContentHeaderSkeleton,
} from "./ContentHeaderSkeleton"

export type ContentProps = WithClassNames<undefined>

/**
 * Learn content page layout for `/modules/[moduleId]/contents/[contentId]`.
 *
 * Owns data (content + status SWR, redux snapshot) and tab navigation, then
 * delegates the header, tab bar and active body to presentational children.
 * @param {ContentProps} props Optional wrapper styling props.
 */
export const Content = ({ className }: ContentProps) => {
    const t = useTranslations()
    const content = useAppSelector((state) => state.content.entity)
    const contentTab = useAppSelector((state) => state.tabs.contentTab)
    const queryContentSwr = useQueryContentSwr()
    useQueryContentStatusSwr()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    /** Tab entries (key + label + body) rendered in the tab bar. */
    const tabItems = useMemo<Array<ContentTabItem>>(
        () => [
            {
                key: ContentTab.Content,
                label: t("content.tabs.content"),
                component: <ContentBody />,
            },
            {
                key: ContentTab.CodeExplainings,
                label: t("content.tabs.codeExplainings"),
                component: <CodeLessonBody />,
            },
            {
                key: ContentTab.Challenges,
                label: t("content.tabs.challenges"),
                component: <ChallengeBody />,
            },
        ],
        [t],
    )

    /** Body of the currently selected tab. */
    const bodyComponent = useMemo(
        () => tabItems.find((item) => item.key === contentTab)?.component,
        [contentTab, tabItems],
    )

    const isLoading = queryContentSwr.isLoading || !content

    /** Persist the selected tab to redux and reflect it in the URL query. */
    const onTabChange = useCallback(
        (key: Key) => {
            const nextTab = key as ContentTab
            dispatch(setContentTab(nextTab))
            const params = new URLSearchParams(searchParams.toString())
            params.set("tab", nextTab)
            router.replace(`${pathname}?${params.toString()}`)
        },
        [dispatch, searchParams, router, pathname],
    )

    return (
        <div className={cn("", className)}>
            <div className="h-3" />
            {isLoading ? (
                <div>
                    <ContentHeaderSkeleton />
                    <ContentTabBar
                        tabItems={tabItems}
                        selectedKey={contentTab}
                        ariaLabel={t("module.tabListAria")}
                        onSelectionChange={onTabChange}
                    />
                    <div className="h-6" />
                    <div />
                </div>
            ) : (
                <div>
                    <ContentHeader />
                    <ContentTabBar
                        tabItems={tabItems}
                        selectedKey={contentTab}
                        ariaLabel={t("module.tabListAria")}
                        onSelectionChange={onTabChange}
                    />
                    <div className="h-3" />
                    <div className="p-3">
                        {bodyComponent}
                    </div>
                </div>
            )}
        </div>
    )
}
