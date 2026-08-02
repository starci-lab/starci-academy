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
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { HighlightChip } from "@sb-components/composites/chips/HighlightChip/HighlightChip"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Container } from "@sb-components/frames/Container/Container"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { DifficultyChip, type Difficulty } from "@/components/blocks/chips/DifficultyChip"
import { GithubTeamGate } from "@/components/features/auth/GithubTeamGate"
import { LearnBreadcrumb } from "@/components/features/learn/shared/LearnBreadcrumb"
import { LearnNudges } from "@/components/blockv2/LearnNudges"
import { TrialConversionStrip } from "@/components/blockv2/TrialConversionStrip"

/** One lesson row on the "keep going" path — leading state icon · title · minutes-read · difficulty + premium-lock. */
export interface CourseContentsLesson {
    /** Stable id (React key + reader deep-link target). */
    id: string
    /** Lesson title — the row's primary line. */
    title: string
    /** Already-localized "N min read" caption — the row's subtitle. */
    minutesReadText: string
    /** Where the viewer stands on this lesson: the highlighted next one, an already-read one, or untouched. */
    state: "active" | "read" | "unread"
    /** Difficulty tier (resolved from the raw string by the connected file); omitted → no difficulty chip. */
    difficulty?: Difficulty
    /** `true` → a premium lesson the trial viewer can't open yet → a trailing lock. */
    isPremium: boolean
    /** Open this lesson in the reader. */
    onPress: () => void
}

/** Catalog meta figures for the header chips — identity facts the progress stat line does NOT carry. */
export interface CourseContentsMeta {
    /** Chapter/module count. */
    moduleCount: number
    /** Already-formatted study-hours figure (e.g. `"~3"`). */
    hoursText: string
    /** Already-formatted learner count; omitted → the learners chip is skipped. */
    learnersText?: string
}

/** All display text, already localized by the connected {@link CourseContents}; a story passes i18n keys. */
export interface CourseContentsLabels {
    emptyTitle: string
    errorTitle: string
    retry: string
    /** Meta-chip labels. */
    metaModulesLabel: string
    metaHoursLabel: string
    metaLearnersLabel: string
    /** Continue-cluster eyebrow — the connected file picks capstone / continue / all-done. */
    eyebrow: string
    /** Primary resume-button label — the connected file picks capstone vs normal. */
    resumeButton: string
    /** Meter label. */
    completion: string
    /** Full "lessons · challenges" stat line — the connected file interpolates + joins it. */
    progressStat: string
    /** Keep-going kicker; the presentational file appends `· <module title>`. */
    keepGoing: string
    /** Premium-lock accessible name. */
    premiumLabel: string
}

/** Props for {@link _CourseContents} — presentational; all data resolved, no fetch/store/i18n. */
export interface CourseContentsProps {
    /** Async status, owned by the connected file. */
    isLoading?: boolean
    error?: unknown
    onRetry?: () => void
    /** `true` (after loading) → no outline → the empty state. */
    isEmpty?: boolean
    /** Course title — the page heading. */
    title: string
    /** One-line course description under the title. */
    description?: string
    /** Header catalog meta; omitted → the meta chip row is skipped. */
    meta?: CourseContentsMeta
    /** Present ONLY for a not-yet-enrolled learner (the connected file owns that gate) → the conversion strip renders. */
    trialStrip?: {
        courseId: string
        freeLessonsRemaining: number
    }
    /** Resume target's title; omitted → no continue title line. */
    resumeTitle?: string
    /** Open the resume target; omitted → no resume button (all done). */
    onResume?: () => void
    /** Overall completion percent (0-100) for the meter. */
    completionPercent: number
    /** The current module's title — the keep-going heading. */
    moduleTitle?: string
    /** The current module's lessons = the keep-going path. Empty → the path is skipped. */
    lessons: Array<CourseContentsLesson>
    labels: CourseContentsLabels
}

