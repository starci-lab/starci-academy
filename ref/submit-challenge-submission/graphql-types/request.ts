import {
    Field,
    ID,
    InputType,
} from "@nestjs/graphql"

/** Request to queue automated grading for several submission definitions under one challenge. */
@InputType({
    description: "Challenge id plus `challenge_submissions.id` values to grade (GitHub only); user must have synced URLs first.",
})
export class SubmitChallengeSubmissionRequest {
    @Field(
        () => ID,
        {
            description: "`challenges.id` all listed submissions must belong to.",
        },
    )
        challengeId: string
}
