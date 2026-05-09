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
    EnrollmentMilestoneEntity,
} from "@modules/databases"
import {
    GraphQLMustEnrolledGuard,
} from "@modules/bussiness"
import {
    SubmitPersonalProjectIdealRequest,
    SubmitPersonalProjectIdealResponse,
    SubmitPersonalProjectIdealResponseData,
} from "./graphql-types"
import {
    SubmitPersonalProjectIdealService,
} from "./submit-personal-project-ideal.service"

@Resolver(() => EnrollmentMilestoneEntity)
export class SubmitPersonalProjectIdealResolver {
    constructor(
        private readonly service: SubmitPersonalProjectIdealService,
    ) {}

    @UseThrottler(ThrottlerConfig.Medium)
    @GraphQLSuccessMessage({
        [Locale.En]: "Project idea submitted successfully",
        [Locale.Vi]: "Đã gửi ý tưởng dự án thành công",
    })
    @UseGuards(
        KeycloakAuthGraphQLGuard,
        GraphQLMustEnrolledGuard,
    )
    @UseInterceptors(GraphQLTransformInterceptor)
    @Mutation(
        () => SubmitPersonalProjectIdealResponse,
        {
            name: "submitPersonalProjectIdeal",
            description: "Save the user's project idea text for a milestone.",
        },
    )
    async execute(
        @KeycloakGraphQLUser()
            user: UserEntity,
        @Args(
            "request",
            {
                description: "Personal project idea submission request.",
            },
        )
            request: SubmitPersonalProjectIdealRequest,
    ): Promise<SubmitPersonalProjectIdealResponseData> {
        return this.service.execute({
            enrollmentMilestoneId: request.enrollmentMilestoneId,
            ideaText: request.ideaText,
            userId: user.id,
        })
    }
}
