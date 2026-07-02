/**
 * Employment arrangement of a job posting (GraphQL / DB enum).
 */
export enum JobEmploymentType {
    /** Standard full-time employment. */
    Fulltime = "fulltime",
    /** Part-time employment. */
    Parttime = "parttime",
    /** Internship / early-career placement. */
    Internship = "internship",
    /** Fixed-term or freelance contract work. */
    Contract = "contract",
}
