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
/**
 * One authored DIRECTED flow edge inside a pod's drill-down — the REAL topology,
 * not a generic Core→member fan-out. `from`/`to` reference node ids: a pod
 * `member` name, the reserved `"core"` id, or a "borrowed" node from another pod
 * when the true flow needs it (data shows Kafka+ES, coding shows Redis, auth
 * shows GitHub — pods are conceptual). `eventual` renders the wire faint +
 * dashed (async / CDC / OAuth federation); `webhook` marks a return arrow (a
 * gateway IPN / callback running BACK to Core).
 */
export interface PodFlowEdge {
    /** Source node id (member name / `"core"` / borrowed component name). */
    from: string
    /** Target node id. */
    to: string
    /** Async / eventual link — rendered faint + dashed. */
    eventual?: boolean
    /** A callback / IPN return arrow (gateway → Core). */
    webhook?: boolean
}

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
    /**
     * The pod's REAL directed flow (authored) — read by
     * {@link import("./ArchitectureMap/pod-detail-scene").buildPodDetailScene} to
     * lay nodes out by flow SHAPE (chain vs fan/tree) and emit correct arrows.
     * MAY reference a borrowed node (another pod's member) so the true flow
     * reads end-to-end. When omitted the detail falls back to Core→member fan.
     */
    flow?: Array<PodFlowEdge>
}

/**
 * The 8 pods rendered on the overview, each mapping to real components. `kafka`
 * appears in both `data` and `events` on purpose (a component can belong to >1
 * pod). Order here is the overview ring order.
 */
export const ARCHITECTURE_PODS: Array<ArchitecturePod> = [
    {
        id: "payment",
        nameKey: "payment",
        members: ["stripe", "paypal", "payos", "sepay"],
        icon: CreditCardIcon,
        // FAN + return: Core charges each gateway, each gateway IPNs/webhooks back.
        flow: [
            { from: "core", to: "stripe" },
            { from: "core", to: "paypal" },
            { from: "core", to: "payos" },
            { from: "core", to: "sepay" },
            { from: "stripe", to: "core", eventual: true, webhook: true },
            { from: "paypal", to: "core", eventual: true, webhook: true },
            { from: "payos", to: "core", eventual: true, webhook: true },
            { from: "sepay", to: "core", eventual: true, webhook: true },
        ],
    },
    {
        id: "auth",
        nameKey: "auth",
        members: ["keycloak", "github"],
        icon: KeyIcon,
        // CHAIN: Core → Keycloak → GitHub (OAuth IdP federation).
        flow: [
            { from: "core", to: "keycloak" },
            { from: "keycloak", to: "github", eventual: true },
        ],
    },
    {
        id: "ai",
        nameKey: "ai",
        members: ["aiBalancer", "ollama", "qdrant"],
        icon: BrainIcon,
        // TREE: Core → aiBalancer → Ollama (local); Core → Qdrant (RAG).
        flow: [
            { from: "core", to: "aiBalancer" },
            { from: "aiBalancer", to: "ollama", eventual: true },
            { from: "core", to: "qdrant" },
        ],
    },
    {
        id: "data",
        nameKey: "data",
        members: ["postgres", "kafka", "elasticsearch"],
        icon: DatabaseIcon,
        // CHAIN: Core → Postgres → Kafka (Debezium CDC, async) → Elasticsearch;
        // faint Core ⇠ ES read edge closes the read-model loop.
        flow: [
            { from: "core", to: "postgres" },
            { from: "postgres", to: "kafka", eventual: true },
            { from: "kafka", to: "elasticsearch", eventual: true },
            { from: "elasticsearch", to: "core", eventual: true },
        ],
    },
    {
        id: "events",
        nameKey: "events",
        members: ["kafka", "nats"],
        icon: RadioIcon,
        // FAN: Core → NATS (job status); Postgres → Kafka (CDC, borrowed Postgres).
        flow: [
            { from: "core", to: "nats" },
            { from: "postgres", to: "kafka", eventual: true },
        ],
    },
    {
        id: "media",
        nameKey: "media",
        members: ["minio"],
        icon: HardDrivesIcon,
        // SINGLE: Core → MinIO.
        flow: [{ from: "core", to: "minio" }],
    },
    {
        id: "coding",
        nameKey: "coding",
        members: ["judge0"],
        icon: TerminalIcon,
        // CHAIN: Core → Redis (BullMQ queue, borrowed) → Judge0.
        flow: [
            { from: "core", to: "redis" },
            { from: "redis", to: "judge0", eventual: true },
        ],
    },
    {
        id: "notify",
        nameKey: "notify",
        members: ["mail"],
        icon: EnvelopeIcon,
        // FAN: Core → NATS (borrowed) · Core → Mail (Brevo).
        flow: [
            { from: "core", to: "nats" },
            { from: "core", to: "mail" },
        ],
    },
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
