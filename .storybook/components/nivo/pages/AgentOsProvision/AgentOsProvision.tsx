import type { ReactNode } from "react"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    AgentOsProvisionCard,
    type AgentOsProvisionCardLabels,
} from "@sb-components/nivo/blocks/agent-os/AgentOsProvisionCard/AgentOsProvisionCard"
import type { PricingTierRow } from "@sb-components/nivo/blocks/agent-os/PricingTierCard/PricingTierCard"
import {
    ProvisioningState,
    type ProvisioningStateLabels,
} from "@sb-components/nivo/blocks/agent-os/ProvisioningState/ProvisioningState"
import {
    OperatingLoopVisual,
    type OperatingLoopVisualNode,
} from "@sb-components/nivo/blocks/landing/OperatingLoopVisual/OperatingLoopVisual"

/**
 * `AgentOsProvision` — the PAGE at `/agent-os` before a pod exists: a list of
 * functions, not a shape of its own. It NAMES `AgentOsProvisionCard` (the hero
 * + the three real monthly tiers, already composed inside that block) above
 * `OperatingLoopVisual` (the shared brand loop motif, lit on the AI stage —
 * the layer Agent OS itself is) while `status = "no-pod"`, and swaps the whole
 * body for `ProvisioningState` (the waiting screen) once `status =
 * "provisioning"` — the rail does not show there (the prototype's own S2 has
 * no loop under the spinner). This is the content this route mounts into
 * `DashboardShell`'s `content` slot; the shell itself sits ABOVE this page (a
 * page may import blocks/composites/frames, never a layout), so this file
 * renders standalone, never wrapping `DashboardShell` around itself.
 *
 * `status` is the page's own two-way vocabulary — `"no-pod"` / `"provisioning"`
 * — matching the proposal's own state matrix for this surface: `no-pod` (tier
 * picker + loop) onward `Rent` into `provisioning` (steps + spinner) onward
 * auto into the console (`AgentOsConsole`, a separate page this one hands off
 * to, never rendered from here). A page's story is one complete STATE per
 * render, not a leaf-per-prop map — the two states here are exactly those two.
 * Grounded in `AgentWorkspaceEntity` (one-to-one `catalogOrder`, SKU
 * `nivo-ai-agent`) and its three real monthly tiers (Basic 490,000 / Pro
 * 990,000 / Scale 2,400,000 VND, `catalog-seeder.service.ts`) — no fabricated
 * proof numbers.
 */

/** The page's own two-way vocabulary — pre-pod vs. the pod spinning up. */
export type AgentOsProvisionStatus = "no-pod" | "provisioning"

/** Already-localized copy for every region this page arranges. */
export interface AgentOsProvisionLabels {
    /** Forwarded to `AgentOsProvisionCard` (extends `PricingTierCard`'s own labels). */
    hero: AgentOsProvisionCardLabels
    /** Forwarded to `ProvisioningState`. */
    provisioning: ProvisioningStateLabels
}

/** Fields the page needs while no pod exists yet. */
interface AgentOsProvisionNoPod {
    status: "no-pod"
    /** The three real monthly tiers, in display order — forwarded to `AgentOsProvisionCard`. */
    tiers: ReadonlyArray<PricingTierRow>
    /** Which tier is currently highlighted (controlled) — forwarded to `AgentOsProvisionCard`. */
    selectedTierId: string
    /** Fired with the newly chosen tier's id. */
    onSelectTier: (tierId: string) => void
    /** Fired by the primary CTA — the connected layer places the order and starts provisioning. */
    onProvision: () => void
    /** `true` → the provision mutation is in flight — forwarded to `AgentOsProvisionCard`. */
    isProvisioning?: boolean
    /** The shared brand loop's six stages, in order — forwarded to `OperatingLoopVisual` (that block's own `nodes` prop is a mutable `Array`, so this stays one too). */
    loopNodes: Array<OperatingLoopVisualNode>
    /** Which loop stage glows crimson — forwarded to `OperatingLoopVisual`. Agent OS IS the AI stage, so this is fixed by the connected layer to `"ai-agent"` rather than varying with data. */
    activeLoopNodeId: string
}

/** Fields the page needs while the pod is spinning up. */
interface AgentOsProvisionProvisioning {
    status: "provisioning"
    /** 0-based index of the step currently in flight — forwarded to `ProvisioningState`. */
    currentStepIndex: number
    /** Assigned once provisioning finishes — forwarded to `ProvisioningState`. */
    externalWorkspaceRef: string | null
}

/**
 * Props for {@link AgentOsProvision} — a discriminated union on `status`, the
 * same two-way split the file header explains.
 */
export type AgentOsProvisionProps = { labels: AgentOsProvisionLabels } & (AgentOsProvisionNoPod | AgentOsProvisionProvisioning)

/**
 * The `/agent-os` pre-pod view. See the file header for why the two statuses
 * are the whole state matrix and why the loop only shows in `no-pod`.
 *
 * @param props - {@link AgentOsProvisionProps}
 */
const AgentOsProvision = (props: AgentOsProvisionProps) => {
    const shell = (children: ReactNode) => (
        <div data-tier="page" data-component="AgentOsProvision" className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
            {children}
        </div>
    )

    if (props.status === "provisioning") {
        return shell(
            <ProvisioningState
                currentStepIndex={props.currentStepIndex}
                externalWorkspaceRef={props.externalWorkspaceRef}
                labels={props.labels.provisioning}
            />,
        )
    }

    return shell(
        <StackV
            gap={8}
            items={[
                () => (
                    <AgentOsProvisionCard
                        tiers={props.tiers}
                        selectedTierId={props.selectedTierId}
                        onSelectTier={props.onSelectTier}
                        onProvision={props.onProvision}
                        isProvisioning={props.isProvisioning}
                        labels={props.labels.hero}
                    />
                ),
                () => <OperatingLoopVisual nodes={props.loopNodes} activeNodeId={props.activeLoopNodeId} />,
            ]}
        />,
    )
}

export { AgentOsProvision }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "AgentOsProvision" } as const
