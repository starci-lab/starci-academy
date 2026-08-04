import React from "react"
import {
    ArrowRightIcon,
    CheckCircleIcon,
    CircleIcon,
    ClockIcon,
    LockIcon,
    PlayIcon,
    StackIcon,
    UsersIcon,
} from "@phosphor-icons/react"
import { CourseTeamGate } from "@sb-components/starci/blocks/learn/CourseTeamGate/CourseTeamGate"
import { LearnNudges, type LearnNudge } from "@sb-components/starci/blocks/learn/LearnNudges/LearnNudges"
import { TrialConversionStrip, type TrialConversionStripPrice } from "@sb-components/starci/blocks/commerce/TrialConversionStrip/TrialConversionStrip"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { HighlightChip } from "@sb-components/composites/chips/HighlightChip/HighlightChip"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import type { ComponentTypeWithSkeleton , SkeletonProps } from "@sb-components/composites/_slot"
import { Breadcrumbs, type BreadcrumbItem } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { ChipBase } from "@sb-components/atoms/chips/Chip/ChipBase"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Container } from "@sb-components/frames/Container/Container"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CourseContents` — the `/learn/content` dashboard screen, the CANONICAL entry
 * point for the whole family. The per-device × per-state breakdown (desktop /
 * tablet / mobile, each empty / unpaid / paid / skeleton) lives one level down in
 * `Desktop/` · `Tablet/` · `Mobile/`; this leaf is the one every OTHER story in this
 * catalog links to when it needs to point at "the CourseContents screen" without
 * committing to one particular device or viewer.
 */

/** Difficulty → chip tone, so the keep-going rows read their level at a glance. */
const DIFFICULTY_TONE = {
    beginner: "success",
    intermediate: "warning",
    advanced: "danger",
} as const

/** One keep-going lesson row (demo shape). */
interface LessonRow {
    id: string
    title: string
    minutesReadText: string
    state: "active" | "read" | "unread"
    difficulty?: keyof typeof DIFFICULTY_TONE
    isPremium: boolean
}

/** state → leading row icon (the list forces `size-5`). */
const STATE_ICON = {
    active: PlayIcon,
    read: CheckCircleIcon,
    unread: CircleIcon,
} as const

const CRUMBS: Array<BreadcrumbItem> = [
    { key: "courses", label: "Courses", onPress: () => {} },
    { key: "course", label: "DevOps Mastery" },
]

const LESSONS: Array<LessonRow> = [
    { id: "l1", title: "What is Docker", minutesReadText: "6 min read", state: "read", difficulty: "beginner", isPremium: false },
    { id: "l2", title: "Writing an optimized Dockerfile", minutesReadText: "12 min read", state: "active", difficulty: "intermediate", isPremium: false },
    { id: "l3", title: "Multi-stage build", minutesReadText: "9 min read", state: "unread", difficulty: "intermediate", isPremium: true },
]

// Plain DATA — `kind` is an ENUM; the `LearnNudges` block decides the icon itself.
const NUDGES: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Review 12 cards due today", onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Practice interviewing for your capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "You're ranked #42 this week", onPress: () => {} },
]

const SAMPLE_PRICE: TrialConversionStripPrice = {
    discountedPriceVnd: 1_990_000,
    originalPriceVnd: 2_990_000,
    phasePriceVnd: 2_490_000,
    discountPercent: 33,
    currentPhase: PricingPhase.EarlyBird,
    seatsRemainingInCurrentPhase: 14,
    nextPhasePriceVnd: 2_490_000,
}

/** Props for {@link CourseContents}. */
export interface CourseContentsLayoutProps {
    /** `"trial"` shows the gh-team gate + conversion strip; `"paid"` self-hides the strip. */
    viewer?: "trial" | "paid"
    /** `true` → the whole screen is at REST; the flag flows to every part, each draws its own resting shape. */
    isSkeleton?: boolean
    /** `true` → the course has no lessons yet; `AsyncContentEmpty` replaces the ENTIRE spine. */
    isEmpty?: boolean
}

/**
 * Empty state — the course has no contents yet.
 */
const CourseContentsEmpty = () => (
    <Container
        size="md"
        padding={6}
        body={() => (
            <AsyncContentEmpty
                icon={StackIcon}
                title="This course has no lessons yet"
                description="Content is still being written — check back later."
            />
        )}
    />
)

/**
 * The `/learn/content` dashboard leaf.
 *
 * @param props - {@link CourseContentsLayoutProps}
 */
export const CourseContents = ({ viewer = "trial", isSkeleton = false, isEmpty = false }: CourseContentsLayoutProps) => {
    if (isEmpty) {
        return <CourseContentsEmpty />
    }

    // Header slots the PageHeader calls itself (skipped while it draws its own skeleton header).
    const BreadcrumbSlot: ComponentTypeWithSkeleton = () => <Breadcrumbs items={CRUMBS} />
    const MetaChips: ComponentTypeWithSkeleton = () => (
        <StackH
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: SkeletonProps) => <HighlightChip isSkeleton={isSkeleton} icon={StackIcon} value={8} label="chapters" />,
                ({ isSkeleton }: SkeletonProps) => <HighlightChip isSkeleton={isSkeleton} icon={ClockIcon} value="~14" label="hours" />,
                ({ isSkeleton }: SkeletonProps) => <HighlightChip isSkeleton={isSkeleton} icon={UsersIcon} value="2,481" label="learners" />,
            ]}
        />
    )

    // Keep-going rows — leading state icon, title, minutes-read subtitle, difficulty + premium-lock meta.
    const lessonRows: Array<SurfaceCardListItem> = LESSONS.map((lesson) => {
        const { difficulty, isPremium } = lesson
        const metaSlot = difficulty != null || isPremium
            ? () => (
                <StackH
                    gap={3}
                    isSkeleton={isSkeleton}
                    items={[
                        ...(difficulty != null ? [({ isSkeleton }: SkeletonProps) => <ChipBase isSkeleton={isSkeleton} tone={DIFFICULTY_TONE[difficulty]} text={difficulty} />] : []),
                        ...(isPremium ? [() => <LockIcon aria-label="Premium lesson" focusable="false" className="size-5 text-muted" />] : []),
                    ]}
                />
            )
            : undefined
        return {
            key: lesson.id,
            title: lesson.title,
            subtitle: lesson.minutesReadText,
            leadingIcon: STATE_ICON[lesson.state],
            leadingIconColor: lesson.state === "active" ? "accent" : lesson.state === "read" ? "success" : undefined,
            onPress: () => {},
            meta: metaSlot,
        }
    })

    const contentCluster = (
        <StackV
            gap={6}
            principles={["block-boundary"]}
            isSkeleton={isSkeleton}
            items={[
                // Gate is for people who ALREADY BOUGHT; the block self-hides when it doesn't apply.
                () => <CourseTeamGate isEnrolled={viewer === "paid"} isInTeam={false} onJoin={() => {}} isSkeleton={isSkeleton} />,
                ...(viewer === "trial" ? [() => <TrialConversionStrip freeLessonsRemaining={9} price={SAMPLE_PRICE} onEnroll={() => {}} isSkeleton={isSkeleton} />] : []),
                // Continue + progress — flat (no card face), the honest unified meter.
                () => (
                    <StackV
                        gap={4}
                        principles={["group-boundary"]}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    align="start"
                                    justify="between"
                                    gap={4}
                                    principles={["content-row"]}
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => (
                                            <StackV
                                                gap={1}
                                                classNames={["min-w-0"]}
                                                isSkeleton={isSkeleton}
                                                items={[
                                                    () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text="Continue where you left off" />,
                                                    () => <Typography size="base" weight="semibold" truncate isSkeleton={isSkeleton} text="Writing an optimized Dockerfile" />,
                                                ]}
                                            />
                                        ),
                                        ...(!isSkeleton ? [({ isSkeleton }: SkeletonProps) => (
                                            <Button
                                                isSkeleton={isSkeleton}
                                                label="Resume"
                                                variant="primary"
                                                size="lg"
                                                suffixIcon={ArrowRightIcon}
                                                iconSlide
                                                onPress={() => {}}
                                                classNames={["shrink-0"]}
                                            />
                                        )] : []),
                                    ]}
                                />
                            ),
                            () => <ProgressMeter value={34} max={100} label="Completion" showValue isSkeleton={isSkeleton} />,
                            () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text="8 / 23 lessons · 2 / 9 challenges" />,
                        ]}
                    />
                ),
                // Contextual nudges — aids that orbit the spine; each self-hides at 0.
                () => <LearnNudges items={NUDGES} isSkeleton={isSkeleton} />,
                // Keep-going path — the current module's lessons as rows.
                () => (
                    <StackV
                        gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Typography size="sm" weight="semibold" color="muted" isSkeleton={isSkeleton} text="Keep going · Containerization" />,
                            () => <SurfaceCardList items={lessonRows} isSkeleton={isSkeleton} />,
                        ]}
                    />
                ),
            ]}
        />
    )

    const body = (
        <StackV
            gap={7}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <PageHeader
                        breadcrumb={BreadcrumbSlot}
                        title="DevOps Mastery"
                        description="From CI/CD to production Kubernetes — a hands-on learning path."
                        meta={MetaChips}
                        isSkeleton={isSkeleton}
                    />
                ),
                () => contentCluster,
            ]}
        />
    )

    return <Container size="md" padding={6} body={() => body} />
}
