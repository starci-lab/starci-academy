import React from "react"
import type {
    ComponentType,
    Key,
} from "react"
import {
    AdBanner,
} from "@/components/blocks/marketing/AdBanner"
import type {
    ContentTabItem,
} from "@/components/blocks/learn/lesson/types"
import {
    ContentTabBar,
} from "@/components/blocks/learn/lesson/ContentTabBar"
import {
    ContentBodySkeleton,
} from "@/components/blocks/learn/lesson/ContentBodySkeleton"
import {
    ContentHeaderSkeleton,
} from "@/components/blocks/learn/lesson/ContentHeaderSkeleton"
import {
    ContentHeader,
} from "@/components/blocks/learn/lesson/ContentHeader"
import {
    ContentDiscussion,
} from "@/components/blocks/learn/lesson/ContentBody/ContentBodyV2/Discussion"
import {
    ContentReactionBar,
} from "@/components/blocks/learn/lesson/ContentBody/ContentBodyV2/Discussion/ContentReactionBar"
import {
    LessonPager,
} from "@/components/blocks/learn/lesson/LessonPager"
import {
    E2eResultButton,
} from "@/components/blocks/learn/lesson/E2eResultButton"
import {
    PremiumPaywall,
} from "@/components/blocks/learn/lesson/PremiumPaywall"
import { SelectionHintCallout } from "@/components/blocks/learn/ContentAiSelectionAsk/SelectionHintCallout"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { UpNextCard } from "@/components/blocks/learn/UpNextCard"
import type { TabsCardGroup } from "@/components/blocks/navigation/TabsCard"
import type { QueryActiveAdvertisementData } from "@/modules/api/graphql/queries/types/active-advertisement"
import type { ContentTab } from "@/redux/slices/tabs"
import { Container } from "@/components/frames/Container"
import { HideAbove } from "@/components/frames/HideAbove"
import { PageEndPad } from "@/components/frames/PageEndPad"
import { StackV } from "@/components/frames/Stack"
import { LockedContentMask } from "@/components/composites/layout/LockedContentMask"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"

/** Already-resolved (i18n'd) data behind the mobile-only "practice this lesson" nudge. Omitted → the nudge never mounts. */
export interface ContentPageChallengesUpNext {
    /** Small label above the title. */
    eyebrow: string
    /** Nudge title (already interpolated with the challenge count). */
    title: string
    /** One line describing the nudge. */
    description: string
    /** CTA label. */
    ctaLabel: string
    /** Switches the reader into the Challenges tab. */
    onPress: () => void
}

/** Data behind the "may also want to read" list. Omitted → the block never mounts. */
export interface ContentPageRelatedContent {
    /** Course to search within (RAG query scope). */
    courseId: string
    /** The course's `displayId` (slug), needed to build result URLs. */
    courseDisplayId: string
    /** Query the search runs against — this lesson's own title. */
    query: string
    /** This lesson's own id, filtered out of the results. */
    excludeId?: string
    /** Already-translated section label. */
    label: string
}

/** Props for {@link _ContentPage} — presentational; all data resolved, no fetch/store/i18n. */
export interface ContentPageProps {
    /**
     * First load, nothing cached yet → the header and the reading body render their
     * skeleton mirrors. The tab bar itself is NEVER skeleton-ised (static chrome,
     * shows immediately) — see the render below.
     */
    isSkeleton?: boolean
    /** Tab entries (already resolved: translated label, locked flag, connected body). */
    tabItems: Array<ContentTabItem>
    /** Currently selected tab key. */
    selectedTabKey: ContentTab
    /** Accessible name for the tab list. */
    tabListAriaLabel: string
    /** Fired with the newly selected tab key. */
    onTabChange: (key: Key) => void
    /** Optional right-aligned tab group on the same row (the programming-language switcher). */
    rightTabs?: TabsCardGroup
    /** Sandbox / AI Lab: no reading-width cap, no "paper" card. */
    isFullWidthTab: boolean
    /** Challenges: keeps the reading width but renders flat (already a list of cards). */
    isCardlessReadingTab: boolean
    /** The active tab's own body — a connected child that fetches its own data. */
    bodyComponent: ComponentType
    /** Locked premium lesson: fades the body behind an inline paywall. */
    isLocked?: boolean
    /** Present → renders the mobile/tablet-only "practice this lesson" nudge. */
    challengesUpNext?: ContentPageChallengesUpNext
    /** Present → renders the "may also want to read" list. */
    relatedContent?: ContentPageRelatedContent
    /** `true` → this lesson has recorded E2E flows; shows the quiet results link. */
    hasE2e?: boolean
    /** Present (and not a full-width tab) → the inline house/sponsor banner at the foot. */
    inlineAd?: QueryActiveAdvertisementData | null
}