/** state → leading icon on the lesson row (the frame forces `size-5`). */
const STATE_ICON = {
    active: PlayIcon,
    read: CheckCircleIcon,
    unread: CircleIcon,
} as const

/**
 * Placeholder rows for the keep-going path while loading. ONE tree — the resting
 * state is the SAME `SurfaceCardList` shimmered, never a hand-mirrored copy that drifts.
 */
const SKELETON_LESSON_ROWS: Array<SurfaceCardListItem> = Array.from({ length: 4 }, (_unused, index) => ({
    key: `skeleton-lesson-${index}`,
    title: "Lesson",
    subtitle: "min read",
    leadingIcon: CircleIcon,
}))

/** Breadcrumb slot for the header — a connected child that self-fetches its crumbs (split.md). */
const BreadcrumbSlot: ComponentTypeWithSkeleton = () => <LearnBreadcrumb />

/**
 * Course-content home — the presentational half of {@link CourseContents}, composed on the
 * tier-correct storybook vocabulary (`Container` / `PageHeader` / `HighlightChip` / `ProgressMeter` /
 * `SurfaceCardList`). Layout: breadcrumb → header (title + description + catalog meta) → GitHub-team
 * warning → trial conversion strip (gated by the connected file) → continue cluster (eyebrow + resume
 * title + Resume button, one honest completion meter, the lessons·challenges stat line) → contextual
 * nudges → keep-going path (the current module's lessons as rows). The self-fetching children
 * (`GithubTeamGate` / `TrialConversionStrip` / `LearnNudges` / `LearnBreadcrumb`) are rendered as-is —
 * a presentational screen may render connected children (split.md). The connected `index.tsx` owns the
 * fetch and i18n.
 *
 * @param props - {@link CourseContentsProps}
 */
