import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundResourcePanel } from "@sb-components/starci/blocks/learn/PlaygroundResourcePanel/PlaygroundResourcePanel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundResourcePanel` — the right pane of the playground screen, the live
 * workspace: nothing until the paired machine reports in, then the resource
 * snapshot the socket sent, grouped by kind. Reuses `SurfaceCard.Accordion`,
 * `List.Row`, and `EmptyState` rather than inventing its own. Status uses `Chip`,
 * not `EnumChip`, because it is free-form CLI text ("Up 2 hours", "Exited (0)"): a
 * `toneForStatus` heuristic degrades to neutral on anything unrecognized. One shape,
 * three states (not-connected, connected-empty, connected-with-resources) — a header
 * row over a body region whose fill changes.
 */
const meta: Meta<typeof PlaygroundResourcePanel> = {
    title: "StarCi/Blocks/Learn/PlaygroundResourcePanel/PlaygroundResourcePanel",
    component: PlaygroundResourcePanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundResourcePanel>

const RESOURCES = [
    { kind: "container", name: "web-app-1", status: "Up 2 hours" },
    { kind: "container", name: "worker-queue", status: "Restarting (1) 4 seconds ago" },
    { kind: "container", name: "migrate-once", status: "Exited (0) 5 minutes ago" },
    { kind: "image", name: "node:20-alpine", status: "Ready" },
    { kind: "image", name: "postgres:16", status: "Ready" },
    { kind: "volume", name: "app-data", status: "In use" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame separating the panel's header row from its body region", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame pinning the header's icon+label to the start and the total count to the end", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the panel's header label (with its leading icon) or the total-count text beside it", storyId: "atoms-text-typography-typography--overview" },
    "EmptyState": { tier: "composite", role: "the centred message filling the body region before pairing, and again after pairing while the first snapshot is still in flight", storyId: "composites-feedback-emptystate--icon-and-title" },
    "SurfaceCardAccordion": { tier: "composite", role: "the bounded card of collapsible kind-groups, each trigger row carrying its own resource count as `titleEnd`", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "Chip": { tier: "atom", role: "a per-kind resource count in a trigger row, or a per-resource status pill toned by the block's own CLI-text heuristic", storyId: "atoms-chips-chip-chip--tones" },
    "ListRow": { tier: "composite", role: "one resource inside its kind group, carrying the resource's name and its toned status chip as trailing meta", storyId: "composites-lists-list-listrow--meta-trailing" },
}

/** LEAF — the panel's one shape: header row over a body region, three data states. */
export const Panel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundResourcePanel"
                tier="block"
                leaf="Panel"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "connection = notConnected",
                        why: "No machine has paired yet, so the body region carries an invitation to pair rather than an empty accordion — this is the LOCKED pre-content state, before there is anything to snapshot at all.",
                        code: "<PlaygroundResourcePanel connection=\"notConnected\" resources={[]} />",
                        render: (
                            <PlaygroundResourcePanel


                                connection="notConnected"
                                resources={[]}
                            />
                        ),
                    },
                    {
                        name: "connection = connected, resources = []",
                        why: "Pairing succeeded but the socket hasn't reported a snapshot yet, so the copy says 'waiting', not 'empty' — a learner who just paired should not read this as something having gone wrong.",
                        code: "<PlaygroundResourcePanel connection=\"connected\" resources={[]} />",
                        render: (
                            <PlaygroundResourcePanel
                                connection="connected"
                                resources={[]}
                            />
                        ),
                    },
                    {
                        name: "connection = connected, resources.length > 0",
                        why: "The snapshot has resources of three different kinds, so the block buckets them itself (first-seen kind order) into collapsible groups, each carrying its own count, and each row's status chip is toned by the block's own free-form heuristic — 'Up 2 hours' reads success, 'Restarting…' reads warning, 'Exited (0)…' reads danger.",
                        code: `<PlaygroundResourcePanel
    connection="connected"
    resources={[
        { kind: "container", name: "web-app-1", status: "Up 2 hours" },
        { kind: "container", name: "worker-queue", status: "Restarting (1) 4 seconds ago" },
        { kind: "image", name: "node:20-alpine", status: "Ready" },
    ]}
/>`,
                        render: (
                            <PlaygroundResourcePanel
                                connection="connected"
                                resources={RESOURCES}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
