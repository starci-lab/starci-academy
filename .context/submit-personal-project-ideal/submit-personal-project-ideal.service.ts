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
    SubmitPersonalProjectIdealCommand,
} from "./submit-personal-project-ideal.command"

@Injectable()
export class SubmitPersonalProjectIdealService {
    constructor(
        private readonly commandBus: CommandBus,
    ) { }

    async execute(
        params: SubmitPersonalProjectIdealCommand["params"],
    ): Promise<EnrollmentEntity> {
        return this.commandBus.execute(
            new SubmitPersonalProjectIdealCommand(params),
        )
    }
}
