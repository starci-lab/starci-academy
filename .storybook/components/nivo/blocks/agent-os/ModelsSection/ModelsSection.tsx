import { CpuIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ModelsSection` — the Agent OS pod's "Models" tab: the AI models available
 * to the pod's agents, each with its provider and whether it is the pod's
 * default. Two DATA states of the single shape: `empty` and `with-rows`. A
 * BASIC stub-section — a read-only list; assigning a model per agent is
 * deferred to `AgentDetailDrawer`.
 */

/** One model row available to the pod. */
export interface AgentOsModelRow {
    /** Model id. */
    id: string
    /** Readable model name (e.g. "GPT-4o mini", "Qwen 2.5"). */
    name: string
    /** Already-resolved provider line (e.g. "OpenAI", "Local — self-hosted"). */
    providerLabel: string
    /** Whether this is the pod's default model for new agents. */
    isDefault: boolean
}

/** Props for {@link ModelsSection}. */
export interface ModelsSectionProps {
    /** The models available to the pod, in listing order. */
    models: Array<AgentOsModelRow>
    /**
     * `true` → the section's own first fetch is in flight: the same titled
     * card renders a fixed count of model-shaped rows with every content node
     * shimmering (§12b). Threaded straight down — never fed to a separate
     * skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ModelsSectionLabels
}

/** The already-resolved copy the block renders. */
export interface ModelsSectionLabels {
    /** Card title (e.g. "Models"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Chip text marking the pod's default model. */
    defaultLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** How many placeholder rows the loading mirror draws while `models` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_MODELS: Array<AgentOsModelRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "Model name",
    providerLabel: "Provider",
    isDefault: index === 0,
}))

/**
 * One model row — name + provider on the left, the default chip on the right
 * (only on the default model). The SAME shape drives the loaded and the
 * loading rows; `isSkeleton` threads down so a loading row is the loaded row
 * with its content nodes shimmering.
 */
const ModelRowItem = ({ model, labels, isSkeleton }: {
    model: AgentOsModelRow
    labels: ModelsSectionLabels
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
                                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={model.name} />,
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={model.providerLabel} />,
                            ]}
                        />
                    ),
                    ...(isSkeleton || model.isDefault
                        ? [() => <Chip tone="accent" isSkeleton={isSkeleton} text={labels.defaultLabel} />]
                        : []),
                ]}
            />
        )}
    />
)

/**
 * The pod's models list. See the file header for why empty vs with-rows are
 * states of one shape rather than separate leaves, and how `isSkeleton`
 * mirrors the loaded rows.
 *
 * @param props - {@link ModelsSectionProps}
 */
const ModelsSection = ({ models, isSkeleton = false, labels }: ModelsSectionProps) => {
    const rows = isSkeleton ? SKELETON_MODELS : models
    return (
        <div data-tier="block" data-component="ModelsSection">
            <SurfaceCard
                padding={3}
                label={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                body={() =>
                    !isSkeleton && models.length === 0 ? (
                        <EmptyState
                            icon={CpuIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((model) => () => (
                                <ModelRowItem model={model} labels={labels} isSkeleton={isSkeleton} />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { ModelsSection }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ModelsSection" } as const
