import {
    Field,
    Float,
    ObjectType,
} from "@nestjs/graphql"
import {
    AbstractGraphQLResponse,
    IAbstractGraphQLResponse,
} from "@modules/api"

@ObjectType({
    description: "Challenge-related tuning from mounted `app.json` (`systemConfig.challenge`).",
})
export class SystemChallengeConfigChallenge {
    @Field(
        () => Float,
        {
            description: "Minimum score (0–1) required to pass a challenge.",
        },
    )
        passThreshold: number
}

@ObjectType({
    description: "Payload matching `systemConfig` in `.mount/config/app.json`.",
})
export class SystemChallengeConfigData {
    @Field(
        () => SystemChallengeConfigChallenge,
        {
            description: "Challenge thresholds and limits.",
        },
    )
        challenge: SystemChallengeConfigChallenge
}

@ObjectType({
    description: "Response wrapper for mounted system challenge config.",
})
export class SystemChallengeConfigResponse
    extends AbstractGraphQLResponse
    implements IAbstractGraphQLResponse<SystemChallengeConfigData>
{
    @Field(
        () => SystemChallengeConfigData,
        {
            description: "Mounted `systemConfig` subset (challenge only).",
        },
    )
        data: SystemChallengeConfigData
}
