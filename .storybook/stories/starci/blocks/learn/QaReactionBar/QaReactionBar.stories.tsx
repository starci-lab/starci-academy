import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { QaReactionBar, type QaReactionType } from "@sb-components/starci/blocks/learn/QaReactionBar/QaReactionBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `QaReactionBar`: the like-and-count control under a message
 * bubble. Renders one heart toggle rather than the full six-reaction picker
 * — see the component's own file header for why.
 */
const meta: Meta<typeof QaReactionBar> = {
    title: "StarCi/Blocks/Learn/QaReactionBar/QaReactionBar",
    component: QaReactionBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QaReactionBar>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": { tier: "atom", role: "the reaction count, omitted entirely at zero", storyId: "atoms-text-typography-typography--plain" },
}

/** Props for the `Controlled` demo wrapper below. */
interface ControlledProps {
    initialCount: number
    initialReaction: QaReactionType | null
}

/** Controlled wrapper so pressing the toggle visibly flips the state in the story. */
const Controlled = ({ initialCount, initialReaction }: ControlledProps) => {
    const [state, setState] = useState({ count: initialCount, myReaction: initialReaction })
    return (
        <QaReactionBar
            showAnatomy
            anatPart="QaReactionBar"
            count={state.count}
            myReaction={state.myReaction}
            onReact={(type) => setState((prev) => ({
                count: Math.max(0, prev.count + ((type != null ? 1 : 0) - (prev.myReaction != null ? 1 : 0))),
                myReaction: type,
            }))}
        />
    )
}

/** LEAF — the toggle's two data conditions: not-yet-reacted vs already-reacted. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-4 p-8">
            <BlockAnatomy
                name="QaReactionBar"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "myReaction = null, count = 4",
                        why: "The viewer hasn't reacted yet — the heart renders outline, and the count reads as an established fact from other participants.",
                        code: "<QaReactionBar count={4} myReaction={null} onReact={react} />",
                        render: <Controlled initialCount={4} initialReaction={null} />,
                    },
                    {
                        name: "myReaction = 'like', count = 5",
                        why: "The viewer already reacted — the heart fills and tints, and pressing it again clears the reaction (count drops back to 4).",
                        code: "<QaReactionBar count={5} myReaction=\"like\" onReact={react} />",
                        render: <Controlled initialCount={5} initialReaction="like" />,
                    },
                    {
                        name: "count = 0",
                        why: "Nobody has reacted at all — the count number is omitted entirely rather than showing a bare \"0\", so the row reads as empty, not broken.",
                        code: "<QaReactionBar count={0} myReaction={null} onReact={react} />",
                        render: <Controlled initialCount={0} initialReaction={null} />,
                    },
                ]}
            />
        </div>
    ),
}
