import { BookOpenIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `KnowledgeSection` — the Agent OS pod's "Knowledge" tab: the RAG sources an
 * agent can draw on, each with its indexing status, plus a header add-source
 * trigger. Two DATA states of the single shape: `empty` and `with-rows`. A
 * BASIC stub-section — the list is real, ingestion/editing flows are deferred.
 */

/** The three states a knowledge source can be in while it ingests. */
export type KnowledgeSourceStatusKey = "indexed" | "processing" | "failed"

/** One knowledge source row. */
export interface KnowledgeSourceRow {
    /** Source id. */
    id: string
    /** Readable source name (a file name, a page title, a FAQ import label). */
    name: string
    /** Already-resolved source kind (e.g. "Document", "Website page", "FAQ import"). */
    typeLabel: string
    /** Where the source sits in the ingestion pipeline. */
    status: KnowledgeSourceStatusKey
}

/** Props for {@link KnowledgeSection}. */
export interface KnowledgeSectionProps {
    /** The pod's knowledge sources, newest first. */
    sources: Array<KnowledgeSourceRow>
    /** Open the add-source flow — the connected layer runs the upload/ingest. */
    onAddSource: () => void
    /**
     * `true` → the section's own first fetch is in flight: the same titled
     * card renders a fixed count of source-shaped rows with every content
     * node shimmering (§12b), and the header add trigger is dropped.
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: KnowledgeSectionLabels
}

/** The already-resolved copy the block renders. */
export interface KnowledgeSectionLabels {
    /** Card title (e.g. "Knowledge"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Add-source button label. */
    addLabel: string
    /** The three status labels, keyed by status. */
    statusOptions: Record<KnowledgeSourceStatusKey, string>
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Status → chip tone. Indexed is ready (success), processing is in flight (accent), failed needs attention (danger). */
const STATUS_TONE: Record<KnowledgeSourceStatusKey, ChipTone> = {
    indexed: "success",
    processing: "accent",
    failed: "danger",
}

/** How many placeholder rows the loading mirror draws while `sources` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_SOURCES: Array<KnowledgeSourceRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "Knowledge source name",
    typeLabel: "Document",
    status: "indexed",
}))

/**
 * One knowledge-source row — name + type on the left, status chip on the
 * right. The SAME shape drives the loaded and the loading rows; `isSkeleton`
 * threads down so a loading row is the loaded row with its content nodes
 * shimmering.
 */
const KnowledgeSourceRowItem = ({ source, labels, isSkeleton }: {
    source: KnowledgeSourceRow
    labels: KnowledgeSectionLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackH
                gap={3}
                justify="between"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackV
                            gap={1}
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={source.name} />,
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={source.typeLabel} />,
                            ]}
                        />
                    ),
                    () => (
                        <Chip
                            tone={STATUS_TONE[source.status]}
                            isSkeleton={isSkeleton}
                            text={labels.statusOptions[source.status]}
                        />
                    ),
                ]}
            />
        )}
    />
)

/**
 * The knowledge-sources list. See the file header for why empty vs with-rows
 * are states of one shape rather than separate leaves, and how `isSkeleton`
 * mirrors the loaded rows.
 *
 * @param props - {@link KnowledgeSectionProps}
 */
const KnowledgeSection = ({ sources, onAddSource, isSkeleton = false, labels }: KnowledgeSectionProps) => {
    const rows = isSkeleton ? SKELETON_SOURCES : sources
    return (
        <div data-tier="block" data-component="KnowledgeSection">
            <SurfaceCard
                padding={3}
                label={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                action={isSkeleton ? undefined : () => (
                    <Button
                        variant="secondary"
                        size="sm"
                        prefixIcon={PlusIcon}
                        label={labels.addLabel}
                        onPress={onAddSource}
                    />
                )}
                body={() =>
                    !isSkeleton && sources.length === 0 ? (
                        <EmptyState
                            icon={BookOpenIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((source) => () => (
                                <KnowledgeSourceRowItem source={source} labels={labels} isSkeleton={isSkeleton} />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { KnowledgeSection }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "KnowledgeSection" } as const
