import React from "react"
import { Chip, Drawer, ScrollShadow, Typography } from "@heroui/react"
import { TagIcon } from "@phosphor-icons/react"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"

/** How many placeholder rows the co-located skeleton shows while the first page of attempts loads. */
const SKELETON_ATTEMPT_COUNT = 3

/** HeroUI Chip color per seniority level (mirrors the reviewer / session). */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** Verdict → chip color. */
const verdictColorOf = (verdict: string): "success" | "warning" | "danger" =>
    verdict === "pass" ? "success" : verdict === "borderline" ? "warning" : "danger"

/** Verdict → the shared word label (`labels.pass`/`labels.borderline`/`labels.fail`). */
const verdictLabelOf = (verdict: string, labels: InterviewSessionDetailDrawerLabels): string =>
    verdict === "pass" ? labels.pass : verdict === "borderline" ? labels.borderline : labels.fail

/** One answered question, already resolved by the connected `InterviewSessionDetailDrawer` — no raw entity. */
export interface InterviewSessionDetailDrawerAttempt {
    id: string
    /** Raw verdict — drives the chip color (`verdictColorOf`) and the label lookup (`verdictLabelOf`). */
    verdict: string
    /** `t("flashcard.interview.score", { score })`, already interpolated. */
    scoreLabel: string
    /** `t("flashcard.interview.questionN", { n: position + 1 })`, already interpolated. */
    questionLabel: string
    question: string
    /** Raw seniority key — drives the chip color (`LEVEL_COLOR`). `undefined` → no level chip. */
    level?: string
    /** `t(\`flashcard.level.${level}\`)`, already resolved. */
    levelLabel?: string
    tags: Array<string>
    strengths: Array<string>
    gaps: Array<string>
    modelAnswerHint?: string
}

/** Run summary shown in the header — already resolved (date + count label already localized). */
export interface InterviewSessionDetailDrawerSummary {
    dateLabel: string
    questionCountLabel: string
    averageScore: number
    passCount: number
    borderlineCount: number
    failCount: number
}

/** All display text, already localized by the connected `InterviewSessionDetailDrawer`; a story passes i18n keys. */
export interface InterviewSessionDetailDrawerLabels {
    detailTitle: string
    avgScore: string
    pass: string
    borderline: string
    fail: string
    strengths: string
    gaps: string
    hint: string
    emptyTitle: string
    errorTitle: string
    retry: string
}

/** Props for {@link _InterviewSessionDetailDrawer} — presentational; all data resolved, no fetch/store/i18n. */
export interface InterviewSessionDetailDrawerProps {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Open-state change handler. */
    onOpenChange: (open: boolean) => void
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero attempts → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** The run being inspected (drives the summary header); `null` while closed / not yet selected. */
    session?: InterviewSessionDetailDrawerSummary | null
    attempts?: Array<InterviewSessionDetailDrawerAttempt>
    labels: InterviewSessionDetailDrawerLabels
}

/** One answered question — verdict + score + prompt + persisted feedback. */
const AttemptCard = ({
    attempt,
    labels,
}: {
    attempt: InterviewSessionDetailDrawerAttempt
    labels: InterviewSessionDetailDrawerLabels
}) => (
    <div className="flex flex-col gap-3 rounded-xl border border-default p-4">
        <div className="flex items-center justify-between gap-3">
            <Chip size="sm" variant="soft" color={verdictColorOf(attempt.verdict)}>
                {verdictLabelOf(attempt.verdict, labels)}
            </Chip>
            <Typography type="body-sm" weight="medium">
                {attempt.scoreLabel}
            </Typography>
        </div>
        <Typography type="body-xs" weight="medium" color="muted">
            {attempt.questionLabel}
        </Typography>
        <div className="text-foreground">
            <MarkdownContent markdown={attempt.question} />
        </div>
        {/* question meta — level chip (1 classification axis) + tags as plain text */}
        {attempt.level || attempt.tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
                {attempt.level ? (
                    <Chip size="sm" variant="soft" color={LEVEL_COLOR[attempt.level] ?? "default"}>
                        {attempt.levelLabel}
                    </Chip>
                ) : null}
                {attempt.tags.length > 0 ? (
                    <Typography type="body-xs" color="muted" className="inline-flex items-center gap-1">
                        <TagIcon size={14} />
                        {attempt.tags.join(" · ")}
                    </Typography>
                ) : null}
            </div>
        ) : null}
        {/* persisted feedback (empty for legacy runs) */}
        {attempt.strengths.length > 0 ? (
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" weight="medium" className="text-success-soft-foreground">
                    {labels.strengths}
                </Typography>
                <ul className="flex list-disc flex-col gap-2 pl-5">
                    {attempt.strengths.map((item, index) => (
                        <li key={index}>
                            <Typography type="body-sm">{item}</Typography>
                        </li>
                    ))}
                </ul>
            </div>
        ) : null}
        {attempt.gaps.length > 0 ? (
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" weight="medium" className="text-danger-soft-foreground">
                    {labels.gaps}
                </Typography>
                <ul className="flex list-disc flex-col gap-2 pl-5">
                    {attempt.gaps.map((item, index) => (
                        <li key={index}>
                            <Typography type="body-sm">{item}</Typography>
                        </li>
                    ))}
                </ul>
            </div>
        ) : null}
        {attempt.modelAnswerHint ? (
            <div className="flex flex-col gap-2 border-t border-divider pt-3">
                <Typography type="body-xs" weight="medium" color="muted">
                    {labels.hint}
                </Typography>
                <Typography type="body-sm">{attempt.modelAnswerHint}</Typography>
            </div>
        ) : null}
    </div>
)

