import {
    ExecuteParams,
} from "@features/api/core/types"
import {
    ReviewPersonalProjectForTaskRequest,
} from "./graphql-types"

export class ReviewPersonalProjectForTaskCommand {
    constructor(
        readonly params: ExecuteParams<ReviewPersonalProjectForTaskRequest>,
    ) {}
}
