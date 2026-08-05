"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    type Key,
} from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import type {
    ContentTabItem,
} from "@/components/blocks/learn/lesson/types"
import {
    ContentBody,
} from "@/components/blocks/learn/lesson/ContentBody"
import {
    ChallengeBody,
} from "@/components/blocks/learn/lesson/ChallengeBody"
import {
    SandboxBody,
} from "@/components/blocks/learn/lesson/SandboxBody"
import {
    AiLab,
} from "@/components/blocks/learn/lesson/AiLab"
import {
    _ContentPage,
} from "./component"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { DEFAULT_PROGRAMMING_LANGUAGES, isProgrammingLangAvailable, resolveActiveProgrammingLang } from "@/modules/types/utils/programming-language"
import { listContentBodyLangs } from "@/modules/types/entities/content-body"
import { programmingLanguageIconMap } from "@/components/blocks/navigation/ProgrammingLanguageTabs/map"
import type { TabsCardGroup } from "@/components/blocks/navigation/TabsCard"
import { useQueryContentSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentSwr"
import { useQueryContentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentStatusSwr"
import { usePremiumGateOverlayState, useAdModalOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryActiveAdvertisementSwr } from "@/hooks/swr/api/graphql/queries/useQueryActiveAdvertisementSwr"
import { useQueryAiLabPlaygroundSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiLabPlaygroundSwr"
import { AdvertisementPlacement } from "@/modules/api/graphql/queries/types/active-advertisement"
import { ContentTab, setContentTab } from "@/redux/slices/tabs"
import { setContentSelectedProgrammingLang } from "@/redux/slices/content"

/**
 * Learn content page layout for `/modules/[moduleId]/contents/[contentId]` — the
 * CONNECTED half: owns data (content + status SWR, redux snapshot, the AI-lab
 * playground, the interstitial/inline ad queries) and tab navigation, resolves
 * every label via `t()`, then hands the resolved shape to the presentational
 * {@link _ContentPage}. See `tiers/split.md`.
 *
 * The only caller (`app/.../[contentId]/page.tsx`) renders `<LessonReader />`
 * with no props — this root takes none of its own (BLOCK-4: no `className`
 * escape hatch).
 */
export const ContentPage = () => {
    const t = useTranslations()
    const params = useParams()
    const routeContentId = params.contentId as string | undefined
    const contentFromRedux = useAppSelector((state) => state.content.entity)
    const course = useAppSelector((state) => state.course.entity)
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
    /** AI Lab playground bound to this lesson, if any (drives the AI Lab tab). */
    const playgroundSwr = useQueryAiLabPlaygroundSwr(content?.id)
    const playground = playgroundSwr.data
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { open: openPremiumGate } = usePremiumGateOverlayState()
    const courseId = params.courseId as string | undefined

    // interstitial ad for the lesson — null server-side for members / viewers
    // already enrolled in this course, so a non-null result means "show it"
    const { data: interstitialAd } = useQueryActiveAdvertisementSwr({
        placement: AdvertisementPlacement.LessonInterstitial,
        courseId,
    })
    // inline banner at the foot of the lesson (same exemptions applied server-side)
    const { data: inlineAd } = useQueryActiveAdvertisementSwr({
        placement: AdvertisementPlacement.LessonInline,
        courseId,
    })
    const { open: openAdModal } = useAdModalOverlayState()
    /** Lesson id the interstitial already popped for — pop once per lesson open. */
    const adShownForRef = useRef<string | null>(null)

    // pop the interstitial immediately when a lesson opens (once per lesson)
    useEffect(
        () => {
            if (interstitialAd && content?.id && adShownForRef.current !== content.id) {
                adShownForRef.current = content.id
                openAdModal(interstitialAd)
            }
        },
        [
            interstitialAd,
            content?.id,
            openAdModal,
        ],
    )

    /**
     * Locked premium lesson ("trial read"): the backend returns a truncated body
     * with `isPremium=true` when the viewer is not entitled, so we fade the body
     * behind an inline paywall and gate the premium-only tabs (lesson/challenges)
     * behind the register modal.
     */
    const isLocked = content?.isPremium === true
    const isSandbox = Boolean(content?.isSandbox) && Boolean(content?.githubBaseUrl) && Boolean(content?.githubDir)
    const hasE2e = Array.isArray(content?.e2eFlows) && content.e2eFlows.length > 0

    /** Tab entries (key + label + body) rendered in the tab bar. */
    const tabItems = useMemo<Array<ContentTabItem>>(
        () => {
            const items: Array<ContentTabItem> = [
                {
                    key: ContentTab.Content,
                    label: t("content.tabs.content"),
                    body: ContentBody,
                },
            ]
            if (isSandbox) {
                items.push({
                    key: ContentTab.Sandbox,
                    label: t("content.tabs.sandbox"),
                    body: SandboxBody,
                })
            }
            items.push({
                key: ContentTab.Challenges,
                label: t("content.tabs.challenges"),
                body: ChallengeBody,
                locked: isLocked,
            })
            if (playground) {
                items.push({
                    key: ContentTab.AILab,
                    label: t("aiLab.tabs.aiLab"),
                    body: AiLab,
                })
            }
            return items
        },
        [
            t,
            isLocked,
            isSandbox,
            playground,
        ],
    )

    /** Tab key shown in the bar (falls back to Content for an unknown `?tab=`). */
    const selectedTabKey = useMemo(
        () => tabItems.some((item) => item.key === contentTab)
            ? contentTab
            : ContentTab.Content,
        [
            contentTab,
            tabItems,
        ],
    )

    /** Tabs that span the full page width (no reading-width cap / article padding). */
    const isFullWidthTab =
        selectedTabKey === ContentTab.Sandbox || selectedTabKey === ContentTab.AILab

    /**
     * Tabs that keep the centered reading width but render flat on the canvas (no
     * "paper" reading card). The Challenges tab is already a list of bordered cards,
     * so wrapping it in the reading card would be a redundant card-in-card.
     */
    const isCardlessReadingTab = selectedTabKey === ContentTab.Challenges

    /** Body of the currently selected tab. */
    const bodyComponent = useMemo(
        () => tabItems.find((item) => item.key === selectedTabKey)?.body ?? ContentBody,
        [
            selectedTabKey,
            tabItems,
        ],
    )

    // Per-language switcher (SCHEMA V2 bodies): hoisted into the tab toolbar so the
    // reader keeps a single nav layer. Shown only on the Content tab and only when the
    // lesson actually ships more than one language.
    const langs = useMemo(
        () => listContentBodyLangs(content?.bodies),
        [content?.bodies],
    )
    const selectedLang = useAppSelector((state) => state.content.selectedProgrammingLang)
    const activeLang = useMemo(
        () => resolveActiveProgrammingLang(selectedLang, langs),
        [selectedLang, langs],
    )
    const onSelectLang = useCallback(
        (lang: string) => dispatch(setContentSelectedProgrammingLang(lang)),
        [dispatch],
    )
    /** Right-side language tab group for the toolbar (Content tab + multi-lang only). */
    const languageTabs = useMemo<TabsCardGroup | undefined>(
        () => {
            if (selectedTabKey !== ContentTab.Content || langs.length <= 1) {
                return undefined
            }
            return {
                ariaLabel: t("content.language"),
                selectedKey: activeLang,
                onSelectionChange: (key) => onSelectLang(String(key)),
                items: DEFAULT_PROGRAMMING_LANGUAGES.map((lang) => {
                    const Icon = programmingLanguageIconMap[lang]
                    return {
                        key: lang,
                        label: t(`programmingLanguage.${lang}`),
                        icon: <Icon aria-hidden className="size-4 shrink-0" />,
                        isDisabled: !isProgrammingLangAvailable(lang, langs),
                    }
                }),
            }
        },
        [selectedTabKey, langs, activeLang, onSelectLang, t],
    )

    // first load, nothing in hand → shimmer (loading-and-skeleton.md)
    const isSkeleton = queryContentSwr.isLoading && !content
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

    // mobile/tablet-only "practice this lesson" nudge — only on the Content tab,
    // only once the lesson actually has challenges; no "already read" claim.
    const challengesUpNext = selectedTabKey === ContentTab.Content && (content?.challenges?.length ?? 0) > 0
        ? {
            eyebrow: t("content.upNext.eyebrow"),
            title: t("content.upNext.challengesTitle", {
                count: content?.challenges?.length ?? 0,
            }),
            description: t("content.upNext.challengesDesc"),
            ctaLabel: t("content.upNext.challengesCta"),
            onPress: () => onTabChange(ContentTab.Challenges),
        }
        : undefined

    // quiet, self-hiding "may also want to read" — course-wide RAG search
    // auto-queried on THIS lesson's own title (no typing).
    const relatedContent = course?.id && course.displayId && content?.title
        ? {
            courseId: course.id,
            courseDisplayId: course.displayId,
            query: content.title,
            excludeId: content.id,
            label: t("content.relatedContent.label"),
        }
        : undefined

    return (
        <_ContentPage
            isSkeleton={isSkeleton}
            tabItems={tabItems}
            selectedTabKey={selectedTabKey}
            tabListAriaLabel={t("module.tabListAria")}
            onTabChange={onTabChange}
            rightTabs={languageTabs}
            isFullWidthTab={isFullWidthTab}
            isCardlessReadingTab={isCardlessReadingTab}
            bodyComponent={bodyComponent}
            isLocked={isLocked}
            challengesUpNext={challengesUpNext}
            relatedContent={relatedContent}
            hasE2e={hasE2e}
            inlineAd={inlineAd}
        />
    )
}
