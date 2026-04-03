import {
    Module,
} from "@nestjs/common"
import {
    SubmitChallengeSubmissionResolver,
} from "./submit-challenge-submission.resolver"
import {
    SubmitChallengeSubmissionService,
} from "./submit-challenge-submission.service"

@Module({
    providers: [
        SubmitChallengeSubmissionService,
        SubmitChallengeSubmissionResolver,
    ],
})
export class SubmitChallengeSubmissionMutationModule {}
