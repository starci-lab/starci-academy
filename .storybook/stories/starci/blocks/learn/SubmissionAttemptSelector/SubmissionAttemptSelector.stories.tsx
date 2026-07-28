import type { Meta, StoryObj } from "@storybook/nextjs"
import { SubmissionAttemptSelector, type SubmissionAttempt } from "@sb-components/starci/blocks/learn/SubmissionAttemptSelector/SubmissionAttemptSelector"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SubmissionAttemptSelector`: which GRADED ATTEMPT the reader is
 * looking at — a flex-wrap row of attempt buttons (verdict + "Lần N" + score)
 * plus an optional "+N" trigger for whatever holds the rest of the history.
 *
 * REUSE, NOT A NEW ROW: the SELECT chrome is `ButtonRadioGroup` (role="group",
 * aria-pressed, flex-wrap) and each button's content is a `Chip` (verdict icon
 * + tone + label) — the block only owns turning `{ attemptNumber, score,
 * isPassing }` into that composition, and the "+N" trigger is
 * `ButtonRadioGroup`'s own documented `trailing` slot, not an invented node.
 *
 * ⛔ Pressing "+N" only fires `onOverflowPress` — what it opens (a history
 * drawer, say) is a SCREEN decision, out of scope for this block.
 *
 * 📐 ONE LEAF (`AttemptRow`): every difference below — loading, empty, error,
 * few attempts, many attempts — is the SAME chip strip with different content,
 * never a different structure, so none of them earns its own leaf.
 */
const meta: Meta<typeof SubmissionAttemptSelector> = {
    title: "StarCi/Blocks/Learn/SubmissionAttemptSelector/SubmissionAttemptSelector",
    component: SubmissionAttemptSelector,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SubmissionAttemptSelector>

const FEW_ATTEMPTS: Array<SubmissionAttempt> = [
    { id: "attempt-1", attemptNumber: 1, score: 62, isPassing: false },
    { id: "attempt-2", attemptNumber: 2, score: 88, isPassing: true },
]

const MANY_ATTEMPTS: Array<SubmissionAttempt> = [
    { id: "attempt-1", attemptNumber: 1, score: 54, isPassing: false },
    { id: "attempt-2", attemptNumber: 2, score: 71, isPassing: false },
    { id: "attempt-3", attemptNumber: 3, score: 90, isPassing: true },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Chip": { tier: "atom", role: "the verdict glyph, `Lần N` and its score for ONE attempt — riding inside the select button rather than owning the press itself", storyId: "atoms-chips-chip-chip--default" },
    "Button": { tier: "atom", role: "either one attempt's select button (wrapping its `Chip`) or the trailing `+N` overflow trigger — both plain `Button`, told apart only by what they wrap", storyId: "atoms-buttons-button-button--default" },
    "Cluster": { tier: "frame", role: "the skeleton mirror's wrapping row, holding the same gap the real `ButtonRadioGroup` uses internally", storyId: "frames-cluster-cluster--default" },
    "AsyncContentEmpty": { tier: "composite", role: "the no-attempts message, replacing the strip entirely", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
    "AsyncContentError": { tier: "composite", role: "the failed-fetch message, with a retry action beside it", storyId: "composites-async-asynccontent-asynccontenterror--basic" },
}

/** LEAF — the chip strip: loading → empty → error → few attempts → many attempts. */
export const AttemptRow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SubmissionAttemptSelector"
                tier="block"
                leaf="AttemptRow"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The strip's own fetch is in flight, so it draws its skeleton mirror — pill-for-pill, no data — rather than collapsing to nothing. The same branch fires whether it's this widget's own loading flag or a parent forcing an all-skeleton first paint.",
                        code: `<SubmissionAttemptSelector
    attempts={[]}
    ariaLabel="Chọn lần làm"
    isLoading
    onSelect={select}
/>`,
                        render: (
                            <SubmissionAttemptSelector
                                anatPart="SubmissionAttemptSelector"
                                showAnatomy
                                attempts={[]}
                                ariaLabel="Chọn lần làm"
                                isLoading
                                onSelect={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isEmpty = true",
                        why: "No attempt exists yet, so the strip is replaced by a single message rather than an empty row that reads as broken chrome. This is the shape before the reader has submitted anything at all.",
                        code: `<SubmissionAttemptSelector
    attempts={[]}
    ariaLabel="Chọn lần làm"
    isEmpty
    onSelect={select}
/>`,
                        render: (
                            <SubmissionAttemptSelector
                                attempts={[]}
                                ariaLabel="Chọn lần làm"
                                isEmpty
                                onSelect={() => {}}
                            />
                        ),
                    },
                    {
                        name: "error set, retry paired",
                        why: "The fetch failed, which outranks every other branch (per `AsyncContent`'s own priority order) — the reader sees why nothing is listed and a way to try again, right where the strip would have been.",
                        code: `<SubmissionAttemptSelector
    attempts={[]}
    ariaLabel="Chọn lần làm"
    error={fetchError}
    onRetry={retry}
    retryLabel="Thử lại"
    onSelect={select}
/>`,
                        render: (
                            <SubmissionAttemptSelector
                                attempts={[]}
                                ariaLabel="Chọn lần làm"
                                error={new Error("network")}
                                onRetry={() => {}}
                                retryLabel="Thử lại"
                                onSelect={() => {}}
                            />
                        ),
                    },
                    {
                        name: "attempts.length = 2, overflowCount unset",
                        why: "Two attempts fit the row on their own, so there is nothing past the edge for a trigger to reach — no `trailing` node renders. Each button already says the whole story: pass/fail glyph, which run it was, and the score.",
                        code: `<SubmissionAttemptSelector
    attempts={attempts}
    selectedId="attempt-2"
    ariaLabel="Chọn lần làm"
    onSelect={select}
/>`,
                        render: (
                            <SubmissionAttemptSelector
                                attempts={FEW_ATTEMPTS}
                                selectedId="attempt-2"
                                ariaLabel="Chọn lần làm"
                                onSelect={() => {}}
                            />
                        ),
                    },
                    {
                        name: "attempts.length = 3, overflowCount = 4",
                        why: "More attempts sit past this row than the caller wants inline, so the '+N' trigger appears in `ButtonRadioGroup`'s own trailing slot. Pressing it only reports the press — where the rest of the history opens is a decision this block leaves to its caller.",
                        code: `<SubmissionAttemptSelector
    attempts={attempts}
    selectedId="attempt-3"
    ariaLabel="Chọn lần làm"
    overflowCount={4}
    onOverflowPress={openHistory}
    onSelect={select}
/>`,
                        render: (
                            <SubmissionAttemptSelector
                                attempts={MANY_ATTEMPTS}
                                selectedId="attempt-3"
                                ariaLabel="Chọn lần làm"
                                overflowCount={4}
                                onOverflowPress={() => {}}
                                onSelect={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
