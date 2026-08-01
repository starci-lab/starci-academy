import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { PersonalProjectTaskAttemptsDrawer } from "@sb-components/starci/overlays/drawers/PersonalProjectTaskAttemptsDrawer/PersonalProjectTaskAttemptsDrawer"
import type { PersonalProjectTaskAttempt } from "@sb-components/starci/overlays/drawers/PersonalProjectTaskAttemptsDrawer/PersonalProjectTaskAttemptsDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PersonalProjectTaskAttemptsDrawer` — presentational-only overlay drawer
 * listing the AI-review attempts for ONE personal-project milestone task: an
 * attempt-number label + sparkle/score chip, a short feedback line, and a
 * clock + processed-time line per attempt. No pagination, no footer —
 * genuinely simpler than the challenge-side `SubmissionAttemptsDrawer`.
 */
const meta: Meta<typeof PersonalProjectTaskAttemptsDrawer> = {
    title: "StarCi/Overlays/Drawers/PersonalProjectTaskAttemptsDrawer/PersonalProjectTaskAttemptsDrawer",
    component: PersonalProjectTaskAttemptsDrawer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PersonalProjectTaskAttemptsDrawer>

// Real DOM (populated): Drawer.CloseTrigger + Drawer.Header (title) + Drawer.Body >
// SurfaceCardList > one free-form row per attempt > StackV > StackH(attempt) >
// Typography(attempt label) + Chip, then Typography(feedback) + InlineIconLabel.
const ANNOTATE_POPULATED: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "Drawer.Body": { tier: "heroui", role: "the scrollable body region" },
    "SurfaceCardList": { tier: "composite", role: "bounded list face holding one row per attempt", storyId: "composites-cards-surfacecard-surfacecardlist--free-form" },
    "StackV": { tier: "frame", role: "tight seam stacking a row's three lines", storyId: "frames-stack-stackv--default" },
    "StackH (attempt)": { tier: "frame", role: "attempt label and score chip share one line", storyId: "frames-stack-stackh--default" },
    "Typography (attempt label)": { tier: "atom", role: "\"Attempt N\"", storyId: "atoms-text-typography-typography--overview" },
    "Chip": { tier: "atom", role: "sparkle + score, or \"Grading\" while ungraded", storyId: "atoms-chips-chip-chip--icon" },
    "Typography (feedback)": { tier: "atom", role: "one short line of grader feedback", storyId: "atoms-text-typography-typography--overview" },
    "InlineIconLabel": { tier: "composite", role: "clock icon + when this attempt was processed", storyId: "composites-texts-inlineiconlabel--overview" },
}

const ANNOTATE_EMPTY: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": ANNOTATE_POPULATED["Drawer.CloseTrigger"],
    "Drawer.Body": ANNOTATE_POPULATED["Drawer.Body"],
    "AsyncContentEmpty": { tier: "composite", role: "\"no attempts yet\" message", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
}

const ANNOTATE_ERROR: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": ANNOTATE_POPULATED["Drawer.CloseTrigger"],
    "Drawer.Body": ANNOTATE_POPULATED["Drawer.Body"],
    "AsyncContentError": { tier: "composite", role: "failed-to-load message with a retry button", storyId: "composites-async-asynccontent-asynccontenterror--with-retry" },
}

const ANNOTATE_LOADING: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": ANNOTATE_POPULATED["Drawer.CloseTrigger"],
    "Drawer.Body": ANNOTATE_POPULATED["Drawer.Body"],
    "SurfaceCardList": ANNOTATE_POPULATED["SurfaceCardList"],
    "StackV": ANNOTATE_POPULATED["StackV"],
    "StackH (attempt)": ANNOTATE_POPULATED["StackH (attempt)"],
    "Typography (attempt label)": ANNOTATE_POPULATED["Typography (attempt label)"],
    "Chip": ANNOTATE_POPULATED["Chip"],
    "Typography (feedback)": ANNOTATE_POPULATED["Typography (feedback)"],
    "InlineIconLabel": ANNOTATE_POPULATED["InlineIconLabel"],
}

const ATTEMPTS: Array<PersonalProjectTaskAttempt> = [
    {
        id: "attempt-3",
        attemptNumber: 3,
        score: 88,
        shortFeedback: "Clean folder structure, and network error cases are handled well.",
        processedAtLabel: "5 minutes ago",
    },
    {
        id: "attempt-2",
        attemptNumber: 2,
        score: 61,
        shortFeedback: "Missing input validation on the create-order API — revisit the validation.",
        processedAtLabel: "yesterday",
    },
    {
        id: "attempt-1",
        attemptNumber: 1,
        score: null,
        shortFeedback: null,
        processedAtLabel: "3 days ago",
    },
]

