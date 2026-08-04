import { ArrowClockwiseIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `DeployStatusCard` — the operating-loop tile over the site's current stack.
 * One composition: a titled tile holding the current deployment's status and a
 * retry trigger that only appears once that deployment has failed. Two DATA
 * states of the single shape: `no-deployment` (site never published) and
 * `with-deployment`. Grounded in the real `ExpertDeploymentEntity`; the status
 * mirrors `ExpertDeploymentStatus`.
 */

/** The five deployment states — mirrors `ExpertDeploymentStatus`. */
export type DeployStatusKey = "pending" | "building" | "running" | "stopped" | "failed"

/** The current deployment, once the site has ever been published. */
export interface DeployStatusSnapshot {
    /** Where the stack sits in its lifecycle (`ExpertDeploymentEntity.status`). */
    status: DeployStatusKey
    /** Already-formatted time since this status was reached (e.g. "2 hours ago"). */
    updatedAtLabel: string
}

/** Props for {@link DeployStatusCard}. */
export interface DeployStatusCardProps {
    /**
     * The current deployment, or `null` before the site has ever been
     * published — no `ExpertDeploymentEntity` exists yet.
     */
    deployment: DeployStatusSnapshot | null
    /**
     * Retry a failed deployment — the connected layer re-runs orchestration.
     * Only ever reachable from the `failed` status (the retry trigger is
     * dropped for every other status).
     */
    onRetry: () => void
    /**
     * `true` → the tile's own first fetch is in flight: the status chip and
     * time caption shimmer in place of the resolved deployment (§12b).
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: DeployStatusCardLabels
}

/** The already-resolved copy the tile renders. */
export interface DeployStatusCardLabels {
    /** Tile title (e.g. "Deployment"). */
    title: string
    /** Status line before the site has ever been published. */
    notDeployedLabel: string
    /** The five status labels, keyed by status. */
    statusOptions: Record<DeployStatusKey, string>
    /** Retry button label, shown only in the `failed` status. */
    retryLabel: string
}

/**
 * Status → chip tone. `running` is the healthy resting state (success);
 * `failed` needs attention (danger); `building` is in-flight work (accent);
 * `pending`/`stopped` are quiet, non-urgent holds (default).
 */
const STATUS_TONE: Record<DeployStatusKey, ChipTone> = {
    pending: "default",
    building: "accent",
    running: "success",
    stopped: "default",
    failed: "danger",
}

/**
 * The deployment status tile. See the file header for why no-deployment vs
 * with-deployment are states of one shape rather than separate leaves, and how
 * `isSkeleton` mirrors the loaded row.
 *
 * @param props - {@link DeployStatusCardProps}
 */
const DeployStatusCard = ({ deployment, onRetry, isSkeleton = false, labels }: DeployStatusCardProps) => {
    const statusText = isSkeleton
        ? labels.notDeployedLabel
        : deployment
            ? labels.statusOptions[deployment.status]
            : labels.notDeployedLabel
    const tone: ChipTone = isSkeleton || !deployment ? "default" : STATUS_TONE[deployment.status]
    const showRetry = !isSkeleton && deployment?.status === "failed"

    return (
        <div data-tier="block" data-component="DeployStatusCard">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={2}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={2}
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Chip tone={tone} isSkeleton={isSkeleton} text={statusText} />,
                                        ...(!isSkeleton && deployment
                                            ? [() => (
                                                <Typography size="xs" color="muted" text={`· ${deployment.updatedAtLabel}`} />
                                            )]
                                            : []),
                                    ]}
                                />
                            ),
                            ...(showRetry
                                ? [() => (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        prefixIcon={ArrowClockwiseIcon}
                                        label={labels.retryLabel}
                                        onPress={onRetry}
                                    />
                                )]
                                : []),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { DeployStatusCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "DeployStatusCard" } as const
