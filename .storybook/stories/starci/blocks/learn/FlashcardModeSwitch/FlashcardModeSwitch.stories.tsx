import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlashcardModeSwitch } from "@sb-components/starci/blocks/learn/FlashcardModeSwitch/FlashcardModeSwitch"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FlashcardModeSwitch`: study the deck, or drill yourself.
 *
 * ⚠️ NOT A DUPLICATE OF `ContentModeNav`, though the shape is identical — same
 * row, same `Tabs` atom, same deliberate absence of a skeleton. What differs is
 * the one thing a block at this tier OWNS: the VOCABULARY. One knows reading
 * modes, the other knows practice modes, and §14d.1 puts that ownership in the
 * block rather than at the caller. Folding them into one block taking a mode
 * list would hand the vocabulary of both screens back to their callers.
 *
 * Worth reading the two together before changing either. If a THIRD screen ever
 * needs a mode row, that is the moment to look for a shared frame underneath —
 * not now, on a sample of two.
 *
 * ⭐ IT DISAPPEARS ONCE A SESSION STARTS, and that is the SCREEN's call, not this
 * block's. Mid-session a mode switch would throw the run away, so the screen
 * stops rendering the row rather than disabling it: a disabled control still
 * says "you could do this", an absent one says the question is closed.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): which mode is selected is DATA ⇒ one leaf, two
 * states. There is no skeleton leaf because there is no skeleton prop.
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
        <div className="p-8">
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
    ariaLabel="Chế độ thẻ ghi nhớ"
    mode="study"
    onModeChange={goMode}
/>`,
                        render: (
                            <FlashcardModeSwitch
                                anatPart="FlashcardModeSwitch"
                                showAnatomy
                                ariaLabel="Chế độ thẻ ghi nhớ"
                                mode="study"
                                onModeChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "mode = quiz",
                        why: "The indicator has moved to the drill tab and nothing else about the row changes. Selection is the only thing this block tracks, so it is worth seeing that moving it disturbs no width around it.",
                        code: `<FlashcardModeSwitch
    ariaLabel="Chế độ thẻ ghi nhớ"
    mode="quiz"
    onModeChange={goMode}
/>`,
                        render: (
                            <FlashcardModeSwitch
                                ariaLabel="Chế độ thẻ ghi nhớ"
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
