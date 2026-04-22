import {
    ExecuteParams,
} from "@features/api/types"
import {
    IncompleteChallengeSubmissionJobsRequest,
} from "./graphql-types"

export class IncompleteChallengeSubmissionJobsQuery {
    constructor(
        readonly params: ExecuteParams<IncompleteChallengeSubmissionJobsRequest>,
    ) {}
}
