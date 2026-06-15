/**
 * Recommended AI tier slugs surfaced on the StarCI AI screen.
 *
 * Values mirror the backend tier strings returned by the `aiModels` query and
 * are used as keys into the tier label/color lookup map.
 */
export enum StarciAiTier {
    /** Cheapest tier — optimised for cost. */
    Low = "low",
    /** Balanced tier — middle ground between cost and quality. */
    Medium = "medium",
    /** Highest-quality tier — premium models. */
    High = "high",
}
