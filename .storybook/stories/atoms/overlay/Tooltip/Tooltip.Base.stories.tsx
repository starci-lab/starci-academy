import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Tooltip.Base`: the ONE hover-hint atom, wrapping HeroUI Tooltip.
 *
 * Keeping `children` here is CORRECT (§12b, rationale documented in `Tooltip.tsx`'s own
 * header): the atom wrapper must wrap an arbitrary element so react-aria can attach
 * hover/focus/`aria-describedby` straight onto it. It shares the same PORTAL limitation
 * as Menu/Popover, `Content`/`Arrow` render into `body`, so `BlockAnatomy` (which walks
 * the ancestor chain inside the render box) can never reach them.
 *
 * NO `annotate`: the only DOM that stays INSIDE the render box is the Trigger, which is
 * the `children` the story passes in (`TriggerBox`, a demo span with no story of its
 * own). `Content`/`Arrow` portal outside, so they can never reach the tree even with a
 * declared `storyId`. No node here can point at a real story, so the prop is dropped
 * entirely.
 *
 * Two leaves cover the props that actually have a shape: `Default` (bare baseline) and
 * `Placements` (the full `placement` union rendered in ONE leaf, not split per value).
 */
const meta: Meta<typeof Tooltip.Base> = {
    title: "Atoms/Overlay/Tooltip/Tooltip.Base",
    component: Tooltip.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Tooltip.Base>

/** Props for the demo trigger element. */
interface TriggerBoxProps {
    /** Text shown inside the trigger. */
    label?: string
}

/** A bordered term used as the tooltip trigger. */
const TriggerBox = ({ label = "Hover to see it" }: TriggerBoxProps) => (
    <span className="inline-flex cursor-help rounded-xl border border-default-200 bg-default-100 px-3 py-2 text-sm font-medium text-foreground">
        {label}
    </span>
)

/** Default — top-placed hint, pre-opened to soak. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tooltip.Base"
                tier="atom"
                leaf="Default"
                reason="The one tooltip atom, wrapping HeroUI Tooltip. It owns the inset, max-width and arrow, callers just hand it a label and a trigger."
                states={[
                    {
                        name: "defaultOpen, placement default (top)",
                        why: "The panel is pinned open with `defaultOpen` so its hover state can be inspected without a mouse, and it sits above the trigger since `placement` defaults to top. A tooltip has to explain the exact element beside it, which is why this atom is one of only two allowed to keep `children` (the other is Badge) instead of taking a separate trigger prop.",
                        code: "<Tooltip.Base label=\"Weekly XP ranking\" placement=\"top\">\n  <TermChip />\n</Tooltip.Base>",
                        render: (
                            <div className="flex justify-center py-12">
                                <Tooltip.Base label="Ranked by total XP earned this week" placement="top" defaultOpen showAnatomy>
                                    <TriggerBox label="Weekly rank" />
                                </Tooltip.Base>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Placements — top · bottom · left · right, each side gets a trigger pinned open. */
export const Placements: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tooltip.Base"
                tier="atom"
                leaf="Prop `placement`"
                states={[
                    {
                        name: "placement = \"top\"",
                        why: "The trigger is pinned open with the panel anchored above it, since `placement` is set to top. This is the default anchor shown here explicitly so all four sides can be compared leaf by leaf.",
                        code: "<Tooltip.Base label=\"Placement top\" placement=\"top\">…</Tooltip.Base>",
                        render: (
                            <div className="flex justify-center py-12">
                                <Tooltip.Base label="Placement top" placement="top" defaultOpen showAnatomy>
                                    <TriggerBox label="Top" />
                                </Tooltip.Base>
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"bottom\"",
                        why: "The trigger is pinned open with the panel anchored below it, since `placement` is set to bottom. Bottom placement is the fallback the atom reaches for when a trigger sits too close to the top of the viewport for the panel to fit above it.",
                        code: "<Tooltip.Base label=\"Placement bottom\" placement=\"bottom\">…</Tooltip.Base>",
                        render: (
                            <div className="flex justify-center py-12">
                                <Tooltip.Base label="Placement bottom" placement="bottom" defaultOpen showAnatomy>
                                    <TriggerBox label="Bottom" />
                                </Tooltip.Base>
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"left\"",
                        why: "The trigger is pinned open with the panel anchored to its left edge, since `placement` is set to left. Left placement lets a caller keep the hint clear of content that sits directly above or below the trigger.",
                        code: "<Tooltip.Base label=\"Placement left\" placement=\"left\">…</Tooltip.Base>",
                        render: (
                            <div className="flex justify-center py-12">
                                <Tooltip.Base label="Placement left" placement="left" defaultOpen showAnatomy>
                                    <TriggerBox label="Left" />
                                </Tooltip.Base>
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"right\"",
                        why: "The trigger is pinned open with the panel anchored to its right edge, since `placement` is set to right. Right placement mirrors left for triggers sitting near the left edge of their container.",
                        code: "<Tooltip.Base label=\"Placement right\" placement=\"right\">…</Tooltip.Base>",
                        render: (
                            <div className="flex justify-center py-12">
                                <Tooltip.Base label="Placement right" placement="right" defaultOpen showAnatomy>
                                    <TriggerBox label="Right" />
                                </Tooltip.Base>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
