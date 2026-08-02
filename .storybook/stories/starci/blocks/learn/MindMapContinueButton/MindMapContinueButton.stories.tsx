import type { Meta, StoryObj } from "@storybook/nextjs"
import { MindMapContinueButton } from "@sb-components/starci/blocks/learn/MindMapContinueButton/MindMapContinueButton"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MindMapContinueButton` — the single floating "what's next" action over the
 * course mind-map. `resumeHref` swaps the whole node from a pressable `Button`
 * (with arrow) to an inert `Typography` note — two different atoms — so "resume
 * available" and "all done" are separate shapes; `isSkeleton` is its own too. The
 * real component renders nothing for a guest whose progress has not resolved.
 */
const meta: Meta<typeof MindMapContinueButton> = {
    title: "StarCi/Blocks/Learn/MindMapContinueButton/MindMapContinueButton",
    component: MindMapContinueButton,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MindMapContinueButton>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": { tier: "atom", role: "the resume CTA — primary pill with a sliding arrow, the only pressable shape this block ever renders", storyId: "atoms-buttons-button-button--suffix-icon" },
    "Typography": { tier: "atom", role: "the quiet all-done note — inert text, no press handler wired to it at all", storyId: "atoms-text-typography-typography--colors" },
}

/** LEAF — a lesson/challenge is still waiting: the resume pill renders. */
export const ResumeAvailable: Story = {
    render: () => (
        <div data-tier="fixture" className="flex justify-center bg-default p-8">
            <BlockAnatomy
                name="MindMapContinueButton"
                tier="block"
                leaf="Resume available"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "resumeHref = /courses/devops/learn/optimizing-dockerfiles",
                        why: "`resumeHref` resolves to a real lesson, so the pill renders regardless of what `allContentDone` says — the href is the single source of truth for \"is there something to jump to\", exactly the precedence the real `src` component enforces.",
                        code: `<MindMapContinueButton
    resumeHref="/courses/devops/learn/optimizing-dockerfiles"
    allContentDone={false}
    continueAriaLabel="Go to the next content"
    onResume={onResume}
/>`,
                        render: (
                            <MindMapContinueButton

                               
                                resumeHref="/courses/devops/learn/optimizing-dockerfiles"
                                allContentDone={false}
                                continueAriaLabel="Go to the next content"
                                onResume={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — nothing left to resume: the pressable pill drops out, a quiet note takes its place. */
export const AllDone: Story = {
    render: () => (
        <div data-tier="fixture" className="flex justify-center bg-default p-8">
            <BlockAnatomy
                name="MindMapContinueButton"
                tier="block"
                leaf="All content done"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "resumeHref = null, allContentDone = true",
                        why: "With no href left to resolve, `allContentDone` decides the shape: a quiet confirmation note with no press handler at all, so there is no live control left over the canvas once there is genuinely nothing to jump to.",
                        code: `<MindMapContinueButton
    resumeHref={null}
    allContentDone
    continueAriaLabel="Go to the next content"
/>`,
                        render: (
                            <MindMapContinueButton

                               
                                resumeHref={null}
                                allContentDone
                                continueAriaLabel="Go to the next content"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, swapping the whole node for the resume pill's mirror. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="flex justify-center bg-default p-8">
            <BlockAnatomy
                name="MindMapContinueButton"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Loading doesn't know yet whether there is a lesson left to resume, so the shimmer always guesses the fuller resume pill rather than the quiet note — a returning learner mid-course hits that outcome far more often, and the shape does not jump once the real data lands.",
                        code: `<MindMapContinueButton
    resumeHref={null}
    allContentDone={false}
    continueAriaLabel="Go to the next content"
    isSkeleton
/>`,
                        render: (
                            <MindMapContinueButton

                               
                                resumeHref={null}
                                allContentDone={false}
                                continueAriaLabel="Go to the next content"
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
