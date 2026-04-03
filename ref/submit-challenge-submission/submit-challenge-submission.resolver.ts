import {
    Args,
    Mutation,
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
    KeycloakAuthGraphQLGuard,
    KeycloakGraphQLUser,
} from "@modules/keycloak"
import {
    UseThrottler,
    ThrottlerConfig,
} from "@modules/throttler"
import {
    Locale,
    UserEntity,
} from "@modules/databases"
import {
    GraphQLMustEnrolledGuard,
} from "@modules/bussiness"
import {
    SubmitChallengeSubmissionRequest,
    SubmitChallengeSubmissionResponse,
} from "./graphql-types"
import {
    SubmitChallengeSubmissionService,
} from "./submit-challenge-submission.service"

/**
 * GraphQL entry: queue automated grading for a GitHub challenge submission.
 */
@Resolver()
export class SubmitChallengeSubmissionResolver {
    constructor(
        private readonly submitChallengeSubmissionService: SubmitChallengeSubmissionService,
    ) {}

    /**
     * Enqueues the GitHub grading pipeline for the authenticated learner.
     */
    @UseThrottler(ThrottlerConfig.Medium)
    @GraphQLSuccessMessage({
        [Locale.En]: "Submission queued for grading",
        [Locale.Vi]: "Đã xếp hàng chấm bài",
    })
    @UseGuards(
        KeycloakAuthGraphQLGuard,
        GraphQLMustEnrolledGuard,
    )
    @UseInterceptors(GraphQLTransformInterceptor)
    @Mutation(
        () => SubmitChallengeSubmissionResponse,
        {
            name: "submitChallengeSubmission",
            description: "Queue automated grading for GitHub URL submissions under one challenge; call after `syncChallengeSubmissions`. Google Docs rows are rejected.",
        },
    )
    async execute(
        @KeycloakGraphQLUser()
            user: UserEntity,
        @Args(
            "request",
            {
                description: "Challenge id and which submission definitions under it to grade.",
            },
        )
            request: SubmitChallengeSubmissionRequest,
        @GraphQLLocale()
            locale: Locale,
    ) {
        return this.submitChallengeSubmissionService.execute(
            {
                request,
                locale,
                user,
            },
        )
    }
}
