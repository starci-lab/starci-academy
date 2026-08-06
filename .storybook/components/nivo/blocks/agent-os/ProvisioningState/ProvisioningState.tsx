import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Spinner } from "@sb-components/atoms/display/Spinner/Spinner"
import { StepBadge } from "@sb-components/atoms/display/StepBadge/StepBadge"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Stepper, type StepperStep } from "@sb-components/composites/navigation/Stepper/Stepper"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ProvisioningState` — the pod-spinning-up waiting surface between choosing a
 * tier and landing in the console: a spinner, a fixed 3-step progress, and the
 * pending `externalWorkspaceRef`. One composition; `currentStepIndex` (which
 * step is in flight) and `externalWorkspaceRef` (assigned or still pending) are
 * DATA states of the single shape. Grounded in
 * `AgentWorkspaceEntity.status === "provisioning"`.
 *
 * Also carries a low-emphasis "stuck? cancel and retry" control
 * (`onMarkFailed`) — the owner-triggered `AgentWorkspaceAction.MarkFailed`
 * escape hatch out of a provisioning pod that never finished. Optional so the
 * surface still composes without it; the connected layer always supplies it.
 */

/** Copy for one of the three fixed steps. */
export interface ProvisioningStepLabels {
    /** Step title (e.g. "Provision workspace"). */
    label: string
    /** One-line note under the title. */
    description: string
}

/** The already-resolved copy the surface renders. */
export interface ProvisioningStateLabels {
    /** Heading (e.g. "Setting up your Agent OS…"). */
    title: string
    /** Supporting line under the heading — already includes the chosen tier's name. */
    description: string
    /** Label before the workspace ref (e.g. "externalWorkspaceRef:"). */
    refLabel: string
    /** Shown in place of the ref while it hasn't been assigned yet. */
    refPendingLabel: string
    /** The three fixed steps' copy, in order: provision workspace, install agent, connect channels. */
    steps: readonly [ProvisioningStepLabels, ProvisioningStepLabels, ProvisioningStepLabels]
    /**
     * Label for the low-emphasis "stuck? cancel and retry" escape hatch
     * (`onMarkFailed`) — only rendered when that handler is supplied.
     */
    markFailedLabel: string
}

/** Props for {@link ProvisioningState}. */
export interface ProvisioningStateProps {
    /**
     * 0-based index of the step currently in flight. `3` marks the whole flow
     * complete (every step done) — the moment right before the caller hands off
     * to the console. Clamped to `[0, 3]` by `Stepper`.
     */
    currentStepIndex: number
    /** Assigned once provisioning finishes — `null` while still waiting on it. */
    externalWorkspaceRef: string | null
    /**
     * Fires the owner-triggered `AgentWorkspaceAction.MarkFailed` escape hatch
     * out of a stuck `provisioning` pod — lands on `failed`, from where the
     * console's own retry can run. Omitted → the control does not render at
     * all (e.g. the surface's own first load, before the connected layer has
     * anything to act on).
     */
    onMarkFailed?: () => void
    /** `true` → the mark-failed mutation is in flight: the control shows a spinner and locks. */
    isMarkingFailed?: boolean
    /**
     * `true` → the surface's own first read of the workspace status hasn't
     * resolved yet: the heading, description, the three step rows, and the ref
     * line all shimmer. Threaded straight down — never fed to a separate
     * skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ProvisioningStateLabels
}

const STEP_IDS = ["provision-workspace", "install-agent", "connect-channels"] as const

/**
 * Hand-mirrors the three real step rows (`StepBadge` + title + note) while
 * loading — see the file header for why this exists instead of an `isSkeleton`
 * on `Stepper` itself.
 */
const ProvisioningStepsSkeleton = () => (
    <StackV
        gap={4}
        isSkeleton
        classNames={["w-full"]}
        items={STEP_IDS.map(() => () => (
            <StackH
                gap={3}
                isSkeleton
                items={[
                    () => <StepBadge isSkeleton />,
                    () => (
                        <StackV
                            gap={1}
                            isSkeleton
                            classNames={["w-full"]}
                            items={[
                                () => (
                                    <div className="w-1/3 [&>*]:!w-full">
                                        <Typography size="sm" isSkeleton />
                                    </div>
                                ),
                                () => (
                                    <div className="w-2/3 [&>*]:!w-full">
                                        <Typography size="xs" isSkeleton />
                                    </div>
                                ),
                            ]}
                        />
                    ),
                ]}
            />
        ))}
    />
)

/**
 * The provisioning waiting surface. See the file header for why
 * `currentStepIndex` is a state of one shape rather than three separate leaves.
 *
 * @param props - {@link ProvisioningStateProps}
 */
const ProvisioningState = ({
    currentStepIndex,
    externalWorkspaceRef,
    onMarkFailed,
    isMarkingFailed = false,
    isSkeleton = false,
    labels,
}: ProvisioningStateProps) => {
    const steps: ReadonlyArray<StepperStep> = STEP_IDS.map((id, index) => ({
        id,
        label: labels.steps[index].label,
        description: labels.steps[index].description,
    }))

    return (
        <div data-tier="block" data-component="ProvisioningState">
            <SurfaceCard
                padding={4}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={5}
                        principle="group-boundary"
                        align="center"
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Spinner size="lg" />,
                            () => <Typography size="h4" weight="bold" align="center" isSkeleton={isSkeleton} text={labels.title} />,
                            () => <Typography size="sm" color="muted" align="center" isSkeleton={isSkeleton} text={labels.description} />,
                            () =>
                                isSkeleton ? (
                                    <ProvisioningStepsSkeleton />
                                ) : (
                                    <Stepper steps={steps} currentIndex={currentStepIndex} orientation="vertical" />
                                ),
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={isSkeleton}
                                    text={`${labels.refLabel} ${externalWorkspaceRef ?? labels.refPendingLabel}`}
                                />
                            ),
                            // Low-emphasis escape hatch out of a stuck `provisioning` pod —
                            // only rendered once a real handler exists (never during the
                            // surface's own first-load skeleton, which has nothing to act on).
                            ...(!isSkeleton && onMarkFailed
                                ? [
                                    () => (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            label={labels.markFailedLabel}
                                            onPress={onMarkFailed}
                                            isPending={isMarkingFailed}
                                        />
                                    ),
                                ]
                                : []),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { ProvisioningState }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ProvisioningState" } as const
