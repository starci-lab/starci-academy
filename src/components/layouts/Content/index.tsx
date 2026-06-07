"use client"

import React, {
    useCallback,
    useEffect,
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
    useParams,
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
} from "@/hooks"
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
    SandboxBody,
} from "./SandboxBody"
import {
    ContentTabBar,
} from "./ContentTabBar"
import {
    ContentHeader,
} from "./ContentHeader"
import {
    ContentBodySkeleton,
} from "./ContentBodySkeleton"
import {
    ContentHeaderSkeleton,
} from "./ContentHeaderSkeleton"
import {
    PremiumPaywall,
} from "./PremiumPaywall"
import {
    isSchemaV2HiddenContentTab,
} from "./constants"

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
    const params = useParams()
    const routeContentId = params.contentId as string | undefined
    const contentFromRedux = useAppSelector((state) => state.content.entity)
    const contentTab = useAppSelector((state) => state.tabs.contentTab)
    const queryContentSwr = useQueryContentSwr()
    /** Prefer Redux; fall back to SWR cache so returning to a lesson does not stick on skeleton. */
    const contentSnapshot = contentFromRedux ?? queryContentSwr.data
    /** Ignore stale entity rows left over after `contentId` changes until fetch/cache catches up. */
    const content =
        contentSnapshot?.id && routeContentId && contentSnapshot.id === routeContentId
            ? contentSnapshot
            : undefined
    useQueryContentStatusSwr()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { open: openPremiumGate } = usePremiumGateOverlayState()

    /**
     * Locked premium lesson ("trial read"): the backend returns a truncated body
     * with `isPremium=true` when the viewer is not entitled, so we fade the body
     * behind an inline paywall and gate the premium-only tabs (lesson/challenges)
     * behind the register modal.
     */
    const isLocked = content?.isPremium === true
    /** SCHEMA V2 (`verified`) — code lessons live in the markdown body; hide the Bài giảng tab. */
    const isSchemaV2 = Boolean(content?.verified)
    const isSandbox = Boolean(content?.isSandbox) && Boolean(content?.githubBaseUrl) && Boolean(content?.githubDir)

    /** Tab entries (key + label + body) rendered in the tab bar. */
    const tabItems = useMemo<Array<ContentTabItem>>(
        () => {
            const items: Array<ContentTabItem> = [
                {
                    key: ContentTab.Content,
                    label: t("content.tabs.content"),
                    component: <ContentBody />,
                },
            ]
            if (!isSchemaV2) {
                items.push({
                    key: ContentTab.CodeExplainings,
                    label: t("content.tabs.codeExplainings"),
                    component: <CodeLessonBody />,
                    locked: isLocked,
                })
            }
            if (isSandbox) {
                items.push({
                    key: ContentTab.Sandbox,
                    label: "Sandbox",
                    component: <SandboxBody />,
                })
            }
            items.push({
                key: ContentTab.Challenges,
                label: t("content.tabs.challenges"),
                component: <ChallengeBody />,
                locked: isLocked,
            })
            return items
        },
        [
            t,
            isLocked,
            isSchemaV2,
            isSandbox,
        ],
    )

    /** Drop legacy code-lesson tab when switching to SCHEMA V2 content. */
    useEffect(
        () => {
            if (!isSchemaV2 || !isSchemaV2HiddenContentTab(contentTab)) {
                return
            }
            dispatch(setContentTab(ContentTab.Content))
            const params = new URLSearchParams(searchParams.toString())
            params.set("tab", ContentTab.Content)
            router.replace(`${pathname}?${params.toString()}`)
        },
        [
            contentTab,
            dispatch,
            isSchemaV2,
            pathname,
            router,
            searchParams,
        ],
    )

    /** Tab key shown in the bar (falls back when V2 hides the code-lesson tab). */
    const selectedTabKey = useMemo(
        () => tabItems.some((item) => item.key === contentTab)
            ? contentTab
            : ContentTab.Content,
        [
            contentTab,
            tabItems,
        ],
    )

    /** Body of the currently selected tab. */
    const bodyComponent = useMemo(
        () => tabItems.find((item) => item.key === selectedTabKey)?.component,
        [
            selectedTabKey,
            tabItems,
        ],
    )

    const isLoading = queryContentSwr.isLoading && !content
    const bodySkeletonVariant =
        content?.verified
            ? "v2"
            : content && !content.verified
                ? "legacy"
                : isLoading && selectedTabKey === ContentTab.Content
                    ? "v2"
                    : "legacy"
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
                        selectedKey={selectedTabKey}
                        ariaLabel={t("module.tabListAria")}
                        onSelectionChange={onTabChange}
                    />
                    <div className="mx-auto w-full max-w-[1024px] p-3">
                        <ContentBodySkeleton variant={bodySkeletonVariant} />
                    </div>
                </div>
            ) : (
                <div>
                    {/* header capped to the reading width; only the tab bar below spans full width */}
                    <div className="mx-auto w-full max-w-[1024px]">
                        <ContentHeader />
                    </div>
                    <ContentTabBar
                        tabItems={tabItems}
                        selectedKey={selectedTabKey}
                        ariaLabel={t("module.tabListAria")}
                        onSelectionChange={onTabChange}
                    />
                    {/* article body capped for readable line length; the sandbox spans full width */}
                    <div
                        className={cn(
                            "relative w-full",
                            selectedTabKey !== ContentTab.Sandbox && "mx-auto max-w-[1024px]",
                        )}
                    >
                        <div className={cn(selectedTabKey !== ContentTab.Sandbox && "p-3", isLocked && "select-none")}>
                            {bodyComponent}
                        </div>
                        {/* Medium-style teaser: a tall, smooth gradient fades the tail of the body
                            into the page background (no blur — pure opacity fade like Medium). */}
                        {isLocked ? (
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-background/70 to-background" />
                        ) : null}
                    </div>
                    {/* paywall sits directly under the faded teaser */}
                    {isLocked ? <PremiumPaywall /> : null}
                </div>
            )}
        </div>
    )
}
