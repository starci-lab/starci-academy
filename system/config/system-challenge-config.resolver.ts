import {
    Query,
    Resolver,
} from "@nestjs/graphql"
import {
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
} from "@modules/databases"
import {
    SystemChallengeConfigResponse,
    SystemChallengeConfigData,
} from "./graphql-types"
import {
    SystemChallengeConfigService,
} from "./system-challenge-config.service"

@Resolver()
export class SystemChallengeConfigResolver {
    constructor(
        private readonly systemChallengeConfigService: SystemChallengeConfigService,
    ) {}

    @UseThrottler(ThrottlerConfig.Soft)
    @GraphQLSuccessMessage({
        [Locale.En]: "System challenge config fetched successfully",
        [Locale.Vi]: "Lấy cấu hình challenge hệ thống thành công",
    })
    @UseInterceptors(GraphQLTransformInterceptor)
    @Query(
        () => SystemChallengeConfigResponse,
        {
            name: "systemChallengeConfig",
            description:
                "Returns `systemConfig.challenge` from mounted `.mount/config/app.json` (e.g. pass threshold).",
        },
    )
    async execute(
        @GraphQLLocale()
            locale: Locale,
    ): Promise<SystemChallengeConfigData> {
        return this.systemChallengeConfigService.execute(
            {
                request: undefined,
                locale,
                user: undefined,
            },
        )
    }
}
