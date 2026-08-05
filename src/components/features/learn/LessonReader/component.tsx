import React from "react"
import type {
    Key,
    ReactNode,
} from "react"
import {
    AdBanner,
} from "@/components/features/dashboard/AdBanner"
import type {
    ContentTabItem,
} from "./types"
import {
    ContentTabBar,
} from "./ContentTabBar"
import {
    ContentBodySkeleton,
} from "./ContentBodySkeleton"
import {
    ContentHeaderSkeleton,
} from "./ContentHeaderSkeleton"
import {
    ContentHeader,
} from "./ContentHeader"
import {
    ContentDiscussion,
} from "./ContentBody/ContentBodyV2/Discussion"
import {
    ContentReactionBar,
} from "./ContentBody/ContentBodyV2/Discussion/ContentReactionBar"
import {
    LessonPager,
} from "./LessonPager"
import {
    E2eResultButton,
} from "./E2eResultButton"
import {
    PremiumPaywall,
} from "./PremiumPaywall"
import { SelectionHintCallout } from "../ContentAiSelectionAsk/SelectionHintCallout"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { UpNextCard } from "@/components/blocks/learn/UpNextCard"
import type { TabsCardGroup } from "@/components/blocks/navigation/TabsCard"
import type { QueryActiveAdvertisementData } from "@/modules/api/graphql/queries/types/active-advertisement"
import type { ContentTab } from "@/redux/slices/tabs"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"

/** Already-resolved (i18n'd) data behind the mobile-only "practice this lesson" nudge. Omitted → the nudge never mounts. */
export interface LessonReaderChallengesUpNext {
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
export interface LessonReaderRelatedContent {
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

/** Props for {@link _LessonReader} — presentational; all data resolved, no fetch/store/i18n. */
export interface LessonReaderProps {
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
    bodyComponent: ReactNode
    /** Locked premium lesson: fades the body behind an inline paywall. */
    isLocked?: boolean
    /** Present → renders the mobile/tablet-only "practice this lesson" nudge. */
    challengesUpNext?: LessonReaderChallengesUpNext
    /** Present → renders the "may also want to read" list. */
    relatedContent?: LessonReaderRelatedContent
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
 * @param props - {@link LessonReaderProps}
 */
export const _LessonReader = ({
    isSkeleton = false,
    tabItems,
    selectedTabKey,
    tabListAriaLabel,
    onTabChange,
    rightTabs,
    isFullWidthTab,
    isCardlessReadingTab,
    bodyComponent,
    isLocked = false,
    challengesUpNext,
    relatedContent,
    hasE2e = false,
    inlineAd,
}: LessonReaderProps) => {
    // the reading region: sandbox/AI-lab (full width) → Challenges (capped, flat) →
    // everything else (capped, inside a "paper" card, with the locked teaser/paywall).
    const readingRegion = isFullWidthTab ? (
        // `relative` — a positioning scheme, which the frame tier deliberately
        // excludes (`_allowed-class-name.ts`); `Box` is the documented escape hatch.
        <Box className="relative w-full">
            {/* `id` scopes the "on this page" rail's heading scan; `data-ai-selectable`
                marks the region for "ask AI about this passage" — no frame/atom carries
                an arbitrary id + data-attribute pair, so this stays a plain anchor div. */}
            <div id="lesson-article" data-ai-selectable>
                {bodyComponent}
            </div>
        </Box>
    ) : isCardlessReadingTab ? (
        <Container
            size="md"
            padding={1}
            body={() => (
                <div id="lesson-article" data-ai-selectable>
                    {bodyComponent}
                </div>
            )}
        />
    ) : (
        <Container
            size="md"
            padding={1}
            body={() => (
                <SurfaceCard
                    body={() => (
                        <StackV
                            gap={5}
                            items={[
                                ...(!isLocked ? [() => <SelectionHintCallout />] : []),
                                () => (
                                    <Box className="relative">
                                        <div
                                            id="lesson-article"
                                            data-ai-selectable
                                            className={isLocked ? "select-none" : undefined}
                                        >
                                            {bodyComponent}
                                        </div>
                                        {/* Medium-style teaser: fade the tail of the body into the
                                            card surface behind the paywall — an absolute gradient,
                                            outside the frame tier's vocabulary on purpose. */}
                                        {isLocked ? (
                                            <Box
                                                aria-hidden
                                                className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface"
                                            />
                                        ) : null}
                                    </Box>
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
        // no step on the padding scale carries a BOTTOM-ONLY pad, so the closing
        // breathing room stays a `Box` escape hatch (missing vocabulary).
        <Box className="pb-6">
            <StackV
                gap={6}
                items={[
                    () => (
                        <Container
                            size="md"
                            padding={1}
                            body={() => <SurfaceCard body={() => <ContentReactionBar />} />}
                        />
                    ),
                    // MOBILE/TABLET-ONLY via CSS: on desktop the right rail's "Practice
                    // this lesson" already surfaces this, so `@app-lg:hidden` removes it
                    // above that width — a visibility switch no `classNames` vocabulary
                    // carries, so it stays a `Box` escape hatch.
                    ...(challengesUpNext ? [() => (
                        <Box className="@app-lg:hidden">
                            <Container
                                size="md"
                                padding={1}
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
                        </Box>
                    )] : []),
                    ...(relatedContent ? [() => (
                        <Container
                            size="md"
                            padding={1}
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
                        <Container size="md" padding={1} body={() => <ContentDiscussion />} />
                    ),
                    () => (
                        <Container size="md" padding={1} body={() => <LessonPager />} />
                    ),
                    ...(hasE2e ? [() => (
                        <Container size="md" padding={1} body={() => <E2eResultButton />} />
                    )] : []),
                ]}
            />
        </Box>
    )

    return (
        <StackV
            gap={6}
            identity={{ tier: "block", component: "LessonReader" }}
            items={[
                // 1. header — capped to the reading width; skeleton mirrors it while loading.
                () => (
                    <Container
                        size="md"
                        padding={1}
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
                        items={[
                            () => (isSkeleton ? (
                                <Container
                                    size="md"
                                    padding={1}
                                    body={() => (
                                        <SurfaceCard body={() => <ContentBodySkeleton variant="v2" />} />
                                    )}
                                />
                            ) : readingRegion),
                            ...(!isSkeleton && !isLocked && !isFullWidthTab ? [() => footer] : []),
                            ...(!isSkeleton && inlineAd && !isFullWidthTab ? [() => (
                                <Box className="pb-6">
                                    <Container size="md" padding={1} body={() => <AdBanner ad={inlineAd} />} />
                                </Box>
                            )] : []),
                        ]}
                    />
                ),
            ]}
        />
    )
}
