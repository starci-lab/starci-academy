import {
    ExecuteParams,
} from "@features/api/core/types"
import {
    SubmitPersonalGithubUrlRequest,
} from "./graphql-types"

export class SubmitPersonalGithubUrlCommand {
    constructor(
        readonly params: ExecuteParams<SubmitPersonalGithubUrlRequest>,
    ) {}
}
