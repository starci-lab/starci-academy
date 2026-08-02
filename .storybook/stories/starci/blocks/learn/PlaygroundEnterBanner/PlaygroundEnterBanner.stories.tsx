import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundEnterBanner } from "@sb-components/starci/blocks/learn/PlaygroundEnterBanner/PlaygroundEnterBanner"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundEnterBanner` — the playground page's single primary decision card.
 * Reuses `FlashcardDueHero`'s card shape (`SurfaceCard` ⊃ `StackV` ⊃ status line +
 * primary `Button`). The block builds its own readiness sentence from `allReady` +
 * `pendingCount`. One shape: ready vs pending are data states — the swap only
 * changes the status text/color and the CTA's `isDisabled`.
 */
const meta: Meta<typeof PlaygroundEnterBanner> = {
    title: "StarCi/Blocks/Learn/PlaygroundEnterBanner/PlaygroundEnterBanner",
    component: PlaygroundEnterBanner,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundEnterBanner>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the labelled card frame carrying the whole decision, owning the section label and the surface face", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "StackV": { tier: "frame", role: "the vertical frame separating the readiness line from the CTA, owning the seam between the two", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "the readiness sentence the block builds itself from `allReady`/`pendingCount` — real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "Button": { tier: "atom", role: "the single primary CTA, disabled until `allReady` — real or its skeleton mirror", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the one card shape; ready vs pending vs loading are states inside it. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundEnterBanner"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "allReady = false, pendingCount = 2",
                        why: "Two prerequisite steps are still outstanding, so the status line reports that count in the block's own words and the CTA disables itself — there is nothing behind it to enter yet. This is the shape a learner sees the moment they land on the page before finishing the checklist.",
                        code: `<PlaygroundEnterBanner
    allReady={false}
    pendingCount={2}
    onEnter={handleEnter}
/>`,
                        render: (
                            <PlaygroundEnterBanner

                               
                                allReady={false}
                                pendingCount={2}
                                onEnter={() => {}}
                            />
                        ),
                    },
                    {
                        name: "allReady = true",
                        why: "Every step is done, so the status line switches to the ready sentence with the success accent and check icon, and the CTA becomes pressable. This is the moment the learner can finally act on the one decision the card exists to carry.",
                        code: `<PlaygroundEnterBanner
    allReady
    pendingCount={0}
    onEnter={handleEnter}
/>`,
                        render: (
                            <PlaygroundEnterBanner
                                allReady
                                pendingCount={0}
                                onEnter={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Before the checklist state is known, the status line and the CTA both shimmer in the exact box they will hand back once real data lands, so the card never jumps size when it resolves.",
                        code: `<PlaygroundEnterBanner
    allReady={false}
    pendingCount={0}
    onEnter={handleEnter}
    isSkeleton
/>`,
                        render: (
                            <PlaygroundEnterBanner
                                allReady={false}
                                pendingCount={0}
                                onEnter={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