export const _CourseContents = ({
    isLoading = false,
    error,
    onRetry,
    isEmpty = false,
    title,
    description,
    meta,
    trialStrip,
    resumeTitle,
    onResume,
    completionPercent,
    moduleTitle,
    lessons,
    labels,
}: CourseContentsProps) => {
    // Header meta chips — a slot the PageHeader calls itself (skipped while loading, where the frame
    // draws its own placeholder). Captured through a narrowed const so the closure keeps the fields.
    let MetaChips: ComponentTypeWithSkeleton | undefined
    if (meta) {
        const catalog = meta
        MetaChips = () => (
            <StackH
                gap={3}
                items={[
                    () => <HighlightChip icon={StackIcon} value={catalog.moduleCount} label={labels.metaModulesLabel} />,
                    () => <HighlightChip icon={ClockIcon} value={catalog.hoursText} label={labels.metaHoursLabel} />,
                    ...(catalog.learnersText
                        ? [() => <HighlightChip icon={UsersIcon} value={catalog.learnersText!} label={labels.metaLearnersLabel} />]
                        : []),
                ]}
            />
        )
    }

    // Keep-going path rows — each lesson as a fixed SurfaceCardList row: leading state icon, title,
    // minutes-read subtitle, and a difficulty + premium-lock meta slot.
    const lessonRows: Array<SurfaceCardListItem> = lessons.map((lesson) => {
        const { difficulty, isPremium } = lesson
        const metaSlot = difficulty != null || isPremium
            ? () => (
                <StackH
                    gap={3}
                    items={[
                        ...(difficulty != null ? [() => <DifficultyChip difficulty={difficulty} />] : []),
                        ...(isPremium ? [() => (
                            <LockIcon
                                aria-label={labels.premiumLabel}
                                focusable="false"
                                className="size-5 text-muted"
                            />
                        )] : []),
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
            onPress: lesson.onPress,
            meta: metaSlot,
        }
    })

    // ONE tree — the resting state is this SAME spine with `isSkeleton` threaded into every
    // shimmer-capable part, never a hand-mirrored copy. `spine(true)` is the loading branch,
    // `spine(false)` the content branch; they cannot drift because they are the same code.
    const spine = (isSkeleton: boolean) => (
        <Container
            size="md"
            pattern="center-measure"
            body={() => (
                <StackV
                    gap={7}
                    items={[
                        // Header — its OWN tier, gap-10 (page band) from the content cluster below.
                        () => (
                            <PageHeader
                                breadcrumb={BreadcrumbSlot}
                                title={title}
                                description={description}
                                meta={MetaChips}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        // Content cluster: GitHub-team warning · trial strip · continue · nudges · path.
                        // The connected children (GithubTeamGate · TrialConversionStrip · LearnNudges)
                        // own THEIR resting shape — they self-fetch and shimmer themselves.
                        () => (
                            <StackV
                                gap={6}
                                items={[
                                    () => <GithubTeamGate />,
                                    ...(trialStrip ? [() => (
                                        <TrialConversionStrip
                                            courseId={trialStrip.courseId}
                                            freeLessonsRemaining={trialStrip.freeLessonsRemaining}
                                        />
                                    )] : []),
                                    // Continue + progress — flat (no card face), the honest unified meter.
                                    () => (
                                        <StackV
                                            gap={4}
                                            items={[
                                                () => (
                                                    <StackH
                                                        align="start"
                                                        justify="between"
                                                        gap={4}
                                                        items={[
                                                            () => (
                                                                <StackV
                                                                    gap={1}
                                                                    classNames={["min-w-0"]}
                                                                    items={[
                                                                        () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.eyebrow} />,
                                                                        ...(isSkeleton || resumeTitle ? [() => (
                                                                            <Typography size="base" weight="semibold" truncate isSkeleton={isSkeleton} text={resumeTitle} />
                                                                        )] : []),
                                                                    ]}
                                                                />
                                                            ),
                                                            // Button carries no `isSkeleton` — a resting screen shows no CTA yet.
                                                            ...(!isSkeleton && onResume ? [() => (
                                                                <Button
                                                                    label={labels.resumeButton}
                                                                    variant="primary"
                                                                    size="lg"
                                                                    suffixIcon={ArrowRightIcon}
                                                                    iconSlide
                                                                    onPress={onResume}
                                                                    classNames={["shrink-0"]}
                                                                />
                                                            )] : []),
                                                        ]}
                                                    />
                                                ),
                                                () => (
                                                    <ProgressMeter
                                                        value={completionPercent}
                                                        max={100}
                                                        label={labels.completion}
                                                        showValue
                                                        isSkeleton={isSkeleton}
                                                    />
                                                ),
                                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.progressStat} />,
                                            ]}
                                        />
                                    ),
                                    // Contextual nudges — aids that orbit the spine; each self-hides at 0.
                                    () => <LearnNudges />,
                                    // Keep-going path — the current module's lessons (the full tree lives
                                    // in the left content-map rail, so the body never re-draws it).
                                    // While loading it shimmers the SAME list with placeholder rows.
                                    ...((isSkeleton || lessons.length > 0) ? [() => (
                                            <StackV
                                                gap={4}
                                                items={[
                                                    () => (
                                                        <Typography
                                                            size="sm"
                                                            weight="semibold"
                                                            color="muted"
                                                            isSkeleton={isSkeleton}
                                                            text={`${labels.keepGoing} · ${moduleTitle ?? ""}`}
                                                        />
                                                    ),
                                                    () => <SurfaceCardList items={isSkeleton ? SKELETON_LESSON_ROWS : lessonRows} isSkeleton={isSkeleton} />,
                                                ]}
                                            />
                                    )] : []),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    )

    return (
        <div data-tier="page" data-component="CourseContents">
            <AsyncContent
                isLoading={isLoading}
                skeleton={spine(true)}
                isEmpty={isEmpty}
                emptyContent={{ title: labels.emptyTitle }}
                error={error}
                errorContent={{
                    title: labels.errorTitle,
                    onRetry: () => { onRetry?.() },
                    retryLabel: labels.retry,
                }}
                content={spine(false)}
            />
        </div>
    )
}
