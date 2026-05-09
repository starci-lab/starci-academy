import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import {
    EnrollmentEntity,
} from "@modules/databases"
import {
    SubmitPersonalGithubUrlCommand,
} from "./submit-personal-github-url.command"

@Injectable()
export class SubmitPersonalGithubUrlService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: SubmitPersonalGithubUrlCommand["params"],
    ): Promise<EnrollmentEntity> {
        return this.commandBus.execute(
            new SubmitPersonalGithubUrlCommand(params),
        )
    }
}
