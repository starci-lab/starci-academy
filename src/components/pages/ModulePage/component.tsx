import React from "react"
import { StackIcon } from "@phosphor-icons/react"
import { ModuleHeader, type ModuleHeaderCrumb } from "@/components/starci/blocks/learn/ModuleHeader"
import { ModuleContinueBand } from "@/components/starci/blocks/learn/ModuleContinueBand"
import { ModuleLessonList, type ModuleLessonListLesson } from "@/components/starci/blocks/learn/ModuleLessonList"
import { ModuleChallengeList, type ModuleChallengeItem } from "@/components/starci/blocks/learn/ModuleChallengeList"
import { ContentPaywall } from "@/components/starci/blocks/learn/ContentPaywall"
import type { PricingPhase } from "@/components/starci/blocks/commerce/PhaseScarcityNote"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import type { CourseContentTier } from "@/modules/types/enums/course-content-tier"
import type { CallerIdentity } from "@/components/frames/_identity"

/** This page's own identity — handed to whichever frame is standing in as its root (`_identity.ts`). */
const PAGE_IDENTITY: CallerIdentity = { tier: "page", component: "ModulePage" }

/**
 * `_ModulePage` — the SRC TWIN of `.storybook/components/starci/pages/
 * ModulePage/ModulePage.tsx`. Presentational: typed props, already resolved;
 * no fetch/store/i18n (that's the connected half, `./index.tsx`).
 *
 * A screen owns a list of functions: it calls blocks, places them in frames,
 * and hands each typed data. Five functions in reading order — orient
 * (`ModuleHeader`) · gate (`ContentPaywall`, reused from the lesson reader) ·
 * resume + completion (`ModuleContinueBand`) · browse lessons
 * (`ModuleLessonList`) · browse challenges (`ModuleChallengeList`). The
 * paywall REPLACES browsing rather than sitting above it. The challenge list
 * is a screen-owned structural switch: a module with no challenges yet does
 * not earn an empty challenge list on its own page.
 *
 * On top of the pure blueprint composition, this presentational file also
 * carries the real async lifecycle (error → skeleton → empty → content) —
 * the same extension `_CourseContents` already makes, since a static
 * storybook blueprint has no fetch to fail but a real page does.
 */

/** Props for {@link _ModulePage}. */
export interface ModulePageProps {
    // ── async lifecycle — owned by the connected file, not the blueprint ────
    /** `true` while the module/outline fetch is running (no cache yet). */
    isLoading?: boolean
    /** Set once loading finishes with no result → the error branch. */
    error?: unknown
    /** Retry the failed fetch. */
    onRetry?: () => void
    /** `true` (after loading) → the module has no lessons yet. */
    isEmpty?: boolean
    /** Empty-state title. */
    emptyTitle: string
    /** Error-state title. */
    errorTitle: string
    /** Error-state retry button label. */
    retryLabel: string

    // ── 1. orient — `ModuleHeader` ──────────────────────────────────────────
    /** Breadcrumb trail as data — a module is always reached through its course. */
    breadcrumbItems: Array<ModuleHeaderCrumb>
    /** Module title. */
    title: string
    /** One-sentence summary of the module. */
    description?: string
    /** Learning tier of the module. */
    tier?: CourseContentTier
    /** How many lessons the module has, in total. */
    lessonCount?: number
    /** Total reading/study minutes across the module. */
    minutesTotal?: number
    /** How many challenges hang off the module, in total. */
    challengeCount?: number

    // ── whole-screen gate ────────────────────────────────────────────────────
    /** `true` → the learner has not bought the course; the gate replaces browsing. */
    isLocked?: boolean

    // ── 2. gate — `ContentPaywall` (only while `isLocked`) ──────────────────
    /** Paywall headline. */
    paywallTitle?: string
    /** Paywall one-sentence description of what buying unlocks. */
    paywallDescription?: string
    /** Price after discount, in VND. */
    discountedPriceVnd?: number
    /** Price before discount, for the struck-through original. */
    originalPriceVnd?: number | null
    /** Which pricing phase the course is in — drives the scarcity line. */
    currentPhase?: PricingPhase
    /** Seats left in the current phase. `null` → the phase is not capped. */
    seatsRemaining?: number | null
    /** What the next phase will cost. */
    nextPhasePriceVnd?: number | null
    /** Label of the paywall's single call to action. */
    paywallCtaLabel?: string
    /** Fired when the learner takes the paywall offer. */
    onPurchase?: () => void

    // ── 3. resume + completion — `ModuleContinueBand` ───────────────────────
    /** Title of the next unread lesson. `undefined` → every lesson is already read. */
    resumeLessonTitle?: string
    /** Lessons already read / total lessons in the module. */
    lessonsRead?: number
    lessonsTotal?: number
    /** Challenges already completed / total challenges in the module. */
    challengesDone?: number
    challengesTotal?: number
    /** Press "Continue learning". */
    onResume?: () => void

