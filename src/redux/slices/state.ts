import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/**
 * The state for the sign in section.
 */
export enum SignInState {
    Credentials = "credentials",
    OTP = "otp",
}

/**
 * The state for the sign-up section (extend when adding verify-email / OTP steps).
 */
export enum SignUpState {
    Registration = "registration",
    /** After `signUpInit`; user enters OTP (`signUpVerifyOtp`). */
    Otp = "otp",
}

/**
 * The slice for UI states.
 */
export interface StateSlice {
    signInState: SignInState
    signUpState: SignUpState
}

/**
 * The initial state of the state slice.
 */
const initialState: StateSlice = {
    signInState: SignInState.Credentials,
    signUpState: SignUpState.Registration,
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
        setSignUpState: (state, action: PayloadAction<SignUpState>) => {
            state.signUpState = action.payload
        },
        resetSignUpState: (state) => {
            state.signUpState = SignUpState.Registration
        },
    },
})

export const stateReducer = stateSlice.reducer

export const {
    setSignInState,
    resetSignInState,
    setSignUpState,
    resetSignUpState,
} = stateSlice.actions

