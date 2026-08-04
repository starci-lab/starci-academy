import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuizSetup } from "@sb-components/starci/blocks/learn/QuizSetup/QuizSetup"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `QuizSetup` — choose the shape of a drill (length, seniority, name), then start
 * it. The block owns the domain wording and the lengths behind it: the learner
 * picks "quick" or "deep" and the block turns that into 5 or 10 cards, saying so on
 * the button. A run already in progress takes priority — the resume strip leads the
 * card above the form. A failed draw is reported next to the button that failed.
 */
const meta: Meta<typeof QuizSetup> = {
    title: "StarCi/Blocks/Learn/QuizSetup/QuizSetup",
    component: QuizSetup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuizSetup>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the one card face the whole setup form sits inside", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "vertical rhythm between the name/length/level fields and the action row, or a field's own label-over-control pair", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the trailing action row holding the start button", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "each field's own label line", storyId: "atoms-text-typography-typography--overview" },
    "InputText": { tier: "atom", role: "the run name field", storyId: "atoms-forms-input-inputtext--default" },
    "ButtonRadioGroup": { tier: "composite", role: "the length and seniority pickers — same composite, different item sets", storyId: "composites-buttons-buttonradiogroup--default" },
    "Callout": { tier: "composite", role: "the resume strip above the form, or the draw-failed message beside the start button", storyId: "composites-feedback-callout--default" },
    "Button": { tier: "atom", role: "the start action, worded with the card count the chosen length maps to", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — a fresh setup, no run left unfinished. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizSetup"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="The BLOCK owns the length→card-count mapping (`quick` = 5, `deep` = 10) and says so right on the start button, rather than leaving the caller to spell out a number that belongs to this block's own judgement."
                states={[
                    {
                        name: "resumable = undefined",
                        why: "Name, length, and level fields lead the card, with the start button worded from the chosen length. Nothing sits above the form because there is no run left to pick back up.",
                        code: `<QuizSetup
    label="Set up session"
    name={name}
    onNameChange={setName}
    length="quick"
    onLengthChange={setLength}
    level="middle"
    onLevelChange={setLevel}
    onStart={start}
/>`,
                        render: (
                            <QuizSetup
                                label="Set up session"
                                name="Review Docker before the interview"
                                onNameChange={() => {}}
                                length="quick"
                                onLengthChange={() => {}}
                                level="middle"
                                onLevelChange={() => {}}
                                onStart={() => {}}
                            />
                        ),
                    },
                    {
                        name: "length = \"deep\"",
                        why: "Picking the other length swaps the card count the start button advertises — the same form, the same fields, only the judgement behind the button's own wording changes.",
                        code: `<QuizSetup … length="deep" />`,
                        render: (
                            <QuizSetup
                                label="Set up session"
                                name="Review Docker before the interview"
                                onNameChange={() => {}}
                                length="deep"
                                onLengthChange={() => {}}
                                level="senior"
                                onLevelChange={() => {}}
                                onStart={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a run was left unfinished: the resume strip leads the card, above the form. */
export const Resumable: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizSetup"
                tier="block"
                leaf="Resumable"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "resumable set",
                        why: "A learner who left mid-run almost always means to come back — making them scroll past a start button to find their own session is how one run gets abandoned twice, so the resume strip takes priority above the fresh-setup form rather than sitting beside or below it.",
                        code: `<QuizSetup
    label="Set up session"
    …
    resumable={{
        name: "Kubernetes review",
        answered: 3,
        total: 5,
        onResume: resume,
    }}
/>`,
                        render: (
                            <QuizSetup
                                label="Set up session"
                                name=""
                                onNameChange={() => {}}
                                length="quick"
                                onLengthChange={() => {}}
                                level="middle"
                                onLevelChange={() => {}}
                                onStart={() => {}}
                                resumable={{ name: "Kubernetes review", answered: 3, total: 5, onResume: () => {} }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the draw failed: the error rides WITH the action that failed, not at the top of the card. */
export const DrawFailed: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizSetup"
                tier="block"
                leaf="Draw failed"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "errorMessage set, isPending = false",
                        why: "The error sits directly above the start button that produced it — at the top of the card it would read as a problem with the whole form instead of with the one action that just failed.",
                        code: `<QuizSetup
    label="Set up session"
    …
    errorMessage="Couldn't draw questions — try again."
/>`,
                        render: (
                            <QuizSetup
                                label="Set up session"
                                name="Review Docker before the interview"
                                onNameChange={() => {}}
                                length="quick"
                                onLengthChange={() => {}}
                                level="middle"
                                onLevelChange={() => {}}
                                onStart={() => {}}
                                errorMessage="Couldn't draw questions — try again."
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the card mirrors its own eventual shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizSetup"
                tier="block"
                leaf="Loading"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every field and the start button shimmer in the exact card shape they will hold once the setup data (or a resumable run) has loaded.",
                        code: `<QuizSetup label="Set up session" name="" length="quick" level="middle" isSkeleton />`,
                        render: (
                            <QuizSetup
                                label="Set up session"
                                name=""
                                onNameChange={() => {}}
                                length="quick"
                                onLengthChange={() => {}}
                                level="middle"
                                onLevelChange={() => {}}
                                onStart={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
