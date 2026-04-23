import type {
    ChallengeEntity,
    ChallengeSubmissionEntity,
} from "@/modules/types"
import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the challenge.
 */
export interface ChallengeSlice {
    /** When set, `useQueryChallengeSwr` fetches this row (`challenge` query). */
    id?: string
    /** The challenges entities. */
    entities?: Array<ChallengeEntity>
    /** The challenge entity. */
    entity?: ChallengeEntity
    /** The challenges page number. */
    pageNumber?: number
    /** The challenges limit. */
    limit?: number
    /** The challenges count. */
    count?: number
    /** Rows from `challengeSubmissions` for the focused challenge. */
    challengeSubmissions: Array<ChallengeSubmissionEntity>
    /** The loading challenge submissions. */
    loadingChallengeSubmissionIds: Array<string>
}

/**
 * The initial state of the challenge slice.
 */
const initialState: ChallengeSlice = {
    /** When set, `useQueryChallengeSwr` fetches this row (`challenge` query). */
    id: undefined,
    /** The challenges entities. */
    entities: [],
    /** The challenge. */
    entity: undefined,
    /** The challenges page number. */
    pageNumber: undefined,
    /** The challenges limit. */
    limit: undefined,
    /** The challenges count. */
    count: undefined,
    /** Challenge submission rows (see `challengeSubmissions` query). */
    challengeSubmissions: [],
    /** The loading challenge submissions. */
    loadingChallengeSubmissionIds: [],
}

/**
 * The slice for the challenge.
 */
export const challengeSlice = createSlice(
    {
        /** The name of the slice. */
        name: "challenge",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the challenge. */
            setChallenge: (
                state, 
                action: PayloadAction<ChallengeEntity | undefined>
            ) => {
                state.entity = action.payload
            },
            /** The action to set the challenges. */
            setChallenges: (
                state, 
                action: PayloadAction<Array<ChallengeEntity>>
            ) => {
                state.entities = action.payload
            },
            /** The action to set the challenge id. */
            setChallengeId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
            /** The action to set the challenge page number. */
            setChallengePageNumber: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.pageNumber = action.payload
            },
            /** The action to set the challenge limit. */
            setChallengeLimit: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.limit = action.payload
            },
            /** The action to set the challenge count. */
            setChallengeCount: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.count = action.payload
            },
            /** The action to set challenge submission rows for the current challenge. */
            setChallengeSubmissions: (
                state,
                action: PayloadAction<Array<ChallengeSubmissionEntity>>,
            ) => {
                state.challengeSubmissions = action.payload
            },
            /** The action to set the loading challenge submission ids. */
            setLoadingChallengeSubmissionIds: (
                state,
                action: PayloadAction<Array<string>>,
            ) => {
                state.loadingChallengeSubmissionIds = action.payload
            },
        },
    }
)

/**
 * The reducer for the challenge slice.
 */
export const challengeReducer = challengeSlice.reducer
export const { 
    setChallenge,
    setChallenges,
    setChallengeId,
    setChallengePageNumber,
    setChallengeLimit,
    setChallengeCount,
    setChallengeSubmissions,
    setLoadingChallengeSubmissionIds,
} = challengeSlice.actions