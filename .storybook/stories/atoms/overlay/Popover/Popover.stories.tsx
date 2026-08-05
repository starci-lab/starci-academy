import type { Meta, StoryObj } from "@storybook/nextjs"
import { InfoIcon } from "@phosphor-icons/react"
import { Popover } from "@sb-components/atoms/overlay/Popover/Popover"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Popover`: the one click-panel atom, wraps HeroUI `Popover` directly + a `Button` as
 * its pressable trigger (react-aria's `DialogTrigger` requires one). No child atom splits into
 * its own story — `heading`/`triggerIcon`/`triggerVariant`/`placement`/`showArrow` are all
 * prop-driven leaves of `Popover` itself.
 *
 * `annotate`: every HeroUI import `Popover.tsx` renders directly declares `tier: "heroui"`
 * (no `storyId`). Node names match the real import name (`Button` for the trigger;
 * `Popover.Content`/`Popover.Arrow`/`Popover.Heading` for the panel).
 *
 * PORTAL LIMIT: `Popover.Content` and its nested `Popover.Arrow`/`Popover.Heading` render into
 * `document.body`, outside the render-box {@link BlockAnatomy} scans, so they do not show up in
 * the Structure tree — declaring the right name is data honesty, not a visibility promise. Only
 * `Button` (the trigger) lands in the tree.
 *
 * The `Placement`/`ShowArrow` leaves open the panel through a portal, so they need `defaultOpen`
 * to be seen, and lay their popovers out in a vertical column so each can open in any direction
 * without overlapping. The `TriggerVariant` leaf's difference lives in the closed button, so it
 * needn't open the panel. UI text (`triggerLabel`, `content`, `reason`/`why`) is English.
 */

/**
 * Every `@heroui/react` import that `Popover` renders directly. Used SHARED across every leaf
 * in this file — the real tree still depends on which leaf currently renders what.
 */
const POPOVER_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": { tier: "heroui", role: "Pressable trigger (react-aria DialogTrigger requires a pressable trigger)." },
    "Popover.Content": { tier: "heroui", role: "Panel surface (renders into document.body — never reachable here)." },
    "Popover.Arrow": { tier: "heroui", role: "Little arrow pointing at the trigger (renders into document.body — never reachable here)." },
    "Popover.Heading": { tier: "heroui", role: "Optional bold heading line (renders into document.body — never reachable here)." },
}

const meta: Meta<typeof Popover> = {
    title: "Atoms/Overlay/Popover/Popover",
    component: Popover,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Popover>

/** BARE leaf — trigger button + panel already open, no heading. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Popover"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Default"
                reason="The one click-panel atom wrapping HeroUI Popover plus a Button trigger (react-aria's DialogTrigger requires a pressable trigger). The atom owns the panel's surface, placement, and arrow."
                states={[
                    {
                        name: "no heading, defaultOpen = true",
                        why: "The trigger button and its panel render with no heading line above the body text. `defaultOpen` pins the panel open here only so it can be seen; `placement` defaults to bottom and the trigger label goes through `triggerLabel` since the atom takes no `children`.",
                        code: "<Popover triggerLabel=\"Details\" content={<p>…</p>} placement=\"bottom\" />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-16">
                                <Popover
                                    triggerLabel="Streak details"
                                    content="Last session was 2 days ago. Keep the streak alive by studying every day."
                                    placement="bottom"
                                    defaultOpen

                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `heading` — adds a bold heading line above the body. */
export const WithHeading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Popover"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `heading`"
                states={[
                    {
                        name: "heading passed",
                        why: "A bold line (Popover.Heading) renders above the body text, inside the same panel. This is for a panel that needs a short title of its own instead of leading straight with the body copy.",
                        code: "<Popover triggerLabel=\"Details\" heading=\"12-day streak\" content={<p>…</p>} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-16">
                                <Popover
                                    triggerLabel="Streak details"
                                    heading="12-day streak"
                                    content="Study today to keep it going. Miss one day and it resets to zero."
                                    placement="bottom"
                                    defaultOpen

                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `triggerIcon` — the trigger's label grows a leading glyph. */
export const WithTriggerIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Popover"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `triggerIcon`"
                states={[
                    {
                        name: "triggerIcon passed",
                        why: "A leading glyph renders on the trigger button before its label. `triggerIcon` takes a Phosphor COMPONENT (§5.0) so the atom itself pins it to `size-3.5`, the trigger's own text size, plus the fixed stroke weight from §5.0a — callers never choose the weight themselves.",
                        code: "<Popover triggerLabel=\"How scoring works\" triggerIcon={InfoIcon} content={<p>…</p>} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-16">
                                <Popover
                                    triggerLabel="How scoring works"
                                    triggerIcon={InfoIcon}
                                    content="Score = number of criteria passed divided by the total criteria in the question's checklist."
                                    placement="bottom"
                                    defaultOpen

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
 * Leaf prop `triggerVariant` — ALL 4 values, each value is ONE state. The difference
 * lives ENTIRELY in the trigger button, the panel never changes shape by variant, so
 * every state keeps the panel CLOSED.
 */
export const TriggerVariant: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Popover"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `triggerVariant`"
                reason="The trigger's weight tells the reader how loud the panel is before they even open it — a toolbar filter can stay quiet (secondary/ghost), a call-to-action popover can afford to be louder (primary). Only the button chrome changes across the four values; the panel itself never differs, so every state here keeps the panel closed."
                states={[
                    {
                        name: "triggerVariant = \"primary\"",
                        why: "The trigger button renders with primary chrome, the loudest weight available. This is for a popover that behaves like a genuine call to action, not a quiet filter or a secondary control.",
                        code: "<Popover triggerVariant=\"primary\" triggerLabel=\"Primary\" content=\"...\" />",
                        render: (
                            <div data-tier="fixture" className="flex flex-wrap items-center gap-3">
                                <Popover triggerVariant="primary" triggerLabel="Primary" content="Additional detail appears here when this trigger opens." />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"secondary\"",
                        why: "The trigger button renders with secondary chrome, a step down from primary. This is the everyday weight for a popover trigger that isn't the main action on the page.",
                        code: "<Popover triggerVariant=\"secondary\" triggerLabel=\"Secondary\" content=\"...\" />",
                        render: (
                            <div data-tier="fixture" className="flex flex-wrap items-center gap-3">
                                <Popover triggerVariant="secondary" triggerLabel="Secondary" content="Additional detail appears here when this trigger opens." />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"tertiary\"",
                        why: "The trigger button renders with tertiary chrome, quieter still than secondary. This is for a popover trigger that should read as a minor, optional affordance next to louder controls.",
                        code: "<Popover triggerVariant=\"tertiary\" triggerLabel=\"Tertiary\" content=\"...\" />",
                        render: (
                            <div data-tier="fixture" className="flex flex-wrap items-center gap-3">
                                <Popover triggerVariant="tertiary" triggerLabel="Tertiary" content="Additional detail appears here when this trigger opens." />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"ghost\"",
                        why: "The trigger button renders with ghost chrome, the quietest weight of the four. This is for a popover tucked inside a toolbar or a dense row, where the trigger shouldn't draw the eye until it's pressed.",
                        code: "<Popover triggerVariant=\"ghost\" triggerLabel=\"Ghost\" content=\"...\" />",
                        render: (
                            <div data-tier="fixture" className="flex flex-wrap items-center gap-3">
                                <Popover triggerVariant="ghost" triggerLabel="Ghost" content="Additional detail appears here when this trigger opens." />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `placement` — ALL 8 directions to place the panel around the trigger, each
 * direction is ONE state.
 *
 * `Popover.Content` renders through a PORTAL outside the render-box, so closed means
 * nothing to inspect → every popover requires `defaultOpen`. Each state leaves a tall
 * empty band around the trigger (`min-h-[16rem]`, 256px, exactly matching the panel's
 * own `w-64` width) so the panel, whichever direction it opens toward, never touches the frame's edge.
 */
export const Placement: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Popover"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `placement`"
                reason="The panel opens toward whichever side has room around the trigger — pick the direction that matches where the trigger actually sits on the screen, not bottom out of habit. `defaultOpen` pins every state's panel open only so it can be seen here; in the real app only one is open at a time, chosen by where the trigger lives on the page."
                states={[
                    {
                        name: "placement = \"top\"",
                        why: "The panel opens directly above the trigger, arrow pointing down. This is for a trigger that sits near the bottom of the screen, where there's no room for the panel to open downward.",
                        code: "<Popover placement=\"top\" ... />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Top" content="The panel repositions to the space around the trigger." placement="top" defaultOpen />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"top start\"",
                        why: "The panel opens above the trigger, its left edge aligned with the trigger's left edge. This is for a trigger near the top-right of a narrow area, where a centred panel would overflow past the left edge.",
                        code: "<Popover placement=\"top start\" ... />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Top start" content="The panel repositions to the space around the trigger." placement="top start" defaultOpen />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"top end\"",
                        why: "The panel opens above the trigger, its right edge aligned with the trigger's right edge. This is for a trigger near the top-left of a narrow area, where a centred panel would overflow past the right edge.",
                        code: "<Popover placement=\"top end\" ... />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Top end" content="The panel repositions to the space around the trigger." placement="top end" defaultOpen />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"bottom\"",
                        why: "The panel opens directly below the trigger, arrow pointing up. This is the everyday direction, used whenever the trigger has open space beneath it.",
                        code: "<Popover placement=\"bottom\" ... />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Bottom" content="The panel repositions to the space around the trigger." placement="bottom" defaultOpen />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"bottom start\"",
                        why: "The panel opens below the trigger, its left edge aligned with the trigger's left edge. This is for a trigger near the bottom-right of a narrow area, where a centred panel would overflow past the left edge.",
                        code: "<Popover placement=\"bottom start\" ... />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Bottom start" content="The panel repositions to the space around the trigger." placement="bottom start" defaultOpen />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"bottom end\"",
                        why: "The panel opens below the trigger, its right edge aligned with the trigger's right edge. This is for a trigger near the bottom-left of a narrow area, where a centred panel would overflow past the right edge.",
                        code: "<Popover placement=\"bottom end\" ... />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Bottom end" content="The panel repositions to the space around the trigger." placement="bottom end" defaultOpen />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"left\"",
                        why: "The panel opens to the left of the trigger, arrow pointing right. This is for a trigger that sits near the right edge of the screen, where the panel would otherwise run off the viewport.",
                        code: "<Popover placement=\"left\" ... />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Left" content="The panel repositions to the space around the trigger." placement="left" defaultOpen />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"right\"",
                        why: "The panel opens to the right of the trigger, arrow pointing left. This is for a trigger that sits near the left edge of the screen, such as a rail or a sidebar item.",
                        code: "<Popover placement=\"right\" ... />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Right" content="The panel repositions to the space around the trigger." placement="right" defaultOpen />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `showArrow` — the atom defaults to `true` (every other leaf in this file
 * already carries the arrow), so this leaf declares exactly TWO states: arrow shown and not.
 */
export const ShowArrow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Popover"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `showArrow`"
                reason="The arrow ties the panel back to the exact trigger that opened it — turn it off only when the panel already sits flush against the trigger and the connection reads on its own. `showArrow` defaults to true, so every other leaf in this file already carries it; this leaf is the only place the `false` case is demonstrated."
                states={[
                    {
                        name: "showArrow = true (default)",
                        why: "A small arrow renders on the panel's edge, pointing back at the trigger. This is the default, kept on whenever the panel doesn't sit flush against the trigger it belongs to.",
                        code: "<Popover showArrow content=\"...\" />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Arrow shown" content="The arrow points back to the trigger that opened this panel." showArrow defaultOpen />
                            </div>
                        ),
                    },
                    {
                        name: "showArrow = false",
                        why: "The arrow is dropped entirely, leaving the panel edge plain. This is only for a panel that already sits flush against its trigger, where the connection between the two is obvious without an arrow.",
                        code: "<Popover showArrow={false} content=\"...\" />",
                        render: (
                            <div data-tier="fixture" className="flex min-h-[16rem] items-center justify-center">
                                <Popover triggerLabel="Arrow hidden" content="The arrow points back to the trigger that opened this panel." showArrow={false} defaultOpen />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