/** Props for the controlled story wrapper below. */
interface ControlledDrawerProps {
    attempts?: Array<PersonalProjectTaskAttempt>
    isLoading?: boolean
    isEmpty?: boolean
    error?: unknown
    annotate: Record<string, AnatomyAnnotation>
    leaf: string
    reason: string
    stateName: string
    stateWhy: string
    stateCode: string
}

/** Controlled wrapper — the trigger reopens the drawer after it closes. */
const ControlledDrawer = ({
    attempts = [],
    isLoading = false,
    isEmpty = false,
    error,
    annotate,
    leaf,
    reason,
    stateName,
    stateWhy,
    stateCode,
}: ControlledDrawerProps) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label="View AI grading history"
                variant="secondary"
                size="sm"
                classNames={["self-start"]}
                onPress={() => setIsOpen(true)}
            />
            <BlockAnatomy
                name="PersonalProjectTaskAttemptsDrawer"
                tier="block"
                leaf={leaf}
                parts={[]}
                annotate={annotate}
                reason={reason}
                states={[
                    {
                        name: stateName,
                        why: stateWhy,
                        code: stateCode,
                        render: (
                            <PersonalProjectTaskAttemptsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                attempts={attempts}
                                isLoading={isLoading}
                                isEmpty={isEmpty}
                                error={error}
                                onRetry={() => {}}
                                retryLabel="Retry"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    )
}

/** Populated: a scored pass, a scored-but-low attempt, and one still awaiting AI grading. */
export const Default: Story = {
    render: () => (
        <ControlledDrawer
            attempts={ATTEMPTS}
            annotate={ANNOTATE_POPULATED}
            leaf="AttemptsDrawer"
            reason="Lists every AI-review attempt for one milestone task — free-form SurfaceCardList rows (the fixed title/subtitle shape can't carry this row's four stacked pieces). Score `null` is a real state (attempt still being graded), not a loading stub."
            stateName="populated — scored, low-score, and ungraded attempts"
            stateWhy="Covers all three real per-attempt states at once: a passing score, a low score (feedback still short but present), and score=null with shortFeedback=null (an attempt submitted but not yet graded)."
            stateCode={`<PersonalProjectTaskAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[
    { id: "attempt-3", attemptNumber: 3, score: 88, shortFeedback: "...", processedAtLabel: "5 minutes ago" },
    { id: "attempt-2", attemptNumber: 2, score: 61, shortFeedback: "...", processedAtLabel: "yesterday" },
    { id: "attempt-1", attemptNumber: 1, score: null, shortFeedback: null, processedAtLabel: "3 days ago" },
  ]}
/>`}
        />
    ),
}

/** Loading: the drawer's own fetch is in flight — skeleton mirrors the same list face/row shape. */
export const Loading: Story = {
    render: () => (
        <ControlledDrawer
            isLoading
            annotate={ANNOTATE_LOADING}
            leaf="AttemptsDrawer"
            reason="The loading branch is the SAME AttemptRow tree with isSkeleton flipped, mirroring the exact row shape (attempt label + chip line, feedback line, clock line) instead of a hand-drawn placeholder — so a future layout change to the row cannot drift from its skeleton (§6b)."
            stateName="loading — skeleton mirror"
            stateWhy="isLoading=true before attempts have landed; three shimmer rows reserve the list's real footprint."
            stateCode={`<PersonalProjectTaskAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[]}
  isLoading
/>`}
        />
    ),
}

/** Empty: the task has never been submitted for. */
export const Empty: Story = {
    render: () => (
        <ControlledDrawer
            isEmpty
            annotate={ANNOTATE_EMPTY}
            leaf="AttemptsDrawer"
            reason="isEmpty=true (once loading has finished) falls to AsyncContent's empty message — a real, named state for a milestone task that has never been submitted for, not a blank list."
            stateName="empty — no attempts yet"
            stateWhy="attempts=[] with isEmpty=true, loading already finished, so the drawer shows the standard empty message instead of a bare list."
            stateCode={`<PersonalProjectTaskAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[]}
  isEmpty
/>`}
        />
    ),
}

/** Error: the attempts fetch failed — beats loading/empty per AsyncContent's priority order. */
export const ErrorState: Story = {
    render: () => (
        <ControlledDrawer
            error={new Error("network")}
            annotate={ANNOTATE_ERROR}
            leaf="AttemptsDrawer"
            reason="A truthy error (paired with errorContent) wins over loading/empty per AsyncContent's fixed priority, and the retry button forwards to the caller's onRetry (Rule 7 — this block never decides what retrying does, only reports the press)."
            stateName="error — failed to load, retry offered"
            stateWhy="error is truthy and retryLabel is set, so the error message renders with a retry button instead of the list."
            stateCode={`<PersonalProjectTaskAttemptsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  attempts={[]}
  error={fetchError}
  onRetry={refetch}
  retryLabel="Retry"
/>`}
        />
    ),
}
