import React from "react"
import { StackIcon } from "@phosphor-icons/react"
import { ModuleHeader, CourseContentTier, type ModuleHeaderCrumb } from "@sb-components/starci/blocks/learn/ModuleHeader/ModuleHeader"
import { ModuleContinueBand } from "@sb-components/starci/blocks/learn/ModuleContinueBand/ModuleContinueBand"
import { ModuleLessonList, type ModuleLessonListLesson } from "@sb-components/starci/blocks/learn/ModuleLessonList/ModuleLessonList"
import { ModuleChallengeList, type ModuleChallengeItem } from "@sb-components/starci/blocks/learn/ModuleChallengeList/ModuleChallengeList"
import { ContentPaywall } from "@sb-components/starci/blocks/learn/ContentPaywall/ContentPaywall"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ModulePage` — one module's own page: orient, resume, then browse everything it
 * contains. It composes blocks in frames and hands each typed data, drawing no shape
 * of its own.
 *
 * Five functions: `ModuleHeader` (what this module is, its tier, its size);
 * `ContentPaywall` (reused, only while `isLocked`); `ModuleContinueBand` (resume +
 * completion); `ModuleLessonList`; and `ModuleChallengeList` (only when the module has
 * challenges). The paywall replaces functions 3–5 rather than sitting above them — a
 * locked learner has one decision, nothing competing with it.
 */

/** Props for {@link ModulePage}. */
export interface ModulePageProps {
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

    // ── whole-screen states ──────────────────────────────────────────────────
    /**
     * `true` → every block that can mirror itself does. The flag flows straight
     * down (§12c) — the screen builds no shimmer tree of its own.
     */
    isSkeleton?: boolean
    /** `true` → the module has no lessons yet; `AsyncContentEmpty` replaces the ENTIRE spine. */
    isEmpty?: boolean
}

/**
 * Empty state — the module has no lessons yet.
 *
 * The frame and the content each carry THEIR OWN name: the wrapping `Container`
 * badges itself, the `AsyncContentEmpty` inside badges itself too, so neither
 * vanishes from the anatomy tree wearing the other's name.
 */
const ModulePageEmpty = () => (
    <Container

        size="md"
        padding={6}
        body={
            <AsyncContentEmpty

                icon={StackIcon}
                title="This module has no lessons yet"
                description="Content is still being written — check back later."
            />
        }
    />
)

/**
 * A module's own page. See the file header for the full function list and the
 * paywall's replace-not-stack behaviour.
 *
 * @param props - {@link ModulePageProps}
 */
const ModulePage = ({
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
    isSkeleton = false,
    isEmpty = false,
}: ModulePageProps) => {
    if (isEmpty) {
        return <ModulePageEmpty />
    }

    const moduleContent = (
        <>
            <ModuleContinueBand

                resumeLessonTitle={resumeLessonTitle}
                lessonsRead={lessonsRead}
                lessonsTotal={lessonsTotal}
                challengesDone={challengesDone}
                challengesTotal={challengesTotal}
                onResume={onResume}
                isSkeleton={isSkeleton}

            />
            <ModuleLessonList

                lessons={lessons}
                resumeLessonId={resumeLessonId}
                onSelectLesson={onSelectLesson}
                isSkeleton={isSkeleton}

            />
            {/* A count of zero is not news (`ModuleHeader`/`ContentModeNav` idiom) —
            extended here to a whole block's presence: a module with no challenges
            yet does not earn an empty challenge list on its own page. */}
            {isSkeleton || challenges.length > 0 ? (
                <ModuleChallengeList

                    challenges={challenges}
                    onSelectChallenge={onSelectChallenge}
                    isSkeleton={isSkeleton}

                />
            ) : null}
        </>
    )

    const moduleSections = (
        <>
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
            {isLocked ? (
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
                <StackV gap={6} isSkeleton={isSkeleton} items={[() => moduleContent]} />
            )}
        </>
    )

    const moduleBody = <StackV gap={7} isSkeleton={isSkeleton} items={[() => moduleSections]} />

    return <Container size="md" padding={6} body={moduleBody} />
}

export { ModulePage }
