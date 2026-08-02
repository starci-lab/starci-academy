import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlashcardModeSwitch } from "@sb-components/starci/blocks/learn/FlashcardModeSwitch/FlashcardModeSwitch"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FlashcardModeSwitch` — study the deck, or drill yourself. Same shape as
 * `ContentModeNav` (a row, a `Tabs` atom, no skeleton) but owns a different
 * vocabulary: practice modes rather than reading modes. The screen stops
 * rendering it once a session starts, since a mid-session switch would throw the
 * run away. Selected mode is data — one leaf, two states; there is no skeleton
 * prop.
 */
const meta: Meta<typeof FlashcardModeSwitch> = {
    title: "StarCi/Blocks/Learn/FlashcardModeSwitch/FlashcardModeSwitch",
    component: FlashcardModeSwitch,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FlashcardModeSwitch>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Tabs": { tier: "atom", role: "the tab row itself, owning the trigger shape, the selected indicator and the keyboard behaviour; the block only decides which two modes exist and what they are called", storyId: "atoms-navigation-tabs-tabs--default" },
}

/** LEAF — the two ways to work a deck. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardModeSwitch"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "mode = study",
                        why: "The learner is working through the deck card by card, so the study tab holds the indicator. This is where the pane opens, because reading the cards comes before being tested on them.",
                        code: `<FlashcardModeSwitch
    ariaLabel="Flashcard mode"
    mode="study"
    onModeChange={goMode}
/>`,
                        render: (
                            <FlashcardModeSwitch

                               
                                ariaLabel="Flashcard mode"
                                mode="study"
                                onModeChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "mode = quiz",
                        why: "The indicator has moved to the drill tab and nothing else about the row changes. Selection is the only thing this block tracks, so it is worth seeing that moving it disturbs no width around it.",
                        code: `<FlashcardModeSwitch
    ariaLabel="Flashcard mode"
    mode="quiz"
    onModeChange={goMode}
/>`,
                        render: (
                            <FlashcardModeSwitch
                                ariaLabel="Flashcard mode"
                                mode="quiz"
                                onModeChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
