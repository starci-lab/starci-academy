import type { Meta, StoryObj } from "@storybook/nextjs"
import { SubmissionFindingsList, type SubmissionFinding } from "@sb-components/starci/blocks/learn/SubmissionFindingsList/SubmissionFindingsList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SubmissionFindingsList` — "Feedback": one accordion row per quality-gate finding
 * on a graded attempt — severity icon + plain-text message (backtick code only) +
 * location chip in the trigger; markdown detail, a linked file location, and a
 * markdown suggestion in the panel. The frame is `SurfaceCard.Accordion` end to end;
 * the block supplies the domain (severity → icon/tone/sort-rank, the high→low sort,
 * the repo-URL → file-link builder). Loading, empty, error, and populated are all
 * states of the one accordion card, routed through its own `isSkeleton`/`emptyState`
 * axes.
 */
const meta: Meta<typeof SubmissionFindingsList> = {
    title: "StarCi/Blocks/Learn/SubmissionFindingsList/SubmissionFindingsList",
    component: SubmissionFindingsList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SubmissionFindingsList>

const REPOSITORY_URL = "https://github.com/starci-academy/challenge-submissions.git"

// Deliberately UNSORTED (medium → high → high → low) so the "populated" state
// shows the block re-sorting on its own — a caller never has to pre-sort.
const FINDINGS: Array<SubmissionFinding> = [
    {
        id: "index-missing",
        severity: "medium",
        message: "Missing index on column `user_id` in table `submissions`",
        detail: "Queries filtering by `user_id` are doing a full table scan — this gets slower as the number of submissions grows.",
        suggestion: "Add `CREATE INDEX idx_submissions_user_id ON submissions(user_id);` in the next migration.",
        location: "src/db/migrations/002_submissions.sql",
        sortIndex: 0,
    },
    {
        id: "jwt-missing",
        severity: "high",
        message: "Endpoint `/api/submit` doesn't verify the JWT before writing to the DB",
        detail: "Any request can write a submission on someone else's behalf if it knows their `userId` ahead of time.",
        suggestion: "Wrap the route with `requireAuth` middleware and cross-check `req.user.id` against the payload before writing.",
        location: "src/routes/submit.ts",
        sortIndex: 0,
    },
    {
        id: "race-condition",
        severity: "high",
        message: "Two simultaneous submission requests can overwrite each other's score",
        detail: "There's no optimistic lock (`version`) on the `submission` record, so whichever request finishes processing last always wins, regardless of which score is higher.",
        suggestion: "Add a `version` column and check `WHERE version = :expected` on UPDATE.",
        sortIndex: 1,
    },
    {
        id: "naming",
        severity: "low",
        message: "Variable `tempResult` is not descriptively named",
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardAccordion": { tier: "composite", role: "the bounded card frame — one collapsible row per finding, self-mirroring while loading and self-hosting the empty/error message, so this block never owns a second frame", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "StackH": { tier: "frame", role: "the panel's location/suggestion rows — an icon or link as a MARK attached to its label, `tight`", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the panel's own track holding detail, location and suggestion as peer facts about one finding", storyId: "frames-stack-stackv--default" },
    "MarkdownContent": { tier: "composite", role: "the panel's detail/suggestion — rendered faithfully rather than as plain text (the trigger's own message stays plain, see file header)", storyId: "composites-viewers-markdowncontent--compact" },
    "SeverityIcon": { tier: "heroui", role: "the trigger's severity mark, riding in `titleStart` — its own tone colour, independent of the message text" },
    "Chip": { tier: "atom", role: "the finding's file location, riding in the trigger's trailing slot", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "the location line's plain text, or the underlined link when the location resolves to a real href", storyId: "atoms-text-typography-typography--overview" },
    "AsyncContentEmpty": { tier: "composite", role: "the no-findings message, hosted inside the accordion's own `emptyState` slot", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
    "AsyncContentError": { tier: "composite", role: "the failed-fetch message with a retry action, hosted inside the same `emptyState` slot", storyId: "composites-async-asynccontent-asynccontenterror--with-retry" },
}

/** LEAF — the findings card: loading → empty → error → populated (severity-sorted). */
export const FindingsAccordion: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SubmissionFindingsList"
                tier="block"
                leaf="FindingsAccordion"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The list's own fetch is in flight, so the card draws its own self-mirror — same frame, same trigger-row shape — rather than collapsing to nothing. A parent-forced `isSkeleton` paint fires the exact same branch.",
                        code: `<SubmissionFindingsList
    findings={[]}
    label="Feedback"
    isLoading
/>`,
                        render: (
                            <SubmissionFindingsList

                               
                                findings={[]}
                                label="Feedback"
                                isLoading
                            />
                        ),
                    },
                    {
                        name: "isEmpty = true",
                        why: "The grading pass came back clean, so the card shows one message inside its own frame instead of an empty accordion that reads as broken chrome.",
                        code: `<SubmissionFindingsList
    findings={[]}
    label="Feedback"
    isEmpty
/>`,
                        render: (
                            <SubmissionFindingsList
                                findings={[]}
                                label="Feedback"
                                isEmpty
                            />
                        ),
                    },
                    {
                        name: "error set, retry paired",
                        why: "The fetch failed, which outranks even a stale loading flag — the reader sees why nothing is listed and a way to try again, staying inside the same bounded card rather than the whole section vanishing.",
                        code: `<SubmissionFindingsList
    findings={[]}
    label="Feedback"
    error={fetchError}
    onRetry={retry}
    retryLabel="Retry"
/>`,
                        render: (
                            <SubmissionFindingsList
                                findings={[]}
                                label="Feedback"
                                error={new Error("network")}
                                onRetry={() => {}}
                                retryLabel="Retry"
                            />
                        ),
                    },
                    {
                        name: "findings.length = 4, severity-sorted",
                        why: "Four findings land in medium/high/high/low order, and the card re-sorts them itself: both `high` rows surface first (tie-broken by `sortIndex`), then the `medium`, then the `low` — a caller never has to pre-sort what it hands in. The `race-condition` row also shows a finding with no `location`, and `naming` shows one with no `detail`/`suggestion` at all.",
                        code: `<SubmissionFindingsList
    findings={findings}
    repositoryUrl="https://github.com/starci-academy/challenge-submissions.git"
    label="Feedback"
/>`,
                        render: (
                            <SubmissionFindingsList
                                findings={FINDINGS}
                                repositoryUrl={REPOSITORY_URL}
                                label="Feedback"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
