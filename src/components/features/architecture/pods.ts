import {
    BrainIcon,
    CreditCardIcon,
    DatabaseIcon,
    EnvelopeIcon,
    HardDrivesIcon,
    KeyIcon,
    RadioIcon,
    TerminalIcon,
    type Icon,
} from "@phosphor-icons/react"
import type { SceneTone, StatusTone } from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "./hooks/useSystemHealthPoll"

/**
 * A functional POD — a grouping of real components by CAPABILITY (payment,
 * auth, ai, data…), the overview's unit instead of 17 flat nodes. Each pod's
 * `members` are REAL `systemHealthStatus` component names (must match
 * {@link ARCHITECTURE_COMPONENTS} 1:1, so a member's live status resolves); a
 * component MAY belong to more than one pod (e.g. `kafka` is both `data` and
 * `events`).
 *
 * Grounded in the sub-scene table of `architecture-atlas-pod-drilldown.md`.
 */
export interface ArchitecturePod {
    /** Stable pod id — mirrored to the URL (`?pod=payment`). */
    id: string
    /** i18n key suffix for the pod name (`architecture.pod.<nameKey>.name`). */
    nameKey: string
    /** i18n key suffix for the short sub-label under the name, if any. */
    subKey?: string
    /** Real component names in this pod (each must match a probed component). */
    members: Array<string>
    /** Leading / pod icon (phosphor). */
    icon: Icon
}

/**
 * The 8 pods rendered on the overview, each mapping to real components. `kafka`
 * appears in both `data` and `events` on purpose (a component can belong to >1
 * pod). Order here is the overview ring order.
 */
export const ARCHITECTURE_PODS: Array<ArchitecturePod> = [
    { id: "payment", nameKey: "payment", members: ["stripe", "paypal", "payos", "sepay"], icon: CreditCardIcon },
    { id: "auth", nameKey: "auth", members: ["keycloak", "github"], icon: KeyIcon },
    { id: "ai", nameKey: "ai", members: ["aiBalancer", "ollama", "qdrant"], icon: BrainIcon },
    { id: "data", nameKey: "data", members: ["postgres", "kafka", "elasticsearch"], icon: DatabaseIcon },
    { id: "events", nameKey: "events", members: ["kafka", "nats"], icon: RadioIcon },
    { id: "media", nameKey: "media", members: ["minio"], icon: HardDrivesIcon },
    { id: "coding", nameKey: "coding", members: ["judge0"], icon: TerminalIcon },
    { id: "notify", nameKey: "notify", members: ["mail"], icon: EnvelopeIcon },
]

/** Fast lookup by pod id. */
export const ARCHITECTURE_POD_MAP: Record<string, ArchitecturePod> = Object.fromEntries(
    ARCHITECTURE_PODS.map((pod) => [pod.id, pod]),
)

/**
 * Roll-up red threshold (`architecture-atlas-pod-drilldown.md` §Luật 3): a pod
 * turns RED only when at least this fraction of its members are NOT up
 * (`down` + `unknown`, counted over ALL members). Kept a constant so one dead
 * payment provider (1 of 4) reads yellow, not red.
 */
export const POD_RED_RATIO = 0.75

/** The rolled-up display of a pod: a scene tone + an optional status badge. */
export interface PodRollup {
    /** Scene tone for the hex pod mesh (`success` green / `danger` red / `normal`). */
    tone: SceneTone
    /** Status badge (dot + text) shown in the pod's label — never omitted so the
     *  pod always carries a text status, never colour-only (a11y). */
    status: { tone: StatusTone; text: string }
}

/**
 * Rolls a pod's live status up from its members' real statuses, applying the
 * STRICT thresholds from the rule doc — honesty first: never a synthesized
 * green.
 *
 * - `healthByName === null` (no probe resolved yet) → tone `normal` + an `info`
 *   "checking…" badge (the whole overview reads gray before the first sweep).
 * - else over the members' statuses:
 *   - EVERY member `up` → tone `success` (green).
 *   - else if `(down + unknown + degraded-as-not-up)` — specifically
 *     `(down + unknown) / total >= POD_RED_RATIO` — → tone `danger` (red).
 *     `degraded` members are not-up so they never let the pod go green and they
 *     count toward the red ratio alongside `down`/`unknown`.
 *   - else → tone `normal` + a `warning` "degraded" badge (yellow / mixed).
 *
 * @param members - Real component names in the pod.
 * @param healthByName - Latest poll result, or `null` before the first resolve.
 * @param labels - i18n'd badge texts (`checking` / `up` / `degraded`).
 */
export const computePodStatus = (
    members: Array<string>,
    healthByName: HealthByName | null,
    labels: { checking: string; up: string; degraded: string },
): PodRollup => {
    if (healthByName === null) {
        return { tone: "normal", status: { tone: "info", text: labels.checking } }
    }

    const total = members.length
    let up = 0
    let notUp = 0
    for (const name of members) {
        const status = healthByName[name]?.status
        if (status === "up") {
            up += 1
        } else {
            // down · unknown (no entry / unexpected) · degraded → all "not up"
            notUp += 1
        }
    }

    if (up === total) {
        return { tone: "success", status: { tone: "success", text: labels.up } }
    }
    if (total > 0 && notUp / total >= POD_RED_RATIO) {
        return { tone: "danger", status: { tone: "warning", text: labels.degraded } }
    }
    return { tone: "normal", status: { tone: "warning", text: labels.degraded } }
}
