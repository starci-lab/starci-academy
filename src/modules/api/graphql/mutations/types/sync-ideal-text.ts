import type { EnrollmentEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Request for `syncIdealText`. */
export interface SyncIdealTextRequest {
    /** Course ID. */
    courseId: string
    /** The project idea text. */
    ideaText: string
}

/** Apollo response shape for `syncIdealText`. */
export interface MutateSyncIdealTextResponse {
    /** Top-level `syncIdealText` field returning the updated enrollment entity. */
    syncIdealText: GraphQLResponse<EnrollmentEntity>
}
