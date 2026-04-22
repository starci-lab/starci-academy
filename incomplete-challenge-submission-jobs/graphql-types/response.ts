import {
    Field,
    ID,
    ObjectType,
} from "@nestjs/graphql"
import {
    GraphQLTypeJobStatus,
    JobStatus,
} from "@modules/databases"
import {
    AbstractGraphQLResponse,
    IAbstractGraphQLResponse,
} from "@modules/api"

@ObjectType({
    description: "Minimal job row: only id and status (no payload or execution data).",
})
export class IncompleteChallengeJobSnapshot {
    @Field(
        () => ID,
        {
            description: "Job primary id (`jobs.id`).",
        },
    )
        id: string

    @Field(
        () => GraphQLTypeJobStatus,
        {
            description: "Current job status.",
        },
    )
        status: JobStatus
}

@ObjectType({
    description: "Latest processing job for one user challenge submission.",
})
export class UserChallengeSubmissionIncompleteJobsItem {
    @Field(
        () => ID,
        {
            description: "User challenge submission id (`user_challenge_submissions.id`).",
        },
    )
        userChallengeSubmissionId: string

    @Field(
        () => IncompleteChallengeJobSnapshot,
        {
            nullable: true,
            description:
                "Most recently queued job still in `processing` for this submission (by `queue_at` desc). Omitted when none.",
        },
    )
        job: IncompleteChallengeJobSnapshot | null
}

@ObjectType({
    description: "Grouped processing jobs for the current user's challenge submissions.",
})
export class IncompleteChallengeSubmissionJobsResponseData {
    @Field(
        () => [UserChallengeSubmissionIncompleteJobsItem],
        {
            description: "One entry per user challenge submission.",
        },
    )
        items: Array<UserChallengeSubmissionIncompleteJobsItem>
}

@ObjectType({
    description: "Response wrapper for processing challenge submission jobs.",
})
export class IncompleteChallengeSubmissionJobsResponse
    extends AbstractGraphQLResponse
    implements IAbstractGraphQLResponse<IncompleteChallengeSubmissionJobsResponseData>
{
    @Field(
        () => IncompleteChallengeSubmissionJobsResponseData,
        {
            description: "Payload with jobs grouped by user challenge submission.",
        },
    )
        data: IncompleteChallengeSubmissionJobsResponseData
}
