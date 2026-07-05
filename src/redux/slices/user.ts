import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"
import type { EnrollmentEntity } from "@/modules/types/entities/enrollment"
import type { UserEntity } from "@/modules/types/entities/user"

/**
 * Client state for the authenticated user and their course enrollment.
 */
export interface UserSlice {
    /** The user. */
    user: UserEntity | null
    /** Whether the user is enrolled in the course. */
    enrolled: boolean
    /**
     * Whether {@link enrolled} reflects a settled enrollment-status query (success or
     * error) rather than the pre-fetch default. `enrolled` defaults to `false`, so any
     * consumer that renders DIFFERENT content for enrolled vs. trial viewers must gate
     * on this flag first — otherwise a genuinely enrolled user flashes the trial UI
     * while the query is still in flight.
     */
    enrollKnown: boolean
    /** The user's enrollment. */
    enrollment?: EnrollmentEntity
}

/**
 * The initial state of the user slice.
 */
const initialState: UserSlice = {
    /** The user. */
    user: null,
    /** Whether the user is enrolled in the course. */
    enrolled: false,
    /** The enrollment-status query has not settled yet on a fresh load. */
    enrollKnown: false,
    /** The user's enrollment. */
    enrollment: undefined,
}

/**
 * Slice tracking the signed-in user entity, enrollment flag, and enrollment detail.
 */
export const userSlice = createSlice(
    {
        /** The name of the slice. */
        name: "user",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the user. */
            setUser: (
                state, 
                action: PayloadAction<UserEntity | null>
            ) => {
                state.user = action.payload
            },
            /** The action to set the enrolled state. */
            setEnrolled: (
                state,
                action: PayloadAction<boolean>
            ) => {
                state.enrolled = action.payload
            },
            /** The action to mark the enrollment-status query as settled (success or error). */
            setEnrollKnown: (
                state,
                action: PayloadAction<boolean>
            ) => {
                state.enrollKnown = action.payload
            },
            /** The action to set the enrollment. */
            setEnrollment: (
                state, 
                action: PayloadAction<EnrollmentEntity | undefined>
            ) => {
                state.enrollment = action.payload
            },
        },
    },
)

/** Root reducer for the user slice. */
export const userReducer = userSlice.reducer
/** Actions exported from the user slice. */
export const {
    setUser,
    setEnrolled,
    setEnrollKnown,
    setEnrollment,
} = userSlice.actions