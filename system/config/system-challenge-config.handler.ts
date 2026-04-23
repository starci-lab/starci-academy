import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    MountFilesystemService,
} from "@modules/filesystem"
import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler,
    QueryHandler,
} from "@nestjs/cqrs"
import {
    SystemChallengeConfigQuery,
} from "./system-challenge-config.query"
import {
    SystemChallengeConfigData,
} from "./graphql-types"

@QueryHandler(SystemChallengeConfigQuery)
@Injectable()
export class SystemChallengeConfigHandler
    extends ICQRSHandler<SystemChallengeConfigQuery, SystemChallengeConfigData>
    implements IQueryHandler<SystemChallengeConfigQuery, SystemChallengeConfigData>
{
    constructor(
        private readonly mountFilesystemService: MountFilesystemService,
    ) {
        super()
    }
    
    /**
     * Process the request.
     * @returns The response.
     */
    protected override async process(
    ): Promise<SystemChallengeConfigData> {
        return this.mountFilesystemService.appConfig().systemConfig
    }
}
