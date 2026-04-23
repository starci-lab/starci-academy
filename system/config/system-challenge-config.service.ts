import {
    Injectable,
} from "@nestjs/common"
import {
    QueryBus,
} from "@nestjs/cqrs"
import {
    ExecuteParams,
} from "@features/api/types"
import {
    SystemChallengeConfigQuery,
} from "./system-challenge-config.query"
import {
    SystemChallengeConfigData,
} from "./graphql-types"

@Injectable()
export class SystemChallengeConfigService {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async execute(
        params: ExecuteParams<undefined>,
    ): Promise<SystemChallengeConfigData> {
        return this.queryBus.execute(
            new SystemChallengeConfigQuery(params),
        )
    }
}
