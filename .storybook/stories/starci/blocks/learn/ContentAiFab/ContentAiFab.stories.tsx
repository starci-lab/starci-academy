import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentAiFab } from "@sb-components/starci/blocks/learn/ContentAiFab/ContentAiFab"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentAiFab`: the floating "ask StarCi AI" trigger mounted once by
 * `learn/layout.tsx`, bottom-right over every `/learn/**` route. Composes the
 * existing `FloatingActionButton` composite untouched — this block only fixes
 * the icon + accessible name and decides when the trigger should hide.
 *
 * ⭐ ONE LEAF (§14d.2). The button never changes shape — `isOpen` only decides
 * WHETHER it renders at all, not what it looks like while visible, so
 * "visible" and "hidden" are one leaf with two states, not two leaves.
 *
 * ⛔ No `isSkeleton` prop, on purpose (see file header): this is static layout
 * chrome, not data-driven — there is nothing to shimmer while loading.
 */
const meta: Meta<typeof ContentAiFab> = {
    title: "StarCi/Blocks/Learn/ContentAiFab/ContentAiFab",
    component: ContentAiFab,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentAiFab>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "FloatingActionButton": { tier: "composite", role: "the round, shadowed accent circle that owns fixed placement and icon-only press affordance — this block only supplies the sparkle icon and the fixed accessible name", storyId: "composites-buttons-floatingactionbutton--default" },
}

/** LEAF — the floating trigger. `isOpen` decides whether it renders at all. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="relative h-64 rounded-2xl bg-default-100 p-8">
            <BlockAnatomy
                name="ContentAiFab"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="absolute bottom-8 right-8"
                states={[
                    {
                        name: "isOpen = false (visible)",
                        why: "The AI chat panel is closed, so the trigger floats bottom-right, ready to open it. This is what every learn route shows by default.",
                        code: "<ContentAiFab onOpen={handleOpen} isOpen={false} />",
                        render: (
                            <ContentAiFab
                                anatPart="ContentAiFab"
                                showAnatomy
                                onOpen={() => {}}
                                isOpen={false}
                            />
                        ),
                    },
                    {
                        name: "isOpen = true (hidden)",
                        why: "The rail-mode chat panel this button opens is already up, so a second floating trigger on top of it would be redundant chrome — the block renders nothing rather than a disabled/dimmed button.",
                        code: "<ContentAiFab onOpen={handleOpen} isOpen={true} />",
                        render: (
                            <ContentAiFab
                                onOpen={() => {}}
                                isOpen={true}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
