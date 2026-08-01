import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentAiSelectionAsk } from "@sb-components/starci/blocks/learn/ContentAiSelectionAsk/ContentAiSelectionAsk"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentAiSelectionAsk`: the "Ask AI" pill that pops up next to a
 * text selection inside lesson content.
 *
 * ⭐ SCOPE CUT: selection-tracking + portal-positioning is pure DOM behaviour
 * with no reusable presentational surface, so it stays out of this block (see
 * the component file header). The story fixes `anchor` to a demo point inside
 * the canvas instead of driving a real `window.getSelection()`.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): `isNew` is DATA (whether the "New" chip shows
 * up next to the pill), not a structural difference ⇒ one leaf, two states.
 */
const meta: Meta<typeof ContentAiSelectionAsk> = {
    title: "StarCi/Blocks/Learn/ContentAiSelectionAsk/ContentAiSelectionAsk",
    component: ContentAiSelectionAsk,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentAiSelectionAsk>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": { tier: "atom", role: "the trigger itself, owning the pill shape, the press handler and the leading sparkle glyph; the block only decides the wording and where to plant it", storyId: "atoms-buttons-button-button--default" },
    "Chip": { tier: "atom", role: "the small 'New' badge riding next to the pill while the feature is new; the block only decides whether it shows", storyId: "atoms-chips-chip-chip--default" },
}

/** LEAF — the pill, with or without the "new feature" chip. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="relative h-[420px] p-8">
            <BlockAnatomy
                name="ContentAiSelectionAsk"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="relative h-full w-full"
                states={[
                    {
                        name: "isNew = false",
                        why: "The steady state, once readers already know the feature exists: just the pill, planted right above the point the reader finished selecting text.",
                        code: `<ContentAiSelectionAsk
    anchor={{ x: 220, y: 160 }}
    onOpen={openSideThread}
/>`,
                        render: (
                            <ContentAiSelectionAsk

                               
                                anchor={{ x: 220, y: 160 }}
                                onOpen={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isNew = true",
                        why: "Early releases carry a 'New' chip so a reader who has never used the feature notices it is there before they even select text a second time.",
                        code: `<ContentAiSelectionAsk
    anchor={{ x: 220, y: 160 }}
    isNew
    onOpen={openSideThread}
/>`,
                        render: (
                            <ContentAiSelectionAsk
                                anchor={{ x: 220, y: 160 }}
                                isNew
                                onOpen={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
