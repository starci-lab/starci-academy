import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ReactionPicker } from "@sb-components/atoms/feedback/ReactionPicker/ReactionPicker"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `ReactionPicker`: a row of image buttons, each scaling up and lifting
 * with its name floating above on hover, staggered pop-in on mount. Genuinely
 * generic — no "reaction"/"lesson" domain knowledge, only `items`/`activeKey`/
 * `onSelect`. Real consumer: `ContentReaction` (block), which supplies the six
 * emotion images.
 */
const meta: Meta<typeof ReactionPicker> = {
    title: "Atoms/Feedback/ReactionPicker/ReactionPicker",
    component: ReactionPicker,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ReactionPicker>

const ITEMS = [
    { key: "like", imgSrc: "/reactions/like.svg", label: "Like" },
    { key: "love", imgSrc: "/reactions/love.svg", label: "Love" },
    { key: "haha", imgSrc: "/reactions/haha.svg", label: "Haha" },
    { key: "wow", imgSrc: "/reactions/wow.svg", label: "Wow" },
    { key: "sad", imgSrc: "/reactions/sad.svg", label: "Sad" },
    { key: "angry", imgSrc: "/reactions/angry.svg", label: "Angry" },
]

/** Props for the {@link Controlled} demo wrapper below. */
interface ControlledProps {
    initialActive: string | null
}

/** Controlled wrapper — picking an item toggles it active. */
const Controlled = ({ initialActive }: ControlledProps) => {
    const [active, setActive] = useState<string | null>(initialActive)
    return (
        <ReactionPicker
            items={ITEMS}
            activeKey={active}
            onSelect={(key) => setActive((prev) => (prev === key ? null : key))}
        />
    )
}

/** LEAF — the six-item row, at rest and with one active. Hover an item to see the float+scale. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="ReactionPicker"
                tier="atom"
                leaf="Default"
                parts={[]}
                states={[
                    {
                        name: "activeKey = null",
                        why: "Nobody picked yet — no item carries the tinted background. Hover any item to see it lift, scale up, and float its name above.",
                        code: "<ReactionPicker items={items} activeKey={null} onSelect={pick} />",
                        render: <Controlled initialActive={null} />,
                    },
                    {
                        name: "activeKey = 'love'",
                        why: "The picked item carries a tinted circle behind it — the same signal `aria-pressed` reports to assistive tech.",
                        code: "<ReactionPicker items={items} activeKey=\"love\" onSelect={pick} />",
                        render: <Controlled initialActive="love" />,
                    },
                ]}
            />
        </div>
    ),
}
