/**
 * Provenance of a job posting (GraphQL / DB enum) — NOT a moderation state; both
 * values are live immediately with no approval workflow.
 */
export enum JobPostingSource {
    /** Curated by the content team via the data-repo seed pipeline. */
    Seeded = "seeded",
    /** Submitted through the public `/jobs/post` form. */
    Submitted = "submitted",
}
