import type { Meta, StoryObj } from "@storybook/nextjs"
import { WorkSessionHeader } from "@sb-components/starci/blocks/navigation/WorkSessionHeader/WorkSessionHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `WorkSessionHeader`: the band that says "you are inside a session".
 *
 * SHARED, not owned by one screen: quiz, flashcard review and mock interview all
 * run sessions, and what this block knows is what a SESSION is — a length, a
 * position, steps that can be graded, and two ways out.
 *
 * ⭐ TWO WAYS TO LEAVE, AND THEY ARE NOT THE SAME. The back link LEAVES and keeps
 * the run resumable; the finish button ENDS it and goes to results. Collapsing
 * them into one control would make one of the two silently destructive.
 *
 * ⭐ DONE AND CURRENT ARE INDEPENDENT SIGNALS. Filled means GRADED, taller means
 * VIEWING. Letting "done" win over "current" is exactly how "which step am I on"
 * disappears the moment the learner revisits a graded step — so `current` is a
 * taller bar and nothing else: no ring, no dot, no second colour. The
 * `RevisitingGraded` leaf below is the case that proves it.
 *
 * ⛔ NO `ReactNode` SLOT. The band takes typed data — a counter string, an
 * optional time-left string. A slot is how a caller starts putting its own
 * shapes into a shared band, and two callers then drift.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): losing the finish control, and losing the rail's
 * interactivity, each change the shape. Where the learner is, and which steps are
 * graded, are data ⇒ states.
 */
const meta: Meta<typeof WorkSessionHeader> = {
    title: "StarCi/Blocks/Navigation/WorkSessionHeader/WorkSessionHeader",
    component: WorkSessionHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof WorkSessionHeader>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "a horizontal frame — the top row of controls, or the rail whose segments it spaces on scale", storyId: "frames-stack-stackh--default" },
    "LinkBack": { tier: "atom", role: "the quiet way out that keeps the run resumable, owning its own caret and hover", storyId: "atoms-navigation-link-linkback--default" },
    "Typography": { tier: "atom", role: "one of the band's text slots — the session name, the position counter, or the tabular time left", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "the end-now control, deliberately a different weight from the back link because it ends the run rather than pausing it", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — a live run: both exits, a timer, and a tappable rail. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="WorkSessionHeader"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "current = 3, doneSteps = [1, 2]",
                        why: "The learner is on the third of ten steps with the first two graded, so two segments are filled and the third stands taller. The band carries both exits at once because leaving and finishing are different decisions, and the counter says where they are without them having to count the rail.",
                        code: `<WorkSessionHeader
    backLabel="Thoát"
    onBack={leave}
    title="Hỏi nhanh"
    counter="Câu 3 / 10"
    timeLeft="2:14"
    total={10}
    current={3}
    doneSteps={[1, 2]}
    onStepPress={goToStep}
    finishLabel="Kết thúc"
    onFinish={finish}
/>`,
                        render: (
                            <WorkSessionHeader
                                anatPart="WorkSessionHeader"
                                showAnatomy
                                backLabel="Thoát"
                                onBack={() => {}}
                                title="Hỏi nhanh"
                                counter="Câu 3 / 10"
                                timeLeft="2:14"
                                total={10}
                                current={3}
                                doneSteps={[1, 2]}
                                onStepPress={() => {}}
                                finishLabel="Kết thúc"
                                onFinish={() => {}}
                            />
                        ),
                    },
                    {
                        name: "current = 1, doneSteps = []",
                        why: "The run has just started: nothing is graded and the first segment is the only one standing taller. This is the shape that shows the rail reads as progress even when there is none yet.",
                        code: `<WorkSessionHeader
    backLabel="Thoát"
    onBack={leave}
    title="Hỏi nhanh"
    counter="Câu 1 / 10"
    total={10}
    current={1}
    onStepPress={goToStep}
    finishLabel="Kết thúc"
    onFinish={finish}
/>`,
                        render: (
                            <WorkSessionHeader
                                backLabel="Thoát"
                                onBack={() => {}}
                                title="Hỏi nhanh"
                                counter="Câu 1 / 10"
                                total={10}
                                current={1}
                                onStepPress={() => {}}
                                finishLabel="Kết thúc"
                                onFinish={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — ⭐ the case that PROVES done and current are independent. */
export const RevisitingGraded: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="WorkSessionHeader"
                tier="block"
                leaf="Revisiting a graded step"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "current = 2, doneSteps = [1, 2, 3, 4]",
                        why: "The learner has gone back to a step they already answered, so segment two is both filled and taller at the same time. If fill were allowed to win, this is the exact moment the position signal would vanish and the rail would stop answering which step is open.",
                        code: `<WorkSessionHeader
    backLabel="Thoát"
    onBack={leave}
    counter="Câu 2 / 10"
    total={10}
    current={2}
    doneSteps={[1, 2, 3, 4]}
    onStepPress={goToStep}
/>`,
                        render: (
                            <WorkSessionHeader
                                anatPart="WorkSessionHeader"
                                showAnatomy
                                backLabel="Thoát"
                                onBack={() => {}}
                                counter="Câu 2 / 10"
                                total={10}
                                current={2}
                                doneSteps={[1, 2, 3, 4]}
                                onStepPress={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a session with no early finish ⇒ **loses** the end-now control. */
export const NoFinish: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="WorkSessionHeader"
                tier="block"
                leaf="No finish"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "onFinish = undefined",
                        why: "This kind of run cannot be ended early, so the control is not drawn and leaving is the only exit. Rendering it disabled would keep offering an action the session never allows.",
                        code: `<WorkSessionHeader
    backLabel="Thoát"
    onBack={leave}
    title="Ôn tập"
    counter="Thẻ 4 / 12"
    total={12}
    current={4}
    doneSteps={[1, 2, 3]}
/>`,
                        render: (
                            <WorkSessionHeader
                                anatPart="WorkSessionHeader"
                                showAnatomy
                                backLabel="Thoát"
                                onBack={() => {}}
                                title="Ôn tập"
                                counter="Thẻ 4 / 12"
                                total={12}
                                current={4}
                                doneSteps={[1, 2, 3]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