/**
 * Learn content page layout for `/modules/[moduleId]/contents/[contentId]` — the
 * presentational half of {@link import("./index").LessonReader}. See `tiers/split.md`.
 *
 * Composes the header (tier 2, capped to the reading width) + the tab bar (real
 * chrome, never skeleton-ised) + the active tab's body (tier 3): sandbox/AI-lab
 * span full width, Challenges keeps the reading width but sits flat, everything
 * else reads inside a centered "paper" card. Below the reading region, an
 * OPTIONAL footer — reaction, mobile "up next", related reading, discussion, the
 * prev/next pager, the quiet E2E-results link — is rendered as a set of SIBLINGS
 * with no separating seam of its own (the last item's own trailing space closes
 * it), hidden on a locked lesson or a full-width tab. An inline ad closes the
 * page when the caller hands one in.
 *
 * @param props - {@link ContentPageProps}
 */
export const _ContentPage = ({
    isSkeleton = false,
    tabItems,
    selectedTabKey,
    tabListAriaLabel,
    onTabChange,
    rightTabs,
    isFullWidthTab,
    isCardlessReadingTab,
    bodyComponent: Body,
    isLocked = false,
    challengesUpNext,
    relatedContent,
    hasE2e = false,
    inlineAd,
}: ContentPageProps) => {
    // the reading region: sandbox/AI-lab (full width) → Challenges (capped, flat) →
    // everything else (capped, inside a "paper" card, with the locked teaser/paywall).
    const readingRegion = isFullWidthTab ? (
        <Container
            size="full"
            padding={1}
            principle="center-measure"
            explain="Centers the lesson reading region on its measure — not page-pad, because this caps measure rather than padding a page region."
            body={() => (
                // `id` scopes the "on this page" rail's heading scan; `data-ai-selectable`
                // marks the region for "ask AI about this passage" — no frame/atom carries
                // an arbitrary id + data-attribute pair, so this stays a plain anchor div.
                <div id="lesson-article" data-ai-selectable>
                    <Body />
                </div>
            )}
        />
    ) : isCardlessReadingTab ? (
        <Container
            size="md"
            padding={1}
            principle="center-measure"
            explain="Centers the lesson reading region on its measure — not page-pad, because this caps measure rather than padding a page region."
            body={() => (
                <div id="lesson-article" data-ai-selectable>
                    <Body />
                </div>
            )}
        />
    ) : (
        <Container
            size="md"
            padding={1}
            principle="center-measure"
            explain="Centers the lesson reading region on its measure — not page-pad, because this caps measure rather than padding a page region."
            body={() => (
                <SurfaceCard
                    body={() => (
                        <StackV
                            gap={5}
                            principle="group-boundary"
                            explain="Nested section group spacing — not block-boundary, because this groups related surfaces inside one card rather than major page blocks."
                            items={[
                                ...(!isLocked ? [() => <SelectionHintCallout />] : []),
                                () => (
                                    <LockedContentMask
                                        isLocked={isLocked}
                                        body={() => (
                                            <div id="lesson-article" data-ai-selectable>
                                                <Body />
                                            </div>
                                        )}
                                    />
                                ),
                                ...(isLocked ? [() => <PremiumPaywall />] : []),
                            ]}
                        />
                    )}
                />
            )}
        />
    )

    // footer — reaction, mobile up-next, related reading, discussion, pager, E2E link.
    const footer = (
        <PageEndPad
            body={() => (
                <StackV
                    gap={6}
                    principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    items={[
                        () => (
                            <Container
                                size="md"
                                padding={1}
                                principle="center-measure"
                                explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                                body={() => <SurfaceCard body={() => <ContentReactionBar />} />}
                            />
                        ),
                        // MOBILE/TABLET-ONLY via HideAbove: on desktop the right rail's
                        // "Practice this lesson" already surfaces this, so `at="lg"` removes
                        // it above that width — a visibility switch, not a spacing principle.
                        ...(challengesUpNext ? [() => (
                            <HideAbove
                                at="lg"
                                body={() => (
                                    <Container
                                        size="md"
                                        padding={1}
                                        principle="center-measure"
                                        explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                                        body={() => (
                                            <UpNextCard
                                                showCheck
                                                eyebrow={challengesUpNext.eyebrow}
                                                title={challengesUpNext.title}
                                                description={challengesUpNext.description}
                                                ctaLabel={challengesUpNext.ctaLabel}
                                                onPress={challengesUpNext.onPress}
                                            />
                                        )}
                                    />
                                )}
                            />
                        )] : []),
                        ...(relatedContent ? [() => (
                            <Container
                                size="md"
                                padding={1}
                                principle="center-measure"
                                explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                                body={() => (
                                    <RelatedContentList
                                        courseId={relatedContent.courseId}
                                        courseDisplayId={relatedContent.courseDisplayId}
                                        query={relatedContent.query}
                                        excludeId={relatedContent.excludeId}
                                        label={relatedContent.label}
                                    />
                                )}
                            />
                        )] : []),
                        () => (
                            <Container
                                size="md"
                                padding={1}
                                principle="center-measure"
                                explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                                body={() => <ContentDiscussion />}
                            />
                        ),
                        () => (
                            <Container
                                size="md"
                                padding={1}
                                principle="center-measure"
                                explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                                body={() => <LessonPager />}
                            />
                        ),
                        ...(hasE2e ? [() => (
                            <Container
                                size="md"
                                padding={1}
                                principle="center-measure"
                                explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                                body={() => <E2eResultButton />}
                            />
                        )] : []),
                    ]}
                />
            )}
        />
    )

    return (
        <StackV
            gap={6}
            principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            identity={{ tier: "block", component: "LessonReader" }}
            items={[
                // 1. header — capped to the reading width; skeleton mirrors it while loading.
                () => (
                    <Container
                        size="md"
                        padding={1}
                        principle="center-measure"
                        explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                        body={() => (isSkeleton ? <ContentHeaderSkeleton /> : <ContentHeader />)}
                    />
                ),
                // 2. REAL tab bar — static chrome, shows immediately (never skeleton-ised).
                () => (
                    <ContentTabBar
                        tabItems={tabItems}
                        selectedKey={selectedTabKey}
                        ariaLabel={tabListAriaLabel}
                        onSelectionChange={onTabChange}
                        rightTabs={rightTabs}
                    />
                ),
                // 3. body — skeleton mirrors the centered reading card while loading; the
                // footer/ad only ever render once real content is in hand (matches the
                // retired `AsyncContent`'s loading branch, which showed neither). Nested in
                // its OWN zero-gap track (`gap={1}` = `gap-0`) rather than a bare fragment —
                // a fragment would flatten into the outer track and pick up ITS `gap-6`
                // between the reading region, the footer and the ad, which the original
                // markup never had (they sat flush, each owning its own trailing space).
                () => (
                    <StackV
                        gap={1}
                        principle="name-handle"
                        explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                        items={[
                            () => (isSkeleton ? (
                                <Container
                                    size="md"
                                    padding={1}
                                    principle="center-measure"
                                    explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                                    body={() => (
                                        <SurfaceCard body={() => <ContentBodySkeleton variant="v2" />} />
                                    )}
                                />
                            ) : readingRegion),
                            ...(!isSkeleton && !isLocked && !isFullWidthTab ? [() => footer] : []),
                            ...(!isSkeleton && inlineAd && !isFullWidthTab ? [() => (
                                <PageEndPad
                                    body={() => (
                                        <Container
                                            size="md"
                                            padding={1}
                                            principle="center-measure"
                                            explain="Centers the lesson chrome on the reading measure — not page-pad, because this caps measure rather than padding a page region."
                                            body={() => <AdBanner ad={inlineAd} />}
                                        />
                                    )}
                                />
                            )] : []),
                        ]}
                    />
                ),
            ]}
        />
    )
}
