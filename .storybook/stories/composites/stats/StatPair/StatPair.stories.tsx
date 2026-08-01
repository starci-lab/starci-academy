import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card } from "@heroui/react"
import { StatPair } from "@sb-components/composites/stats/StatPair/StatPair"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof StatPair> = {
    title: "Composites/Stats/StatPair",
    component: StatPair,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatPair>

/** The four stats reused across the layout stories below. */
const STATS = [
    { value: "1,204", label: "Followers" },
    { value: "87%", label: "Completion rate" },
    { value: "12", label: "Enrolled courses" },
    { value: "4.9", label: "Average rating" },
]

/**
 * ANATOMY IS PER-LEAF: every story below wraps its render in its OWN BlockAnatomy
 * axis. `StatPair` renders its `value`/`label` straight through HeroUI `Typography`
 * (canon granularity rule, a component that renders `Typography` inline gets its OWN
 * tagged node), so both are direct parts, named for that real import — not
 * role-suffixed fakes like `Typography.Value`/`Typography.Label` (no such members
 * exist on HeroUI's `Typography`; dedup is by DOM element, not name, so reusing
 * `Typography` twice here is exactly right). Frameless — the surrounding
 * `Card`/divider/grid belongs to the CALLER, not this composite.
 */
const STAT_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "heroui", role: "the main figure, semibold" },
    { name: "Typography", tier: "heroui", role: "the muted caption under the value" },
]

export const Single: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StatPair"
                tier="composite"
                leaf="Single"
                parts={STAT_PARTS}
                reason="The value and label stack vertically as one pair with no surface of its own, so the surrounding card or stat row decides the surface and the divider, not this composite."
                states={[
                    {
                        name: "value = \"1,204\", label = \"Followers\"",
                        why: "The render is just one value/label pair with no border or padding around it. Dropping the frame here means a caller wrapping four of these in a Card with `divide-x` gets clean dividers with no doubled-up borders.",
                        code: "<StatPair value=\"1,204\" label=\"Followers\" />",
                        render: <StatPair anatPart="StatPair" showAnatomy value="1,204" label="Followers" />,
                    },
                ]}
            />
        </div>
    ),
}

export const Row: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StatPair"
                tier="composite"
                leaf="Row"
                parts={STAT_PARTS}
                states={[
                    {
                        name: "4 StatPair inside one Card, divide-x",
                        why: "Four StatPair pairs sit side by side inside one Card, divided by the caller's own `divide-x` borders rather than by StatPair itself. Each pair still renders the same two nodes, proving the frameless composite composes cleanly into a caller-owned row layout.",
                        code: "<Card className=\"flex divide-x divide-default\">\n  {stats.map((stat) => <StatPair key={stat.label} value={stat.value} label={stat.label} />)}\n</Card>",
                        render: (
                            // Parent owns the card + full-height vertical dividers; StatPair is frameless.
                            <Card data-tier="fixture" variant="default" className="w-fit">
                                <div className="flex items-stretch divide-x divide-default">
                                    {STATS.map((stat) => (
                                        <div data-tier="fixture" key={stat.label} className="px-6 first:pl-0 last:pr-0">
                                            <StatPair anatPart="StatPair" showAnatomy value={stat.value} label={stat.label} />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

export const Grid: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StatPair"
                tier="composite"
                leaf="Grid"
                parts={STAT_PARTS}
                states={[
                    {
                        name: "same 4 stats, 2-column grid (narrow width)",
                        why: "The same four stats now sit in a 2-column grid instead of a divided row, because the narrower Card (a sidebar widget) has no room for four columns side by side. Every StatPair still renders the identical value/label composition, the grid only changes how the caller arranges the pairs.",
                        code: "<Card className=\"grid grid-cols-2 gap-x-8 gap-y-6\">\n  {stats.map((stat) => <StatPair key={stat.label} value={stat.value} label={stat.label} />)}\n</Card>",
                        render: (
                            // Narrow width (sidebar/widget): the same stats fall into a 2-col grid.
                            <Card data-tier="fixture" variant="default" className="w-[420px]">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    {STATS.map((stat) => (
                                        <StatPair key={stat.label} anatPart="StatPair" showAnatomy value={stat.value} label={stat.label} />
                                    ))}
                                </div>
                            </Card>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `StatPair` draws its own shimmer when `isSkeleton` (component code, not this
 * file): a `h-5` value-sized bar stacked `gap-1` over a shorter `h-3`
 * label-sized bar, both raw HeroUI `Skeleton`, each tagged `data-anat-part="Skeleton"`
 * when `showAnatomy` — so the Structure tab now works on this branch too.
 */
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "heroui", role: "the value bar (h-5) and, gap-1 below it, the label bar (h-3)" },
]

/** LEAF — the caller flips `isSkeleton`; the pair draws its own 2-bar shimmer mirror instead of a caller faking it with an unrelated atom (§12g.0a). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StatPair"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={SKELETON_PARTS}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The pair mirrors its own loaded shape: a value-sized bar sits tight (`gap-1`) over a shorter label-sized bar, the same left-aligned column the loaded value/label pair renders — so a row of skeleton StatPairs already sits at the loaded row's rhythm.",
                        code: "<StatPair isSkeleton />",
                        render: <StatPair isSkeleton anatPart="StatPair" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
