import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    KnowledgeSection,
    type KnowledgeSourceRow,
    type KnowledgeSectionLabels,
} from "@sb-components/nivo/blocks/agent-os/KnowledgeSection/KnowledgeSection"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `KnowledgeSection` — the Agent OS pod's "Knowledge" tab: the RAG sources an
 * agent can draw on, each with its indexing status, plus a header add-source
 * trigger. Two DATA states of the single shape: `empty` and `with-rows`. A
 * BASIC stub-section — the list is real, ingestion/editing flows are deferred.
 */
const meta: Meta<typeof KnowledgeSection> = {
    title: "Nivo/Blocks/AgentOs/KnowledgeSection/KnowledgeSection",
    component: KnowledgeSection,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KnowledgeSection>

const LABELS: KnowledgeSectionLabels = {
    title: "Knowledge",
    description: "Sources your agents can look up an answer in before replying.",
    addLabel: "Add source",
    statusOptions: { indexed: "Indexed", processing: "Processing", failed: "Failed" },
    emptyTitle: "No knowledge sources yet",
    emptyDescription: "Add a document, page, or FAQ so your agents can answer from it.",
}

const SOURCES: Array<KnowledgeSourceRow> = [
    { id: "src-1", name: "Return policy.pdf", typeLabel: "Document", status: "indexed" },
    { id: "src-2", name: "nivo.vn/pricing", typeLabel: "Website page", status: "indexed" },
    { id: "src-3", name: "Shipping FAQ import", typeLabel: "FAQ import", status: "processing" },
    { id: "src-4", name: "Warranty terms.docx", typeLabel: "Document", status: "failed" },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested card per source" },
    EmptyState: { tier: "composite", role: "the empty branch when no source has been added" },
    Chip: { tier: "atom", role: "the source's ingestion status — indexed, processing, or failed" },
    Button: { tier: "atom", role: "opens the add-source flow" },
    Typography: { tier: "atom", role: "the source name and type" },
}

/** LEAF — one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="KnowledgeSection"
                tier="block"
                leaf="Sources"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the pod's knowledge sources, so empty vs with-rows are states of one shape. This is a BASIC stub-section — the source list and its status are real, but per-source ingestion controls (re-index, delete, preview) are deferred to a later pass."
                states={[
                    {
                        name: "sources = []",
                        why: "No knowledge sources added yet. The card keeps its title and reads as an intentional empty state, pointing at adding the first source.",
                        code: `<KnowledgeSection
    sources={[]}
    onAddSource={addSource}
    labels={labels}
/>`,
                        render: <KnowledgeSection sources={[]} onAddSource={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "sources populated",
                        why: "Four sources across all three ingestion statuses — two indexed and ready, one still processing, one that failed to ingest — so it's clear at a glance what an agent can already answer from.",
                        code: "<KnowledgeSection sources={sources} onAddSource={addSource} labels={labels} />",
                        render: <KnowledgeSection sources={SOURCES} onAddSource={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The section's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of source-shaped rows — name, type, and status chip all shimmering — and the add trigger is dropped.",
                        code: `<KnowledgeSection
    sources={[]}
    onAddSource={addSource}
    labels={labels}
    isSkeleton
/>`,
                        render: <KnowledgeSection sources={[]} onAddSource={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
