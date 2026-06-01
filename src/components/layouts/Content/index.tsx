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
    usePremiumGateOverlayState,
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
import {
    PremiumPaywall,
} from "./PremiumPaywall"

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
    const { open: openPremiumGate } = usePremiumGateOverlayState()

    /**
     * Locked premium lesson ("đọc thử"): the backend returns a truncated body
     * with `isPremium=true` when the viewer is not entitled, so we fade the body
     * behind an inline paywall and gate the premium-only tabs (lesson/challenges)
     * behind the register modal.
     */
    const isLocked = content?.isPremium === true

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
                // premium-only on a locked lesson → muted + gated behind the modal
                locked: isLocked,
            },
            {
                key: ContentTab.Challenges,
                label: t("content.tabs.challenges"),
                component: <ChallengeBody />,
                // premium-only on a locked lesson → muted + gated behind the modal
                locked: isLocked,
            },
        ],
        [t, isLocked],
    )

    /** Body of the currently selected tab. */
    const bodyComponent = useMemo(
        () => tabItems.find((item) => item.key === contentTab)?.component,
        [contentTab, tabItems],
    )

    const isLoading = queryContentSwr.isLoading || !content

    /**
     * Switch tabs, but intercept locked premium tabs: open the register modal
     * and keep the current tab selected instead of revealing the gated body.
     */
    const onTabChange = useCallback(
        (key: Key) => {
            const nextTab = key as ContentTab
            if (tabItems.find((item) => item.key === nextTab)?.locked) {
                openPremiumGate()
                return
            }
            dispatch(setContentTab(nextTab))
            const params = new URLSearchParams(searchParams.toString())
            params.set("tab", nextTab)
            router.replace(`${pathname}?${params.toString()}`)
        },
        [tabItems, openPremiumGate, dispatch, searchParams, router, pathname],
    )

    return (
        <div className={cn("", className)}>
            <div className="h-3" />
            {isLoading ? (
                <div>
                    {/* header capped to the reading width; only the tab bar below spans full width */}
                    <div className="mx-auto w-full max-w-[1024px]">
                        <ContentHeaderSkeleton />
                    </div>
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
                    {/* header capped to the reading width; only the tab bar below spans full width */}
                    <div className="mx-auto w-full max-w-[1024px]">
                        <ContentHeader />
                    </div>
                    <ContentTabBar
                        tabItems={tabItems}
                        selectedKey={contentTab}
                        ariaLabel={t("module.tabListAria")}
                        onSelectionChange={onTabChange}
                    />
                    <div className="h-3" />
                    {/* article body capped + centered for readable line length; the frame stays full width */}
                    <div className="relative mx-auto w-full max-w-[1024px]">
                        <div className={cn("p-3", isLocked && "select-none")}>
                            {bodyComponent}
                        </div>
                        {/* Medium-style teaser: fade + blur the last lines into the page background */}
                        {isLocked ? (
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background backdrop-blur-[2px]" />
                        ) : null}
                    </div>
                    {isLocked ? <PremiumPaywall /> : null}
                </div>
            )}
        </div>
    )
}
