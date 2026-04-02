/**
 * Submission requirement kind (GraphQL `GraphQLTypeSubmissionType` / DB `submission_type`).
 * Mirrors `ref/challenge-submission.entity.ts` (`SubmissionType`).
 */
export enum SubmissionType {
    GoogleDocsUrl = "googleDocsUrl",
    GithubUrl = "githubUrl",
}
