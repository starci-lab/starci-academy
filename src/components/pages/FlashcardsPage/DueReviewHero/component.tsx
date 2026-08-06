import React from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Resolved resume-card data for {@link _DueReviewHero} — only present when a "Due today"
 * run is in progress. Already-translated text and interpolated numbers; the interpolation
 * itself lives in the connected `DueReviewHero` (`tiers/split.md`).
 */
export interface DueReviewHeroResume {
    /** Card title ("Review in progress"). */
    title: string
    /** Card subtitle, already interpolated ("Card {current}/{total}"). */
    subtitle: string
    /** Current position for the progress meter. */
    value: number
    /** Total cards in the run, for the progress meter. */
    max: number
    /** "Continue" CTA label. */
    ctaLabel: string
    /** Fired when the resume card's CTA is pressed. */
    onPress: () => void
}

/** All display text, already localized by the connected `DueReviewHero`; a story passes i18n keys. */
export interface DueReviewHeroLabels {
    /** Section label above the card ("Due today"). */
    sectionLabel: string
    /** Error-branch title. */
    errorTitle: string
    /** Empty-branch title ("All caught up"). */
    allCaughtTitle: string
    /** Empty-branch description. */
    allCaughtHint: string
    /** Primary stat line, already interpolated with the due count. */
    count: string
    /** Secondary "overdue + new" breakdown line — omitted when the queue isn't a mix of the two. */
    countBreakdown?: string
    /** "Review N cards" button label, already interpolated with the due count. */
    start: string
}

/** Props for {@link _DueReviewHero} — presentational; all data resolved, no fetch/store/i18n. */
export interface DueReviewHeroProps {
    /** First load, nothing in hand → the whole due-today row shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero cards due → the caught-up empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats empty + content). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry?: () => void
    /** `true` while a fresh review session is being created — the start button goes pending. */
    starting?: boolean
    /** Fired when the "Review N cards" button is pressed. */
    onPressStart: () => void
    /** The resumable cross-deck run, when one exists — renders a `ContinueCard` above the due-today card. */
    resume?: DueReviewHeroResume
    /** Every translated string this block renders. */
    labels: DueReviewHeroLabels
}

/**
 * The flashcards home hero — the presentational half of {@link import("./index").DueReviewHero}.
 * Two independent sections stacked `gap-6` (different function, `foundations/gap.md`): an
 * optional resume card for an in-progress cross-deck run, and the "Due today" card, whose
 * body follows the fixed order error → skeleton → empty → content
 * (`loading-and-skeleton.md`), with `isSkeleton` threaded to every leaf so the shimmer
 * mirrors the loaded shape. See `tiers/split.md` — the connected `index.tsx` owns the fetch
 * and i18n.
 *
 * @param props - {@link DueReviewHeroProps}
 */
export const _DueReviewHero = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    starting = false,
    onPressStart,
    resume,
    labels,
}: DueReviewHeroProps) => {
    // error beats a stale loading flag; empty only once settled (loading-and-skeleton.md §1) —
    // both message branches come from the shared `AsyncContent*` frames, never hand-written JSX.
    const dueBody = () => {
        if (error) {
            return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} />
        }
        if (!isSkeleton && isEmpty) {
            return <AsyncContentEmpty title={labels.allCaughtTitle} description={labels.allCaughtHint} />
        }
        return (
            <StackH gap={4} principle="flex-action" justify="between" at="sm" isSkeleton={isSkeleton}
                explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                items={[
                    () => (
                        <StackV gap={1} isSkeleton={isSkeleton} items={[
                            () => <Typography size="sm" text={labels.count} isSkeleton={isSkeleton} />,
                            // breaks the (possibly confusing) total down into its 2 parts — only when
                            // it's actually a mix, so a pure-overdue or pure-new queue doesn't show a
                            // redundant "X + 0" (dueCount = overdue reviews + today's capped new batch).
                            ...(labels.countBreakdown ? [() => (
                                <Typography size="xs" color="muted" text={labels.countBreakdown ?? ""} isSkeleton={isSkeleton} />
                            )] : []),
                        ]} />
                    ),
                    () => (
                        <Button
                            variant="primary"
                            label={labels.start}
                            isPending={starting}
                            isSkeleton={isSkeleton}
                            onPress={onPressStart}
                        />
                    ),
                ]} />
        )
    }

    return (
        <StackV gap={6} identity={{ tier: "block", component: "DueReviewHero" }} items={[
            ...(resume ? [() => (
                <ContinueCard
                    variant="hero"
                    title={resume.title}
                    subtitle={resume.subtitle}
                    value={resume.value}
                    max={resume.max}
                    ctaLabel={resume.ctaLabel}
                    onPress={resume.onPress}
                />
            )] : []),
            () => <LabeledCard label={labels.sectionLabel}>{dueBody()}</LabeledCard>,
        ]} />
    )
}
