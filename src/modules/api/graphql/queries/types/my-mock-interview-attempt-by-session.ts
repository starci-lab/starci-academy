import type { GraphQLResponse } from "../../types"
import type { MockInterviewAttemptItem } from "./my-mock-interview-attempts"

/** Apollo response shape for the `myMockInterviewAttemptBySessionId` query. */
export interface QueryMyMockInterviewAttemptBySessionResponse {
    /** Top-level `myMockInterviewAttemptBySessionId` field — `data` is `null` when no graded attempt exists yet for that session. */
    myMockInterviewAttemptBySessionId: GraphQLResponse<MockInterviewAttemptItem>
}
