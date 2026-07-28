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
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `ModulePageScreen`: one module's own page — orient, resume, then
 * browse everything it contains.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide (§13, and the
 * `ContentScreen`/`CourseContents` precedent this file follows).
 *
 * FIVE FUNCTIONS, in the order the learner meets them:
 *   1. orient — `ModuleHeader` (what this module is, its tier, its size)
 *   2. gate — `ContentPaywall`, REUSED, only while `isLocked` (the module is
 *      behind the paid tier and nothing else on the page can be trusted yet)
 *   3. resume + completion — `ModuleContinueBand` (only once unlocked)
 *   4. browse lessons — `ModuleLessonList` (only once unlocked)
 *   5. browse challenges — `ModuleChallengeList`, only once unlocked AND the
 *      module actually has challenges — an empty challenge list is not a
 *      "no challenges yet" message worth a whole block, it is simply absent
 *      (the same "a count of zero is not news" idiom `ModuleHeader` and
 *      `ContentModeNav` already use, extended to a whole block's presence).
 *
 * ⭐ THE PAYWALL REPLACES FUNCTIONS 3–5, IT DOES NOT SIT ABOVE THEM. A learner
 * who has not bought the course has exactly one decision in front of them —
 * the same "one decision, nothing competing with it" reasoning `ContentScreen`
 * already applies to its own footer under `isLocked`. Showing a resume band or
 * a lesson list behind a paywall would either leak content or dangle controls
 * that go nowhere, so the whole browsing region is swapped out, not stacked
 * underneath.
 *
 * ⚠️ `ContentPaywall` is REUSED as-is from `starci/blocks/learn/ContentPaywall`
 * — same block the lesson reader falls back to. A module and a lesson stop at
 * the same wall for the same reason ("buy the course"), so the offer block is
 * one thing wearing two call sites, not two similar offers built twice.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ModulePageScreen}. */
export interface ModulePageScreenProps {
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
    /** Press "Tiếp tục học". */
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
    /** When on, each block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * Empty state — the module has no lessons yet.
 *
 * The frame and the content each carry THEIR OWN name (`CourseContents`'
 * precedent, 2026-07-27): the wrapping `Container` badges itself, the
 * `AsyncContentEmpty` inside badges itself too, so neither vanishes from the
 * anatomy tree wearing the other's name.
 */
const ModulePageScreenEmpty = () => (
    <Container anatPart="Container" size="md" padding="roomy">
        <AsyncContentEmpty
            anatPart="AsyncContentEmpty"
            icon={StackIcon}
            title="Chương này chưa có bài học nào"
            description="Nội dung đang được biên soạn — quay lại sau nhé."
        />
    </Container>
)

/**
 * A module's own page. See the file header for the full function list and the
 * paywall's replace-not-stack behaviour.
 *
 * @param props - {@link ModulePageScreenProps}
 */
const ModulePageScreen = ({
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
    showAnatomy = false,
}: ModulePageScreenProps) => {
    if (isEmpty) {
        return <ModulePageScreenEmpty />
    }

    return (
        <Container size="md" padding="roomy" anatPart={showAnatomy ? "Container" : undefined}>
            <StackV gap="page" anatPart={showAnatomy ? "StackV" : undefined}>
                <ModuleHeader
                    anatPart="ModuleHeader"
                    breadcrumbItems={breadcrumbItems}
                    title={title}
                    description={description}
                    tier={tier}
                    lessonCount={lessonCount}
                    minutesTotal={minutesTotal}
                    challengeCount={challengeCount}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
                {isLocked ? (
                    <ContentPaywall
                        anatPart="ContentPaywall"
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
                        showAnatomy={showAnatomy}
                    />
                ) : (
                    <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                        <ModuleContinueBand
                            anatPart="ModuleContinueBand"
                            resumeLessonTitle={resumeLessonTitle}
                            lessonsRead={lessonsRead}
                            lessonsTotal={lessonsTotal}
                            challengesDone={challengesDone}
                            challengesTotal={challengesTotal}
                            onResume={onResume}
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                        <ModuleLessonList
                            anatPart="ModuleLessonList"
                            lessons={lessons}
                            resumeLessonId={resumeLessonId}
                            onSelectLesson={onSelectLesson}
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                        {/* A count of zero is not news (`ModuleHeader`/`ContentModeNav` idiom) —
                        extended here to a whole block's presence: a module with no challenges
                        yet does not earn an empty challenge list on its own page. */}
                        {isSkeleton || challenges.length > 0 ? (
                            <ModuleChallengeList
                                anatPart="ModuleChallengeList"
                                challenges={challenges}
                                onSelectChallenge={onSelectChallenge}
                                isSkeleton={isSkeleton}
                                showAnatomy={showAnatomy}
                            />
                        ) : null}
                    </StackV>
                )}
            </StackV>
        </Container>
    )
}

export { ModulePageScreen }
