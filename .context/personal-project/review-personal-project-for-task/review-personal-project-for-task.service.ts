import {
    Injectable,
} from "@nestjs/common"
import {
    CommandBus,
} from "@nestjs/cqrs"
import type {
    ReviewPersonalProjectForTaskResponseData,
} from "./graphql-types"
import {
    ReviewPersonalProjectForTaskCommand,
} from "./review-personal-project-for-task.command"

@Injectable()
export class ReviewPersonalProjectForTaskService {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    async execute(
        params: ReviewPersonalProjectForTaskCommand["params"],
    ): Promise<ReviewPersonalProjectForTaskResponseData> {
        return this.commandBus.execute(
            new ReviewPersonalProjectForTaskCommand(params),
        )
    }
}
