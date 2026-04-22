import {
    Field,
    ID,
    InputType,
} from "@nestjs/graphql"

@InputType({
    description: "Optional filters for listing processing jobs per user challenge submission.",
})
export class IncompleteChallengeSubmissionJobsRequest {
    @Field(
        () => ID,
        {
            nullable: true,
            description:
                "User to list jobs for. Defaults to the authenticated user. Must be the same as the current user.",
        },
    )
        userId?: string

    @Field(
        () => Boolean,
        {
            nullable: true,
            defaultValue: true,
            description:
                "When true, every user challenge submission row is returned (with an empty jobs array if none are processing). When false, only rows with at least one processing job are returned.",
        },
    )
        includeEmptySubmissions?: boolean
}
