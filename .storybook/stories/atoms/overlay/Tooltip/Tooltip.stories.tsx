import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Tooltip`: the one hover-hint atom, wrapping HeroUI Tooltip.
 * 
 * Keeping `children` here is correct (rationale in `Tooltip.tsx`'s header): the atom wrapper
 * must wrap an arbitrary element so react-aria can attach hover/focus/`aria-describedby`
 * straight onto it. It shares the Menu/Popover portal limitation — `Tooltip.Content`/
 * `Tooltip.Arrow` render into `body`, so `BlockAnatomy` can never reach them.
 * 
 * `annotate`: every HeroUI import `Tooltip.tsx` renders directly declares `tier: "heroui"`,
 * named by the real import (`Tooltip.Trigger`/`Tooltip.Content`/`Tooltip.Arrow`).
 * `Tooltip.Trigger` is the only one inside the render box (it wraps the `children` trigger);
 * `Tooltip.Content`/`Tooltip.Arrow` portal outside, so declaring them is data honesty, not a
 * visibility promise.
 * 
 * Two leaves cover the props with a shape: `Default` (bare baseline) and `Placements` (the full
 * `placement` union rendered in one leaf, not split per value).
 */

/**
 * Every `@heroui/react` import `Tooltip` renders directly. Shared across every leaf
 * in this file — which nodes actually surface still depends on what that leaf renders.
 */
const TOOLTIP_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Tooltip.Trigger": { tier: "heroui", role: "Wraps the caller's trigger element (children) so react-aria can attach hover/focus/aria-describedby." },
    "Tooltip.Content": { tier: "heroui", role: "The hint panel (renders into document.body — never reachable here)." },
    "Tooltip.Arrow": { tier: "heroui", role: "Little arrow pointing at the trigger (renders into document.body — never reachable here)." },
}

const meta: Meta<typeof Tooltip> = {
    title: "Atoms/Overlay/Tooltip/Tooltip",
    component: Tooltip,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Tooltip>

/** Props for the demo trigger element. */
interface TriggerBoxProps {
    /** Text shown inside the trigger. */
    label?: string
}

/** A bordered term used as the tooltip trigger. */
const TriggerBox = ({ label = "Hover to see it" }: TriggerBoxProps) => (
    <span data-tier="fixture" className="inline-flex cursor-help rounded-xl border border-default-200 bg-default-100 px-3 py-2 text-sm font-medium text-foreground">
        {label}
    </span>
)

/** Default — top-placed hint, pre-opened to soak. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Tooltip"
                tier="atom"
                annotate={TOOLTIP_ANNOTATE}
                leaf="Default"
                reason="The one tooltip atom, wrapping HeroUI Tooltip. It owns the inset, max-width and arrow, callers just hand it a label and a trigger."
                states={[
                    {
                        name: "defaultOpen, placement default (top)",
                        why: "The panel is pinned open with `defaultOpen` so its hover state can be inspected without a mouse, and it sits above the trigger since `placement` defaults to top. A tooltip has to explain the exact element beside it, which is why this atom is one of only two allowed to keep `children` (the other is Badge) instead of taking a separate trigger prop.",
                        code: "<Tooltip label=\"Weekly XP ranking\" placement=\"top\">\n  <TermChip />\n</Tooltip>",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-12">
                                <Tooltip label="Ranked by total XP earned this week" placement="top" defaultOpen>
                                    <TriggerBox label="Weekly rank" />
                                </Tooltip>
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Tooltip"
                tier="atom"
                annotate={TOOLTIP_ANNOTATE}
                leaf="Prop `placement`"
                states={[
                    {
                        name: "placement = \"top\"",
                        why: "The trigger is pinned open with the panel anchored above it, since `placement` is set to top. This is the default anchor shown here explicitly so all four sides can be compared leaf by leaf.",
                        code: "<Tooltip label=\"Placement top\" placement=\"top\">…</Tooltip>",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-12">
                                <Tooltip label="Placement top" placement="top" defaultOpen>
                                    <TriggerBox label="Top" />
                                </Tooltip>
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"bottom\"",
                        why: "The trigger is pinned open with the panel anchored below it, since `placement` is set to bottom. Bottom placement is the fallback the atom reaches for when a trigger sits too close to the top of the viewport for the panel to fit above it.",
                        code: "<Tooltip label=\"Placement bottom\" placement=\"bottom\">…</Tooltip>",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-12">
                                <Tooltip label="Placement bottom" placement="bottom" defaultOpen>
                                    <TriggerBox label="Bottom" />
                                </Tooltip>
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"left\"",
                        why: "The trigger is pinned open with the panel anchored to its left edge, since `placement` is set to left. Left placement lets a caller keep the hint clear of content that sits directly above or below the trigger.",
                        code: "<Tooltip label=\"Placement left\" placement=\"left\">…</Tooltip>",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-12">
                                <Tooltip label="Placement left" placement="left" defaultOpen>
                                    <TriggerBox label="Left" />
                                </Tooltip>
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"right\"",
                        why: "The trigger is pinned open with the panel anchored to its right edge, since `placement` is set to right. Right placement mirrors left for triggers sitting near the left edge of their container.",
                        code: "<Tooltip label=\"Placement right\" placement=\"right\">…</Tooltip>",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-12">
                                <Tooltip label="Placement right" placement="right" defaultOpen>
                                    <TriggerBox label="Right" />
                                </Tooltip>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
