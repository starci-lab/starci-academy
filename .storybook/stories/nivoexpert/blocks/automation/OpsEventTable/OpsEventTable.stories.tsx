import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    OpsEventTable,
    type OpsEventRowView,
    type OpsEventTableLabels,
} from "@sb-components/nivoexpert/blocks/automation/OpsEventTable/OpsEventTable"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OpsEventTable` — the "platform events" tab. A reference table mapping each
 * platform event the ops layer fires to n8n to its per-event webhook path and to
 * whether an active workflow listens. The event set is FIXED (five events), so the
 * block has a single state. Grounded in the real `N8nDispatcherService`, whose
 * `OpsEvent` union is these five and whose path is `nivo-<event with dots as dashes>`.
 */
const meta: Meta<typeof OpsEventTable> = {
    title: "NivoExpert/Blocks/Automation/OpsEventTable/OpsEventTable",
    component: OpsEventTable,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OpsEventTable>

const LABELS: OpsEventTableLabels = {
    title: "Platform events",
    description: "Point a workflow's Webhook trigger at one of these paths and the platform will fire the event to it.",
    eventColumn: "Event",
    whenColumn: "When it fires",
    webhookColumn: "Webhook path",
    listeningColumn: "Listening",
    listeningLabel: "A workflow listens",
    notListeningLabel: "Nothing listens",
    tableAriaLabel: "Platform events fired to n8n",
}

/** The five events, their webhook paths (`nivo-<event dashed>`), and whether a workflow listens. */
const EVENTS: Array<OpsEventRowView> = [
    { event: "member.registered", whenLabel: "A learner signs up", webhookPath: "nivo-member-registered", isListening: true },
    { event: "order.paid", whenLabel: "A learner pays for a course", webhookPath: "nivo-order-paid", isListening: true },
    { event: "lesson.completed", whenLabel: "A learner finishes a lesson", webhookPath: "nivo-lesson-completed", isListening: false },
    { event: "quiz.passed", whenLabel: "A learner passes a quiz", webhookPath: "nivo-quiz-passed", isListening: false },
    { event: "certificate.issued", whenLabel: "A certificate is issued", webhookPath: "nivo-certificate-issued", isListening: false },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the reference card wrapping the table" },
    Table: { tier: "composite", role: "one row per platform event — event, when, webhook, and listening status" },
    Chip: { tier: "atom", role: "whether an active workflow listens on the event's path" },
    Typography: { tier: "atom", role: "the event names, the when lines, and the webhook paths" },
}

/** LEAF — one shape and one state: the event set is fixed at five. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OpsEventTable"
                tier="block"
                leaf="Events"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`: the block owns the event set. There is no empty or loading leaf because the event set is fixed at five — the block always renders the same rows. The `isListening` flag is derived by joining an active workflow's webhook path against the event's path."
                states={[
                    {
                        name: "the five platform events",
                        why: "Every platform event with its per-event webhook path and a chip saying whether a workflow currently listens — two events wired up, three still open.",
                        code: "<OpsEventTable events={events} labels={labels} />",
                        render: <OpsEventTable events={EVENTS} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
