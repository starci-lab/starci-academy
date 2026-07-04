/**
 * How a candidate applies to a job posting (GraphQL / DB enum).
 */
export enum JobApplyMethod {
    /** Apply via an external URL (careers page, ATS, form…). */
    ExternalUrl = "externalUrl",
    /** Apply by emailing the listed contact address. */
    Email = "email",
}
