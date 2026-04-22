import {
    Args,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import {
    GraphQLLocale,
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
} from "@modules/api"
import {
    UseThrottler,
    ThrottlerConfig,
} from "@modules/throttler"
import {
    Locale,
    UserEntity,
} from "@modules/databases"
import {
    KeycloakAuthGraphQLGuard,
    KeycloakGraphQLUser,
} from "@modules/keycloak"
import {
    GraphQLMustEnrolledGuard,
} from "@modules/bussiness"
import {
    IncompleteChallengeSubmissionJobsRequest,
    IncompleteChallengeSubmissionJobsResponse,
    IncompleteChallengeSubmissionJobsResponseData,
} from "./graphql-types"
import {
    IncompleteChallengeSubmissionJobsService,
} from "./incomplete-challenge-submission-jobs.service"

@Resolver()
export class IncompleteChallengeSubmissionJobsResolver {
    constructor(
        private readonly incompleteChallengeSubmissionJobsService: IncompleteChallengeSubmissionJobsService,
    ) {}

    @UseThrottler(ThrottlerConfig.Soft)
    @GraphQLSuccessMessage({
        [Locale.En]: "Processing jobs fetched successfully",
        [Locale.Vi]: "Lấy danh sách job đang xử lý theo bài nộp thành công",
    })
    @UseGuards(
        KeycloakAuthGraphQLGuard,
        GraphQLMustEnrolledGuard,
    )
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => IncompleteChallengeSubmissionJobsResponse,
        {
            name: "incompleteChallengeSubmissionJobs",
            description:
                "Per user challenge submission, returns the latest `processing` job (by `queue_at` desc) as id + status only; no payload. `request.userId` defaults to the current user and must match the authenticated user.",
        },
    )
    async execute(
        @KeycloakGraphQLUser()
            user: UserEntity,
        @Args(
            "request",
            {
                description: "Optional filters (e.g. hide submissions with no processing jobs).",
            },
        )
            request: IncompleteChallengeSubmissionJobsRequest,
        @GraphQLLocale()
            locale: Locale,
    ): Promise<IncompleteChallengeSubmissionJobsResponseData> {
        return this.incompleteChallengeSubmissionJobsService.execute(
            {
                request,
                locale,
                user,
            },
        )
    }
}
