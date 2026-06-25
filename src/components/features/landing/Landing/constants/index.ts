/** Vòng học 4 bước (read → grade → capstone → rank) — keys map to `landing.learnLoop.items.{key}.*`. */
export const LANDING_LOOP_STEPS = [
    "read",
    "grade",
    "capstone",
    "rank",
] as const

/** Two-sided outcome cards — keys map to `landing.outcome.items.{key}.*`. */
export const LANDING_OUTCOME_KEYS = [
    "engineer",
    "enterprise",
] as const

/** Mastery tracks shown on the roadmap — the 3 REAL courses (keys map to
 * `landing.roadmap.tracks.{key}.*`). Grounded: no "security"/"architect" course exists. */
export const LANDING_TRACK_KEYS = [
    "fullstack",
    "systemDesign",
    "devops",
] as const

/** Real systems built across the curriculum (capstones) — keys map to
 * `landing.systems.items.{key}.{name,badge}`. Curated highlight of the SD capstones
 * (proof of "build real systems, not CRUD"). Trimmed to 6 most representative. */
export const LANDING_SYSTEM_KEYS = [
    "newsfeed",
    "flashSale",
    "wallet",
    "rideHailing",
    "chat",
    "deploy",
] as const

/** Representative architecture flow per system (coded mini-diagram nodes; technical
 * terms kept in English — same in vi/en). Keyed by {@link LANDING_SYSTEM_KEYS}. */
export const LANDING_SYSTEM_FLOWS: Record<(typeof LANDING_SYSTEM_KEYS)[number], ReadonlyArray<string>> = {
    newsfeed: ["Client", "Fanout", "Cache", "DB"],
    flashSale: ["Client", "Queue", "Inventory", "DB"],
    wallet: ["API", "Ledger", "Saga", "DB"],
    rideHailing: ["GPS", "Geo-index", "Match", "Surge"],
    chat: ["WS", "Gateway", "Queue", "Store"],
    deploy: ["Git", "CI", "Registry", "K8s"],
}

/** Founder expertise chips — keys map to `landing.founder.expertise.{key}`. */
export const LANDING_FOUNDER_EXPERTISE = [
    "systemDesign",
    "blockchain",
    "aiAutomation",
] as const

/** FAQ rows — content lives at `landing.faq.q{n}` / `landing.faq.a{n}`. */
export const LANDING_FAQ_INDEXES = [1, 2, 3, 4, 5] as const

/**
 * Language strip under the hero CTAs (challenges are AI-graded in any of these).
 * Each carries its official brand colour as a `bg-[hex]/10 text-[hex]` tint (literal
 * Tailwind classes so they're picked up at build) — the strip reads alive, not muted,
 * and a dev recognises the language by its colour at a glance. Not translated.
 */
export const LANDING_HERO_KEYWORDS = [
    { label: "TypeScript", className: "bg-[#3178C6]/10 text-[#3178C6]" },
    { label: "Java", className: "bg-[#E76F00]/10 text-[#E76F00]" },
    { label: "C#", className: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
    { label: "Go", className: "bg-[#00ADD8]/10 text-[#00ADD8]" },
] as const

/** Featured tracks on the landing — the 3 flagship courses (others users search on
 * the catalog). Keys map to `landing.courses.items.{key}.{tag,title,desc,modules}`. */
export const LANDING_COURSE_TRACKS = [
    "fullstack",
    "systemDesign",
    "devops",
] as const

/** Mỗi track = 1 khóa THẬT. displayId/slug khóa để link "Vào khóa" → trang course detail
 * (`/courses/<slug>`). Grounded: slug khớp course thật trong DB. */
export const LANDING_TRACK_COURSE_SLUG: Record<(typeof LANDING_COURSE_TRACKS)[number], string> = {
    fullstack: "fullstack-mastery",
    systemDesign: "system-design-mastery",
    devops: "devops-mastery",
}

/** 4 tier (FOUNDATION → INTERMEDIATE → ADVANCED → APPLICATION) cho mỗi lộ trình — hiển thị
 * dạng cột dọc trong section Roadmap. label = micro-label kỹ thuật UPPERCASE (cho phép trên
 * landing này, render bằng Typography type="code"). topic = tóm tắt nội dung tiếng Anh kỹ thuật. */
export const LANDING_ROADMAP_TIERS: Record<
    (typeof LANDING_TRACK_KEYS)[number],
    ReadonlyArray<{ label: string; topic: string }>
> = {
    fullstack: [
        { label: "FOUNDATION",    topic: "HTTP, REST, data modeling" },
        { label: "INTERMEDIATE",  topic: "Auth, caching, background jobs" },
        { label: "ADVANCED",      topic: "Queues, websockets, rate limits" },
        { label: "APPLICATION",   topic: "Deploy, observability, payments" },
    ],
    systemDesign: [
        { label: "FOUNDATION",    topic: "Latency, throughput, CAP" },
        { label: "INTERMEDIATE",  topic: "Sharding, replication, indexes" },
        { label: "ADVANCED",      topic: "Consensus, idempotency, sagas" },
        { label: "APPLICATION",   topic: "Real systems end-to-end" },
    ],
    devops: [
        { label: "FOUNDATION",    topic: "Linux, containers, networking" },
        { label: "INTERMEDIATE",  topic: "CI/CD, IaC, secrets" },
        { label: "ADVANCED",      topic: "Kubernetes, autoscaling, SLOs" },
        { label: "APPLICATION",   topic: "Progressive delivery, DR" },
    ],
}

/** Hide the recruiter-proof beat below this many open-to-work profiles. */
export const LANDING_RECRUITER_MIN = 3

/** Tên đối tác tuyển dụng hiển thị dạng text-logo (giả lập). Không cần ảnh. */
export const LANDING_HIRING_PARTNERS = [
    "Northwind",
    "Aperture",
    "Lumen",
    "Kestrel",
    "Vertex",
] as const
