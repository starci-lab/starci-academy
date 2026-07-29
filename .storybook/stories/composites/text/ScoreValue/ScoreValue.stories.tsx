import type { Meta, StoryObj } from "@storybook/nextjs"
import { ScoreValue } from "@sb-components/composites/text/ScoreValue/ScoreValue"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — "N điểm", the free-form point value a grading row is worth. Renders as
 * accent TEXT, never a `Chip` (§2a: a point count has no closed set of values, so it is
 * not a chip-shaped enum). See the component's own file header for the §2d neo this
 * composite exists to close — two blocks used to render the same info-type as two
 * different elements before this became the single owner of the shape.
 */
const meta: Meta<typeof ScoreValue> = {
    title: "Composites/Texts/ScoreValue",
    component: ScoreValue,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof ScoreValue>

/** LEAF — the only leaf: a live number, or its skeleton mirror. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ScoreValue"
                tier="composite"
                leaf="Default"
                reason="Pure text, no structure to vary — every call site is the same accent `Typography` reading a different number, so one leaf covers the whole component."
                states={[
                    {
                        name: "points = 40",
                        why: "The row renders as accent-coloured text reading the points plus a unit word, sized to sit as a trailing value beside a dense row's title. Tabular numerals keep a column of these lining up when several rows sit stacked.",
                        code: "<ScoreValue points={40} />",
                        render: <ScoreValue points={40} anatPart="ScoreValue" />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The text becomes a shimmer bar at the same trailing position, sized to the resting width of a typical point count so the row's own width does not jump once the real number lands.",
                        code: "<ScoreValue points={0} isSkeleton />",
                        render: <ScoreValue points={0} isSkeleton anatPart="ScoreValue" />,
                    },
                ]}
            />
        </div>
    ),
}
