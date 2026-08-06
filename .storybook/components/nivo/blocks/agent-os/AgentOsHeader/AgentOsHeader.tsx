import type { ReactNode } from "react"
import { ArrowClockwiseIcon, FileTextIcon, PauseIcon, PlayCircleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AgentOsHeader` — the Agent OS console masthead: pod name + status `Chip` +
 * `externalWorkspaceRef` + ONE primary action, which CHANGES with the status. Four
 * DATA states of the single shape (`provisioning`/`active`/`suspended`/`failed`)
 * rather than four leaves — the chip tone, which actions exist, and the ref line are
 * all derived from the same `status`, so drawing them as separate components would
 * let them drift out of sync. Grounded in `AgentWorkspaceEntity`
 * (`status: "provisioning" | "active" | "suspended" | "failed"`, `externalWorkspaceRef`).
 */

/** The header's own 4-way status vocabulary, mirroring `AgentWorkspaceEntity.status`. */
export type AgentOsHeaderStatus = "provisioning" | "active" | "suspended" | "failed"

/** Fields every branch shares — the identity, never the per-status actions. */
interface AgentOsHeaderIdentity {
    /** Already-composed masthead title (e.g. `"Agent OS · Pod Pro"`). */
    podName: string
    /**
     * `AgentWorkspaceEntity.externalWorkspaceRef` — `null` until the pod has
     * actually been provisioned (the `provisioning` status always passes `null`).
     */
    externalWorkspaceRef: string | null
    /** Already-localized copy. */
    labels: AgentOsHeaderLabels
}

/**
 * Props for {@link AgentOsHeader} — a discriminated union on `status`, the same
 * shape `AgentOsConsole` reads to decide which arm to render. Before the pod's
 * status is known (the console's own first fetch still in flight) `isSkeleton`
 * renders a representative `active` masthead, shimmering — so no `status`/data is
 * required in that arm.
 */
export type AgentOsHeaderProps =
    | { isSkeleton: true }
    | (AgentOsHeaderIdentity & { isSkeleton?: false } & (
        | { status: "provisioning" }
        | { status: "active"; onViewLog: () => void; onSuspend: () => void; isSuspending?: boolean }
        | { status: "suspended"; onResume: () => void; isResuming?: boolean }
        | { status: "failed"; onViewLog: () => void; onRetry: () => void; isRetrying?: boolean }
    ))

/** The already-resolved copy the masthead renders. */
export interface AgentOsHeaderLabels {
    /** Status chip copy, keyed by {@link AgentOsHeaderStatus}. */
    statusLabels: Record<AgentOsHeaderStatus, string>
    /** Prefix before the ref code (e.g. `"ref:"`). */
    refLabel: string
    /** Shown instead of a ref code while `externalWorkspaceRef` is still `null`. */
    refPendingLabel: string
    /** "View log" button label — `active`/`failed` only. */
    viewLogLabel: string
    /** Primary button label, `active` status. */
    suspendLabel: string
    /** Primary button label, `suspended` status. */
    resumeLabel: string
    /** Primary button label, `failed` status. */
    retryLabel: string
}

/** Status → chip tone: active is the healthy resting state, failed/suspended need attention or are quiet holds. */
const STATUS_TONE: Record<AgentOsHeaderStatus, ChipTone> = {
    provisioning: "default",
    active: "success",
    suspended: "warning",
    failed: "danger",
}

/**
 * The Agent OS console masthead. See the file header for why the four statuses are
 * states of one shape rather than four leaves.
 *
 * @param props - {@link AgentOsHeaderProps}
 */
const AgentOsHeader = (props: AgentOsHeaderProps) => {
    // ── LOADING (§12b): status isn't known yet, so the masthead shows a
    // representative `active` shape with every node shimmering — title, chip,
    // ref line, and both actions — matching the busiest real branch so nothing
    // jumps when the status lands.
    if (props.isSkeleton) {
        return (
            <div data-tier="block" data-component="AgentOsHeader">
                <SurfaceCard
                    padding={3}
                    isSkeleton
                    body={() => (
                        <StackH
                            gap={4}
                            principle="content-row"
                            justify="between"
                            at="sm"
                            isSkeleton
                            items={[
                                () => (
                                    <StackV
                                        gap={2}
                                        isSkeleton
                                        classNames={["min-w-0"]}
                                        items={[
                                            () => (
                                                <StackH
                                                    gap={3}
                                                    isSkeleton
                                                    items={[
                                                        () => <Typography size="lg" weight="semibold" isSkeleton text="Pod name" />,
                                                        () => <Chip tone="default" isSkeleton text="Status" />,
                                                    ]}
                                                />
                                            ),
                                            () => <Typography size="xs" color="muted" isSkeleton text="ref: aos-ws-0000000" />,
                                        ]}
                                    />
                                ),
                                () => (
                                    <StackH
                                        gap={3}
                                        isSkeleton
                                        classNames={["shrink-0"]}
                                        items={[
                                            () => <Button variant="ghost" prefixIcon={FileTextIcon} label="View log" isSkeleton onPress={() => {}} />,
                                            () => <Button variant="secondary" prefixIcon={PauseIcon} label="Suspend" isSkeleton onPress={() => {}} />,
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    )}
                />
            </div>
        )
    }

    const { podName, externalWorkspaceRef, labels } = props

    // ── PER-STATE ACTIONS: resolved once here, from `props.status` (not a
    // destructured copy, so the discriminated union narrows the SAME branch each
    // callback below reads from) — the chip and the buttons can never disagree
    // about which status is on screen.
    let primary: ReactNode = null
    let onViewLog: (() => void) | undefined
    if (props.status === "active") {
        primary = (
            <Button
                variant="secondary"
                prefixIcon={PauseIcon}
                label={labels.suspendLabel}
                onPress={props.onSuspend}
                isPending={props.isSuspending}
            />
        )
        onViewLog = props.onViewLog
    } else if (props.status === "suspended") {
        primary = (
            <Button
                variant="primary"
                prefixIcon={PlayCircleIcon}
                label={labels.resumeLabel}
                onPress={props.onResume}
                isPending={props.isResuming}
            />
        )
    } else if (props.status === "failed") {
        primary = (
            <Button
                variant="danger"
                prefixIcon={ArrowClockwiseIcon}
                label={labels.retryLabel}
                onPress={props.onRetry}
                isPending={props.isRetrying}
            />
        )
        onViewLog = props.onViewLog
    }
    // `provisioning` leaves both `primary` and `onViewLog` unset — see the file header.
    const status = props.status

    return (
        <div data-tier="block" data-component="AgentOsHeader">
            <SurfaceCard
                padding={3}
                body={() => (
                    <StackH
                        gap={4}
                        principle="content-row"
                        justify="between"
                        at="sm"
                        items={[
                            () => (
                                <StackV
                                    gap={2}
                                    classNames={["min-w-0"]}
                                    items={[
                                        () => (
                                            <StackH
                                                gap={3}
                                                items={[
                                                    () => <Typography size="lg" weight="semibold" truncate text={podName} />,
                                                    () => <Chip tone={STATUS_TONE[status]} text={labels.statusLabels[status]} />,
                                                ]}
                                            />
                                        ),
                                        () => (
                                            <StackH
                                                gap={1}
                                                items={[
                                                    () => <Typography size="xs" color="muted" text={labels.refLabel} />,
                                                    () => (
                                                        externalWorkspaceRef != null
                                                            ? <Typography size="code" text={externalWorkspaceRef} />
                                                            : <Typography size="xs" color="muted" text={labels.refPendingLabel} />
                                                    ),
                                                ]}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            ...(primary != null
                                ? [() => (
                                    <StackH
                                        gap={3}
                                        classNames={["shrink-0"]}
                                        items={[
                                            ...(onViewLog
                                                ? [() => (
                                                    <Button
                                                        variant="ghost"
                                                        prefixIcon={FileTextIcon}
                                                        label={labels.viewLogLabel}
                                                        onPress={onViewLog}
                                                    />
                                                )]
                                                : []),
                                            () => primary,
                                        ]}
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

export { AgentOsHeader }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AgentOsHeader" } as const
