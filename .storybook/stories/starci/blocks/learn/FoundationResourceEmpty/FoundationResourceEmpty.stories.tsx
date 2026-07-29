import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationResourceEmpty } from "@sb-components/starci/blocks/learn/FoundationResourceEmpty/FoundationResourceEmpty"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FoundationResourceEmpty`: the message shown when a foundation
 * resource id resolved to nothing.
 *
 * ⭐ WHY THIS BLOCK EXISTS AT ALL — see the component's own file header.
 * `FoundationResourcePage`'s `isEmpty` branch replaces only the identity +
 * body pair, not the whole screen, so the screen tier cannot reach for
 * `AsyncContentEmpty` directly; this one-node block holds it instead.
 *
 * 📐 ONE LEAF — a single fixed message, no structural fork and no props to
 * vary it by.
 */
const meta: Meta<typeof FoundationResourceEmpty> = {
    title: "StarCi/Blocks/Learn/FoundationResourceEmpty/FoundationResourceEmpty",
    component: FoundationResourceEmpty,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationResourceEmpty>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "AsyncContentEmpty": { tier: "composite", role: "the empty-message frame — wording is fixed, this block owns its own copy", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
}

/** LEAF — the resource id resolved to nothing. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FoundationResourceEmpty"
                tier="block"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "resource id resolved to nothing",
                        why: "A stale link or a removed resource — one honest empty message instead of a blank card or a dangling title. This block owns the copy itself; the caller passes no title/description in.",
                        code: "<FoundationResourceEmpty />",
                        render: (
                            <FoundationResourceEmpty
                                anatPart="FoundationResourceEmpty"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
