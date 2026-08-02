import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SubmissionAttemptsDrawer } from "@sb-components/starci/overlays/drawers/SubmissionAttemptsDrawer/SubmissionAttemptsDrawer"
import type { SubmissionAttemptRecord } from "@sb-components/starci/overlays/drawers/SubmissionAttemptsDrawer/SubmissionAttemptsDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SubmissionAttemptsDrawer` — a presentational overlay drawer listing every
 * past graded attempt at one challenge requirement, client-paginated. A row is
 * the select action: tapping it both picks that attempt and closes the drawer.
 * Pagination is owned inside this block (the full attempt list in, sliced
 * 6-at-a-time), not a caller-controlled `currentPage`/`totalPages` pair.
 */
const meta: Meta<typeof SubmissionAttemptsDrawer> = {
    title: "StarCi/Overlays/Drawers/SubmissionAttemptsDrawer/SubmissionAttemptsDrawer",
    component: SubmissionAttemptsDrawer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SubmissionAttemptsDrawer>

// Real DOM (content branch, multi-page): DrawerShell(title includes count) >
// StackV(list + pager) > SurfaceCardList > row(StackV(row) > StackH(attempt line)
// > Typography(attempt line) + Chip + Typography(timeago)? , StackH(byline)?
// > InlineIconLabel + EnumChip?) + nav[Pagination] > Pagination.
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "StackV (list + pager)": { tier: "frame", role: "grouped seam between the attempt list and its pager", storyId: "frames-stack-stackv--default" },
    "StackV (skeleton list)": { tier: "frame", role: "related seam between skeleton rows, loading branch only", storyId: "frames-stack-stackv--default" },
    "SurfaceCardList": { tier: "composite", role: "the bounded surface list — one row per attempt, edge-to-edge separators", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    "StackV (row)": { tier: "frame", role: "tight seam between the attempt line and the model byline, inside one row", storyId: "frames-stack-stackv--default" },
    "StackH (attempt line)": { tier: "frame", role: "the row's first line — attempt number, verdict chip, time-ago pinned right", storyId: "frames-stack-stackh--default" },
    "StackH (byline)": { tier: "frame", role: "the row's second line — which model graded it + its cost/quality tier, when known", storyId: "frames-stack-stackh--default" },
    "Typography (attempt line)": { tier: "atom", role: "\"Attempt N\"", storyId: "atoms-text-typography-typography--overview" },
    "Typography (timeago)": { tier: "atom", role: "already-humanized relative time, when present", storyId: "atoms-text-typography-typography--colors" },
    "Chip": { tier: "atom", role: "the score chip — verdict icon + tone + text, or an ungraded chip when `score` is null", storyId: "atoms-chips-chip-chip--tones" },
    "InlineIconLabel": { tier: "composite", role: "\"Graded by <model>\", same recipe `SubmissionScoreCard` uses for its own byline", storyId: "composites-texts-inlineiconlabel--count" },
    "EnumChip": { tier: "composite", role: "the model's cost/quality tier — same `MODEL_CATEGORY_MAP` `SubmissionScoreCard` owns, reused not re-declared", storyId: "composites-chips-enumchip--gallery" },
    "Pagination": { tier: "atom", role: "the page nav — only reachable once the content branch is showing, and only past 6 attempts", storyId: "atoms-navigation-pagination-pagination--default" },
    "AsyncContentEmpty": { tier: "composite", role: "the no-attempts-yet message", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
    "AsyncContentError": { tier: "composite", role: "the failed-fetch message, with retry", storyId: "composites-async-asynccontent-asynccontenterror--with-retry" },
}

// 7 attempts ⇒ past `HISTORY_PAGE_SIZE` (6) ⇒ the pager mounts on page 1.
const MULTI_PAGE_ATTEMPTS: Array<SubmissionAttemptRecord> = [
    { id: "attempt-7", attemptNumber: 7, score: 88, maxScore: 100, isPassing: true, processedTimeAgo: "5 minutes ago", gradedByModel: "qwen2.5-coder-32b", modelCategory: "economy" },
    { id: "attempt-6", attemptNumber: 6, score: 60, maxScore: 100, isPassing: false, processedTimeAgo: "2 hours ago", gradedByModel: "qwen2.5-coder-32b", modelCategory: "economy" },
    { id: "attempt-5", attemptNumber: 5, score: 82, maxScore: 100, isPassing: true, processedTimeAgo: "1 day ago" },
    { id: "attempt-4", attemptNumber: 4, score: 45, maxScore: 100, isPassing: false, processedTimeAgo: "2 days ago" },
    { id: "attempt-3", attemptNumber: 3, score: null, maxScore: null, isPassing: false },
    { id: "attempt-2", attemptNumber: 2, score: 30, maxScore: 100, isPassing: false, processedTimeAgo: "5 days ago" },
    { id: "attempt-1", attemptNumber: 1, score: 10, maxScore: 100, isPassing: false, processedTimeAgo: "6 days ago" },
]

const SINGLE_PAGE_ATTEMPTS: Array<SubmissionAttemptRecord> = [
    { id: "attempt-1", attemptNumber: 1, score: 96, maxScore: 100, isPassing: true, processedTimeAgo: "5 minutes ago", gradedByModel: "qwen2.5-coder-32b", modelCategory: "economy" },
]

/** Shared controlled wrapper — the trigger reopens the drawer after it closes. */
const ControlledSubmissionAttemptsDrawer = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [selectedId, setSelectedId] = useState("attempt-7")
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label="View submission history"
                variant="secondary"
                size="sm"
                classNames={["self-start"]}
                onPress={() => setIsOpen(true)}
            />
            <BlockAnatomy
                name="SubmissionAttemptsDrawer"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                reason="Presentational overlay drawer over every past graded attempt at one challenge requirement. `AsyncContent`'s error→loading→empty→content switch drives which of these five states is on screen; the pager lives inside the content branch only, since a loading paint has no known page count yet. Tapping a row selects it AND closes the drawer in one gesture — same as real `src`."
                states={[
                    {
                        name: "content — 7 attempts ⇒ pager mounts",
                        why: "Past `HISTORY_PAGE_SIZE` (6), so page 1 shows the newest 6 and the pager appears — the same client-side slicing real `src` does off the FULL attempt list, not a caller-controlled page. The selected attempt (`attempt-7`) carries the accent tint, matching real `src`'s `bg-accent-soft` row highlight.",
                        code: `<SubmissionAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[
    { id: "attempt-7", attemptNumber: 7, score: 88, maxScore: 100, isPassing: true, processedTimeAgo: "5 minutes ago", gradedByModel: "qwen2.5-coder-32b", modelCategory: "economy" },
    // …6 more, newest first
  ]}
  selectedAttemptId="attempt-7"
  onSelect={(id) => { pickAttempt(id) }}
/>`,
                        render: (
                            <SubmissionAttemptsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                attempts={MULTI_PAGE_ATTEMPTS}
                                selectedAttemptId={selectedId}
                                onSelect={setSelectedId}
                               
                            />
                        ),
                    },
                    {
                        name: "content — 1 attempt, no pager",
                        why: "Only one attempt on record — well under the page size, so the `<nav>`/`Pagination` pair never mounts at all.",
                        code: `<SubmissionAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[{ id: "attempt-1", attemptNumber: 1, score: 96, maxScore: 100, isPassing: true, processedTimeAgo: "5 minutes ago", gradedByModel: "qwen2.5-coder-32b", modelCategory: "economy" }]}
  selectedAttemptId="attempt-1"
  onSelect={pickAttempt}
/>`,
                        render: (
                            <SubmissionAttemptsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                attempts={SINGLE_PAGE_ATTEMPTS}
                                selectedAttemptId="attempt-1"
                                onSelect={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isLoading = true",
                        why: "The list's own fetch is in flight — a plain shimmer mirrors the row footprint, pagination omitted (no known page count yet).",
                        code: `<SubmissionAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[]}
  onSelect={pickAttempt}
  isLoading
/>`,
                        render: (
                            <SubmissionAttemptsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                attempts={[]}
                                onSelect={() => {}}
                                isLoading
                            />
                        ),
                    },
                    {
                        name: "isEmpty = true",
                        why: "Loading has finished and there are no recorded attempts at all — the drawer falls to its empty message instead of an empty list.",
                        code: `<SubmissionAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[]}
  onSelect={pickAttempt}
  isEmpty
/>`,
                        render: (
                            <SubmissionAttemptsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                attempts={[]}
                                onSelect={() => {}}
                                isEmpty
                            />
                        ),
                    },
                    {
                        name: "error set — with retry",
                        why: "A truthy `error` beats loading/empty (per `AsyncContent`'s priority order) and, paired with `onRetry`+`retryLabel`, shows a retry button.",
                        code: `<SubmissionAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[]}
  onSelect={pickAttempt}
  error={fetchError}
  onRetry={refetch}
  retryLabel="Retry"
/>`,
                        render: (
                            <SubmissionAttemptsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                attempts={[]}
                                onSelect={() => {}}
                                error={new Error("network")}
                                onRetry={() => {}}
                                retryLabel="Retry"
                            />
                        ),
                    },
                ]}
            />
        </div>
    )
}

/** All five states (multi-page content, single-page content, loading, empty, error) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledSubmissionAttemptsDrawer />,
}