/**
 * Drawer showing the per-question detail of ONE mock-interview run: a summary header (date · count ·
 * average · verdict breakdown) plus each answered question with its verdict, score, prompt, and
 * persisted feedback (strengths/gaps/hint). Older runs (logged before feedback was stored) show just
 * verdict/score/prompt. The presentational half of {@link InterviewSessionDetailDrawer} — `isSkeleton`
 * threads to every leaf so the shimmer mirrors the loaded shape (loading-and-skeleton.md); error/empty
 * fall to the shared `AsyncContentError`/`AsyncContentEmpty` frames. See `tiers/split.md` — the
 * connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link InterviewSessionDetailDrawerProps}
 */
export const _InterviewSessionDetailDrawer = ({
    isOpen,
    onOpenChange,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    session = null,
    attempts = [],
    labels,
}: InterviewSessionDetailDrawerProps) => {
    const { isMobile } = useSmViewpoint()

    // placeholder rows while shimmering keep the SAME card shape a loaded attempt draws.
    const skeletonRows = Array.from({ length: SKELETON_ATTEMPT_COUNT }, (_unused, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-xl border border-default p-4">
            {/* header row — verdict chip (left) + score (right) */}
            <div className="flex items-center justify-between gap-3">
                <Skeleton.Chip />
                <Skeleton.Typography type="body-sm" width="1/4" />
            </div>
            {/* question label + body */}
            <Skeleton.Typography type="body-xs" width="1/3" />
            <Skeleton.Typography type="body-sm" width="full" />
            <Skeleton.Typography type="body-sm" width="2/3" />
        </div>
    ))

    return (
        <Drawer data-tier="overlay" data-component="InterviewSessionDetailDrawer">
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className="p-0">
                        <div className="p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>
                                    {labels.detailTitle}
                                </Drawer.Heading>
                                {session ? (
                                    <Typography type="body-sm" color="muted">
                                        {`${session.dateLabel} · ${session.questionCountLabel}`}
                                    </Typography>
                                ) : null}
                            </Drawer.Header>
                        </div>
                        <Drawer.Body>
                            <ScrollShadow className="h-full p-4" hideScrollBar>
                                {/* run summary — average + verdict breakdown */}
                                {session ? (
                                    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-divider pb-4">
                                        <div className="flex items-baseline gap-2">
                                            <Typography type="h4">
                                                {session.averageScore}
                                            </Typography>
                                            <Typography type="body-xs" color="muted">
                                                {labels.avgScore}
                                            </Typography>
                                        </div>
                                        <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1">
                                            {session.passCount > 0 ? (
                                                <Typography type="body-sm" weight="medium" className="text-success-soft-foreground">
                                                    {`${labels.pass} · ${session.passCount}`}
                                                </Typography>
                                            ) : null}
                                            {session.borderlineCount > 0 ? (
                                                <Typography type="body-sm" weight="medium" className="text-warning-soft-foreground">
                                                    {`${labels.borderline} · ${session.borderlineCount}`}
                                                </Typography>
                                            ) : null}
                                            {session.failCount > 0 ? (
                                                <Typography type="body-sm" weight="medium" className="text-danger-soft-foreground">
                                                    {`${labels.fail} · ${session.failCount}`}
                                                </Typography>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}

                                {/* error → skeleton → empty → content (BLOCK-8): error beats a stale loading flag; the
                                    empty and error surfaces are the shared `AsyncContent*` frames, not hand-written JSX. */}
                                {error ? (
                                    <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
                                ) : !isSkeleton && isEmpty ? (
                                    <AsyncContentEmpty title={labels.emptyTitle} />
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {isSkeleton
                                            ? skeletonRows
                                            : attempts.map((attempt) => (
                                                <AttemptCard key={attempt.id} attempt={attempt} labels={labels} />
                                            ))}
                                    </div>
                                )}
                            </ScrollShadow>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
