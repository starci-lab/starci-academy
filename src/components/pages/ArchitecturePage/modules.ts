import {
    BellIcon,
    BookOpenTextIcon,
    BrainIcon,
    BriefcaseIcon,
    ChatsCircleIcon,
    CodeIcon,
    CreditCardIcon,
    ImageIcon,
    KeyIcon,
    TrophyIcon,
    type Icon,
} from "@phosphor-icons/react"

/**
 * A CORE feature module — one recognizable business domain inside the single
 * NestJS "Core API" (C4: the Container drilled to its Components). The atlas
 * used to render Core API as ONE node; instead we split it into these ~10
 * modules, each shown as its own node on the flat board wired to the real infra
 * it uses (`usesInfra`).
 *
 * HONESTY (STRICT): modules have NO health probe (`systemHealthStatus` only
 * probes the 17 infra/external components) — so a module node is ALWAYS neutral,
 * never carries a live status dot. Only infra/external nodes get a real dot.
 */
export interface ArchitectureModule {
    /** Stable id — mirrored to `?node=<id>` + i18n key (`architecture.module.<id>.*`). */
    id: string
    /** Leading icon (phosphor). */
    icon: Icon
    /** Real infra/external component names this module talks to (must match `ARCHITECTURE_COMPONENTS`). */
    usesInfra: Array<string>
}

/**
 * The ~10 curated feature domains that make up the Core API — grounded in the
 * backend's `src/modules/bussiness/*` + graphql queries/mutations, kept to the
 * domains a viewer recognizes (many tiny CQRS modules roll up into these).
 * `usesInfra` names drive the "select a module → light up the infra it runs on"
 * story (the architecture reading, without pod clutter).
 */
export const ARCHITECTURE_MODULES: Array<ArchitectureModule> = [
    { id: "auth", icon: KeyIcon, usesInfra: ["keycloak", "github"] },
    { id: "learning", icon: BookOpenTextIcon, usesInfra: ["postgres", "elasticsearch", "minio"] },
    { id: "coding", icon: CodeIcon, usesInfra: ["judge0", "redis"] },
    { id: "ai", icon: BrainIcon, usesInfra: ["aiBalancer", "ollama", "qdrant"] },
    { id: "payment", icon: CreditCardIcon, usesInfra: ["stripe", "paypal", "payos", "sepay"] },
    { id: "community", icon: ChatsCircleIcon, usesInfra: ["postgres", "nats"] },
    { id: "careers", icon: BriefcaseIcon, usesInfra: ["postgres"] },
    { id: "notify", icon: BellIcon, usesInfra: ["nats", "mail"] },
    { id: "ranking", icon: TrophyIcon, usesInfra: ["postgres", "redis"] },
    { id: "media", icon: ImageIcon, usesInfra: ["minio"] },
]

/** Fast lookup by module id. */
export const ARCHITECTURE_MODULE_MAP: Record<string, ArchitectureModule> = Object.fromEntries(
    ARCHITECTURE_MODULES.map((module) => [module.id, module]),
)

/** True when an id names a feature module (vs a probed infra/external component). */
export const isArchitectureModuleId = (id: string): boolean => Boolean(ARCHITECTURE_MODULE_MAP[id])
