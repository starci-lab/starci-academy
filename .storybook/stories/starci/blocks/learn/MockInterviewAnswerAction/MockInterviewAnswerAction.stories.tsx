import type { Meta, StoryObj } from "@storybook/nextjs"
import { MockInterviewAnswerAction } from "@sb-components/starci/blocks/learn/MockInterviewAnswerAction/MockInterviewAnswerAction"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `MockInterviewAnswerAction`: the one control that submits the
 * candidate's current answer and moves the live interview forward.
 *
 * ⭐ WHY THIS BLOCK EXISTS AT ALL — see the component's own file header. The
 * real `src` screen renders this as a bare `Button`; the design-system
 * screen tier is not allowed to import an atom directly, so this one-node
 * block exists to hold the decision (`isLastQuestion`) and the wording that
 * `Button` alone cannot own.
 *
 * 📐 ONE LEAF — a single control, no structural fork. `isLastQuestion` /
 * `isDisabled` / `isPending` each flip the SAME button's label/press-ability,
 * never its shape, so every combination below is a STATE of one leaf —
 * mirroring `MindMapContinueButton`'s own resume-pill leaf.
 */
const meta: Meta<typeof MockInterviewAnswerAction> = {
    title: "StarCi/Blocks/Learn/MockInterviewAnswerAction/MockInterviewAnswerAction",
    component: MockInterviewAnswerAction,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MockInterviewAnswerAction>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": { tier: "atom", role: "the one submit action — label and press-ability both come from this block's own decision, never a caller-supplied string", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the submit action, mid-run vs. the run's last question, and its disabled/pending states. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MockInterviewAnswerAction"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "mid-run, answer ready to send",
                        why: "This is not the last question, so the label reads \"answer & continue\" — the candidate expects another question to follow.",
                        code: `<MockInterviewAnswerAction
    isLastQuestion={false}
    onSubmit={submit}
/>`,
                        render: (
                            <MockInterviewAnswerAction

                               
                                isLastQuestion={false}
                                onSubmit={() => {}}
                            />
                        ),
                    },
                    {
                        name: "the run's last question",
                        why: "isLastQuestion swaps the label's second half to \"& finish\" — the block owns this wording itself (§14d.1), so the candidate knows this press ends the run rather than drawing another question.",
                        code: `<MockInterviewAnswerAction
    isLastQuestion
    onSubmit={submit}
/>`,
                        render: (
                            <MockInterviewAnswerAction
                                isLastQuestion
                                onSubmit={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isDisabled = true (blank answer, or the interviewer is mid-turn)",
                        why: "The caller resolves this — an empty transcript, or the interviewer still streaming its question — this block never re-derives it from an answer value it does not track (rule 7).",
                        code: `<MockInterviewAnswerAction
    isLastQuestion={false}
    onSubmit={submit}
    isDisabled
/>`,
                        render: (
                            <MockInterviewAnswerAction
                                isLastQuestion={false}
                                onSubmit={() => {}}
                                isDisabled
                            />
                        ),
                    },
                    {
                        name: "isPending = true (grading/asking in flight)",
                        why: "The press already fired and the next turn is in flight — the button shows its own busy affordance rather than staying pressable a second time.",
                        code: `<MockInterviewAnswerAction
    isLastQuestion={false}
    onSubmit={submit}
    isPending
/>`,
                        render: (
                            <MockInterviewAnswerAction
                                isLastQuestion={false}
                                onSubmit={() => {}}
                                isPending
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
