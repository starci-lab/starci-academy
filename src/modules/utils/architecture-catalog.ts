import {
    BrainIcon,
    CircuitryIcon,
    CreditCardIcon,
    CubeIcon,
    DatabaseIcon,
    EnvelopeIcon,
    FileCodeIcon,
    GithubLogoIcon,
    GlobeIcon,
    HardDrivesIcon,
    KeyIcon,
    LightningIcon,
    MagnifyingGlassIcon,
    PaypalLogoIcon,
    RadioIcon,
    StackIcon,
    TerminalIcon,
    type Icon,
} from "@phosphor-icons/react"
import type { NodeKind } from "@/components/blocks/marketing/ArchitectureScene/types"

/**
 * Which side of the map a component sits on — StarCi's OWN infrastructure vs a
 * third-party SaaS it merely talks to (github, payment gateways…). Drives the
 * rail grouping AND the map's two clusters.
 */
export type ArchitectureGroup = "own" | "external"

/**
 * One entry in the architecture atlas — grounded in the backend's
 * `SystemHealthService.probeAll()` component list (the ONLY authoritative
 * source of names; every `name` below must match a probed component name 1:1,
 * else the live dot can never resolve for it).
 */
export interface ArchitectureComponent {
    /** Stable name — MUST match `systemHealthStatus.components[].name` exactly. */
    name: string
    /** Which side of the map this belongs to. */
    group: ArchitectureGroup
    /** Leading icon (phosphor). */
    icon: Icon
    /** Shape on the 3D map. */
    kind: NodeKind
    /** Short mono sub-label under the node's name on the 3D map (e.g. "cache · queue"). */
    mapSub: string
    /** i18n key suffix for the 1-2 sentence role blurb (`architecture.role.<key>`). */
    roleKey: string
    /** Blog post slug that deep-dives this component, if one exists. */
    blogSlug?: string
}

/**
 * The full, grounded component catalog — the same 17 names
 * `SystemHealthService` probes (`postgres`, `redis`, `nats`, `kafka`, `minio`,
 * `qdrant`, `elasticsearch`, `keycloak`, `judge0`, `ollama`, `mail`,
 * `aiBalancer` on StarCi's own side; `github`, `stripe`, `paypal`, `payos`,
 * `sepay` as external SaaS dependencies). Order here is the rail's display
 * order (own infra first, edge → data → async → platform, then externals).
 */
export const ARCHITECTURE_COMPONENTS: Array<ArchitectureComponent> = [
    // --- StarCi's own system --------------------------------------------
    {
        name: "postgres",
        group: "own",
        icon: DatabaseIcon,
        kind: "database",
        mapSub: "source of truth",
        roleKey: "postgres",
        blogSlug: "tu-redis-cache-sang-cqrs-projection",
    },
    {
        name: "redis",
        group: "own",
        icon: LightningIcon,
        kind: "database",
        mapSub: "cache · queue",
        roleKey: "redis",
        blogSlug: "tu-redis-cache-sang-cqrs-projection",
    },
    {
        name: "kafka",
        group: "own",
        icon: StackIcon,
        kind: "broker",
        mapSub: "debezium · cdc",
        roleKey: "kafka",
        blogSlug: "kafka-vs-rabbitmq-chon-cai-nao",
    },
    {
        name: "nats",
        group: "own",
        icon: RadioIcon,
        kind: "broker",
        mapSub: "jetstream · jobs",
        roleKey: "nats",
        blogSlug: "realtime-socketio-cdc-backbone",
    },
    {
        name: "minio",
        group: "own",
        icon: HardDrivesIcon,
        kind: "database",
        mapSub: "media · s3",
        roleKey: "minio",
    },
    {
        name: "qdrant",
        group: "own",
        icon: CircuitryIcon,
        kind: "database",
        mapSub: "vectors · rag",
        roleKey: "qdrant",
        blogSlug: "rag-qdrant-langchain",
    },
    {
        name: "elasticsearch",
        group: "own",
        icon: MagnifyingGlassIcon,
        kind: "database",
        mapSub: "search index",
        roleKey: "elasticsearch",
    },
    {
        name: "keycloak",
        group: "own",
        icon: KeyIcon,
        kind: "container",
        mapSub: "auth · oidc",
        roleKey: "keycloak",
        blogSlug: "keycloak-two-device-sessions",
    },
    {
        name: "judge0",
        group: "own",
        icon: TerminalIcon,
        kind: "container",
        mapSub: "code runner",
        roleKey: "judge0",
        blogSlug: "coding-judge-judge0-bullmq",
    },
    {
        name: "ollama",
        group: "own",
        icon: BrainIcon,
        kind: "container",
        mapSub: "local llm",
        roleKey: "ollama",
        blogSlug: "rag-qdrant-langchain",
    },
    {
        name: "mail",
        group: "own",
        icon: EnvelopeIcon,
        kind: "container",
        mapSub: "brevo smtp",
        roleKey: "mail",
    },
    {
        name: "aiBalancer",
        group: "own",
        icon: CubeIcon,
        kind: "container",
        mapSub: "multi-provider",
        roleKey: "aiBalancer",
        blogSlug: "ai-balancer-multi-provider-routing",
    },
    // --- external SaaS dependencies --------------------------------------
    {
        name: "github",
        group: "external",
        icon: GithubLogoIcon,
        kind: "container",
        mapSub: "oauth · teams",
        roleKey: "github",
    },
    {
        name: "stripe",
        group: "external",
        icon: CreditCardIcon,
        kind: "container",
        mapSub: "intl. cards",
        roleKey: "stripe",
    },
    {
        name: "paypal",
        group: "external",
        icon: PaypalLogoIcon,
        kind: "container",
        mapSub: "intl. wallet",
        roleKey: "paypal",
    },
    {
        name: "payos",
        group: "external",
        icon: FileCodeIcon,
        kind: "container",
        mapSub: "vn bank/qr",
        roleKey: "payos",
    },
    {
        name: "sepay",
        group: "external",
        icon: GlobeIcon,
        kind: "container",
        mapSub: "vn bank",
        roleKey: "sepay",
    },
]

/** Fast lookup by component name. */
export const ARCHITECTURE_COMPONENT_MAP: Record<string, ArchitectureComponent> = Object.fromEntries(
    ARCHITECTURE_COMPONENTS.map((component) => [component.name, component]),
)

/** The default selected node (first "own" component) — used when `?node=` is absent/invalid. */
export const DEFAULT_ARCHITECTURE_NODE = ARCHITECTURE_COMPONENTS[0].name

/** Poll interval (ms) for the live health sweep — jittered client-side so many
 *  open tabs don't all hit the backend on the exact same tick. Kept above the
 *  backend's 5s sweep cache so every poll has a fair chance of fresh data. */
export const HEALTH_POLL_INTERVAL_MS = 7000

/** Random per-mount jitter (ms) added once to the poll interval. */
export const HEALTH_POLL_JITTER_MS = 2000