    // ── 4. browse lessons — `ModuleLessonList` ──────────────────────────────
    /** Every lesson in the module, in reading order. */
    lessons: Array<ModuleLessonListLesson>
    /** The lesson to mark "resume" on the list. */
    resumeLessonId?: string
    /** Fired with the lesson id on any row press, premium or not. */
    onSelectLesson: (id: string) => void

    // ── 5. browse challenges — `ModuleChallengeList` ────────────────────────
    /** Every challenge across this module's lessons, flattened. Empty → the block does not render at all. */
    challenges: Array<ModuleChallengeItem>
    /** Fired with the owning lesson's id. */
    onSelectChallenge: (lessonId: string) => void
}

/**
 * A module's own page. See the file header for the full function list and the
 * paywall's replace-not-stack behaviour.
 *
 * @param props - {@link ModulePageProps}
 */
export const _ModulePage = ({
    isLoading = false,
    error,
    onRetry,
    isEmpty = false,
    emptyTitle,
    errorTitle,
    retryLabel,
    breadcrumbItems,
    title,
    description,
    tier,
    lessonCount,
    minutesTotal,
    challengeCount,
    isLocked = false,
    paywallTitle,
    paywallDescription,
    discountedPriceVnd,
    originalPriceVnd,
    currentPhase,
    seatsRemaining,
    nextPhasePriceVnd,
    paywallCtaLabel,
    onPurchase,
    resumeLessonTitle,
    lessonsRead = 0,
    lessonsTotal = 0,
    challengesDone = 0,
    challengesTotal = 0,
    onResume,
    lessons,
    resumeLessonId,
    onSelectLesson,
    challenges,
    onSelectChallenge,
}: ModulePageProps) => {
    // ONE tree — the resting state is this SAME spine with `isSkeleton` threaded into every
    // shimmer-capable block, never a hand-mirrored copy (mirrors `_CourseContents`).
    const spine = (isSkeleton: boolean) => (
        <Container
            size="md"
            padding={6}
            identity={PAGE_IDENTITY}
            body={() => (
                <StackV
                    gap={7}
                    items={[
                        () => (
                            <ModuleHeader
                                breadcrumbItems={breadcrumbItems}
                                title={title}
                                description={description}
                                tier={tier}
                                lessonCount={lessonCount}
                                minutesTotal={minutesTotal}
                                challengeCount={challengeCount}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (isLocked ? (
                            <ContentPaywall
                                title={paywallTitle ?? ""}
                                description={paywallDescription}
                                discountedPriceVnd={discountedPriceVnd ?? 0}
                                originalPriceVnd={originalPriceVnd}
                                currentPhase={currentPhase}
                                seatsRemaining={seatsRemaining}
                                nextPhasePriceVnd={nextPhasePriceVnd}
                                ctaLabel={paywallCtaLabel ?? ""}
                                onPurchase={onPurchase ?? (() => {})}
                                isSkeleton={isSkeleton}
                            />
                        ) : (
                            <StackV
                                gap={6}
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <ModuleContinueBand
                                            resumeLessonTitle={resumeLessonTitle}
                                            lessonsRead={lessonsRead}
                                            lessonsTotal={lessonsTotal}
                                            challengesDone={challengesDone}
                                            challengesTotal={challengesTotal}
                                            onResume={onResume}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                    () => (
                                        <ModuleLessonList
                                            lessons={lessons}
                                            resumeLessonId={resumeLessonId}
                                            onSelectLesson={onSelectLesson}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                    // A count of zero is not news (`ModuleHeader`/`ContentModeNav` idiom) —
                                    // extended here to a whole block's presence: a module with no challenges
                                    // yet does not earn an empty challenge list on its own page.
                                    ...((isSkeleton || challenges.length > 0) ? [() => (
                                        <ModuleChallengeList
                                            challenges={challenges}
                                            onSelectChallenge={onSelectChallenge}
                                            isSkeleton={isSkeleton}
                                        />
                                    )] : []),
                                ]}
                            />
                        )),
                    ]}
                />
            )}
        />
    )

    // error → skeleton → empty → content (BLOCK-8): the empty and error surfaces are the shared
    // `AsyncContent*` frames dropped in as their own states; otherwise the ONE spine renders, with
    // `isLoading` flowing in as the co-located shimmer flag (loading-and-skeleton.md §6).
    const inner = error
        ? <AsyncContentError title={errorTitle} onRetry={onRetry} retryLabel={retryLabel} />
        : (!isLoading && isEmpty)
            ? <AsyncContentEmpty title={emptyTitle} icon={StackIcon} />
            : spine(isLoading)

    return inner
}
