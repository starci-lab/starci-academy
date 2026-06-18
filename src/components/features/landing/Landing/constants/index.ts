/** Wedge "why we're different" pillars — keys map to `landing.wedge.items.{key}.*`. */
export const LANDING_WEDGE_KEYS = [
    "content",
    "challenge",
    "aiGrading",
] as const

/** Two-sided outcome cards — keys map to `landing.outcome.items.{key}.*`. */
export const LANDING_OUTCOME_KEYS = [
    "engineer",
    "enterprise",
] as const

/** Learning tracks shown on the ladder — keys map to `landing.roadmap.tracks.{key}.*`. */
export const LANDING_TRACK_KEYS = [
    "fullstack",
    "devops",
    "security",
    "architect",
] as const

/** FAQ rows — content lives at `landing.faq.q{n}` / `landing.faq.a{n}`. */
export const LANDING_FAQ_INDEXES = [1, 2, 3, 4, 5] as const

/** Technical keyword strip under the hero CTAs (audience gate; not translated). */
export const LANDING_HERO_KEYWORDS = [
    "microservices",
    "eventual consistency",
    "CAP theorem",
    "idempotency",
] as const

/** Hide the recruiter-proof beat below this many open-to-work profiles. */
export const LANDING_RECRUITER_MIN = 3
