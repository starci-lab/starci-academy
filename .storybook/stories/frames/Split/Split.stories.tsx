import type { Meta, StoryObj } from "@storybook/nextjs"
import { Split } from "@sb-components/frames/Split/Split"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `Split` is a LEFT ↔ RIGHT row FRAME. The state it produces is
 * the relationship BETWEEN THE TWO NAMED SIDES: the seam `gap`, the cross-axis
 * alignment `align`. No `wrap`/`justify` — `justify-between` is this frame's
 * DEFINITION, not an option; a row with many items should use `StackH`/`Cluster`
 * instead.
 */
const meta: Meta<typeof Split> = {
    title: "Frames/Split/Split",
    component: Split,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Split>

const lessonMeta = (
    <>
        <Typography size="sm" text="Lesson 4 — Consistent Hashing" weight="medium" />
        <Typography size="xs" text="18 minutes left · 3 challenges" color="muted" />
    </>
)

// No `Start`/`End` anatomy nodes: the two sides are CALLER slots — whatever they
// wrap belongs to whoever passed it in (`Typography`, `Button`, a `StackV`…), not to
// this frame's own anatomy, and no component sits behind either name for a reader to click
// through to. The `reason` prose below already explains the min-w-0/shrink-0 split in words.

/** Default — a label on the left, an action on the right: the row used at 43 spots across the app. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Split"
                tier="frame"
                leaf="Default"
                reason="Not a `StackH justify=between`: this is TWO NAMED sides with different width strategies, `start` can shrink and truncate, `end` cannot. Naming both sides enforces that rule in ONE place instead of at 43 call sites, and because the two slots already have names, the frame takes no `children` (§13b)."
                states={[
                    {
                        name: "a name and the action on it",
                        why: "Start carries a truncating label on the left and End carries a button pinned to the right, with a `gap={4}` seam between them because the two are separate things a reader treats separately. This is the shape used at roughly 43 call sites in the app for a row that pairs a name with its action.",
                        code: `<Split
  gap={4}
  start={<Typography size="sm" text="System Design course" weight="medium" />}
  end={<Button label="Continue" size="sm" />}
/>`,
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split
                                    gap={4}
                                    start={<Typography size="sm" text="System Design course" weight="medium" truncate />}
                                    end={<Button label="Continue" size="sm" />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Align — alignment on the CROSS axis (the row's vertical direction), legible
 * whenever the two sides DIFFER in height. `stretch` pulls both to the row's
 * full height.
 */
export const Align: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Split"
                tier="frame"
                leaf="Align"
                reason="The fixture deliberately mismatches height, the left side carries two lines while the right side is one button, so the cross-axis alignment actually reads on screen."
                states={[
                    {
                        name: "align = \"center\" (default)",
                        why: "Start and End sit centred on the row's cross axis, the button lining up with the middle of the two-line text block beside it. This is the standard alignment for a split row, used whenever the two sides don't need special vertical treatment.",
                        code: `<Split
  gap={4}
  align="center"
  start={…}
  end={…}
/>`,
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split
                                    gap={4}
                                    align="center"
                                    start={<StackV gap={1} items={[() => lessonMeta]} />}
                                    end={<Button label="Study" size="sm" />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "align = \"start\"",
                        why: "Start and End both pin to the top of the row instead of centring. This is for a left side carrying a long block of text, where centring the button against a growing block would keep moving it around.",
                        code: `<Split
  gap={4}
  align="start"
  start={…}
  end={…}
/>`,
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split
                                    gap={4}
                                    align="start"
                                    start={<StackV gap={1} items={[() => lessonMeta]} />}
                                    end={<Button label="Study" size="sm" />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "align = \"end\"",
                        why: "Start and End both pin to the bottom of the row instead of centring. This is for a case where the trailing side should line up with the last line of a taller leading block, such as a footnote sitting under a paragraph.",
                        code: `<Split
  gap={4}
  align="end"
  start={…}
  end={…}
/>`,
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split
                                    gap={4}
                                    align="end"
                                    start={<StackV gap={1} items={[() => lessonMeta]} />}
                                    end={<Button label="Study" size="sm" />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "align = \"stretch\"",
                        why: "Both Start and End are pulled to the full height of the row instead of sizing to their own content. This is for when the End side is something like a full-height divider or button that should always match the tallest side.",
                        code: `<Split
  gap={4}
  align="stretch"
  start={…}
  end={…}
/>`,
                        render: (
                            <div data-tier="fixture" className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split
                                    gap={4}
                                    align="stretch"
                                    start={<StackV gap={1} items={[() => lessonMeta]} />}
                                    end={<Button label="Study" size="sm" />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
