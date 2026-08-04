import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    HealthCard,
    type HealthCardLabels,
} from "@sb-components/nivo/blocks/agent-os/HealthCard/HealthCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `HealthCard` — the Agent OS console's operating-loop tile over the pod's own
 * health: a decorative pulse glyph beside a titled meter (`ProgressMeter`) plus a
 * caption UNDER the bar spelling out that the figure is ILLUSTRATIVE — the
 * proposal's business-parity rule bans a fabricated metric, and there is no real
 * operating-data pipeline behind a pod's health yet. One composition, one DATA
 * axis (`isSkeleton`) — no `empty`/`error` leaf, since the console only ever
 * mounts this once the pod is `active`.
 */
const meta: Meta<typeof HealthCard> = {
    title: "Nivo/Blocks/AgentOs/HealthCard/HealthCard",
    component: HealthCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof HealthCard>

const LABELS: HealthCardLabels = {
    title: "Pod health",
    illustrativeNote: "30-day uptime · illustrative — no real operating data yet",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the tile face" },
    ProgressMeter: { tier: "composite", role: "the titled bar — draws its own label + rounded percentage row" },
    Typography: { tier: "atom", role: "the illustrative caption under the bar" },
}

/** LEAF — the tile has one shape; `isSkeleton` is the only DATA axis. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-md p-8">
            <BlockAnatomy
                name="HealthCard"
                tier="block"
                leaf="Pod health tile"
                annotate={ANNOTATE}
                renderClassName="max-w-md"
                reason="Blocks take no `className`: the tile owns the illustrative-labelling rule itself — the caption under the bar always spells out that the percentage is not a real measured metric, so no call site can accidentally ship this tile as a claimed uptime SLA. No `empty`/`error` leaf: the console's state matrix only ever mounts `HealthCard` once the pod is `active`."
                states={[
                    {
                        name: "healthPercent = 99.2",
                        why: "The loaded tile: pulse glyph, the `Pod health` meter at 99.2%, and the illustrative caption underneath — the same caption text on EVERY value, since the number is never meant to read as a real SLA figure.",
                        code: `<HealthCard healthPercent={99.2} labels={labels} />`,
                        render: <HealthCard healthPercent={99.2} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The console's own first fetch hasn't resolved yet, so the meter's label/percentage/bar shimmer in place — the decorative glyph tile stays static, the same convention `SurfaceCard.Nested`'s own header icon uses.",
                        code: `<HealthCard isSkeleton healthPercent={0} labels={labels} />`,
                        render: <HealthCard isSkeleton healthPercent={0} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
