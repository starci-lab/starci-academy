import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/**
 * The state for the sign in section.
 */
export enum SignInState {
    Credentials = "credentials",
    OTP = "otp",
}

/**
 * The slice for UI states.
 */
export interface StateSlice {
    signInState: SignInState
}

/**
 * The initial state of the state slice.
 */
const initialState: StateSlice = {
    signInState: SignInState.Credentials,
}

export const stateSlice = createSlice({
    name: "state",
    initialState,
    reducers: {
        setSignInState: (state, action: PayloadAction<SignInState>) => {
            state.signInState = action.payload
        },
        resetSignInState: (state) => {
            state.signInState = SignInState.Credentials
        },
    },
})

export const stateReducer = stateSlice.reducer

export const { setSignInState, resetSignInState } = stateSlice.actions

