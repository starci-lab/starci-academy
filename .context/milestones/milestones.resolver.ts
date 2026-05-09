import {
    Args,
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
    Injectable,
    UseInterceptors,
} from "@nestjs/common"
import {
    Locale,
    MilestoneEntity,
} from "@modules/databases"
import {
    GraphQLSuccessMessage,
    GraphQLTransformInterceptor,
    GraphQLLocale,
} from "@modules/api"
import {
    UseThrottler,
    ThrottlerConfig,
} from "@modules/throttler"
import {
    MilestonesRequest,
    MilestonesResponse,
} from "./graphql-types"
import {
    MilestonesService,
} from "./milestones.service"

@Resolver(() => MilestoneEntity)
@Injectable()
export class MilestonesResolver {
    constructor(
        private readonly milestonesService: MilestonesService,
    ) {}

    /**
     * Returns all milestones for a course.
     */
    @UseThrottler(ThrottlerConfig.Soft)
    @GraphQLSuccessMessage({
        [Locale.En]: "Milestones fetched successfully",
        [Locale.Vi]: "Lấy milestones thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(() => MilestonesResponse,
        {
            name: "milestones",
            description: "Returns all milestones for a course by courseId or courseDisplayId.",
        })
    async execute(
        @Args("request",
            {
                description: "Milestones lookup request.",
            }
        )
            request: MilestonesRequest,
        @GraphQLLocale()
            locale: Locale,
    ): Promise<Array<MilestoneEntity>> {
        return this.milestonesService.execute(
            {
                request,
                locale,
            },
        )
    }
}
