import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the keycloak.
 */
export interface KeycloakSlice {
    /** The access token. */
    accessToken?: string
    /** Whether the user is authenticated. */
    authenticated: boolean
    /** Whether the keycloak is initialized. */
    initialized: boolean
}

/**
 * The initial state of the lesson video slice.
 */
const initialState: KeycloakSlice = {
    /** The access token. */
    accessToken: undefined,
    /** Whether the user is authenticated. */
    authenticated: false,
    /** Whether the keycloak is initialized. */
    initialized: false,
}

/**
 * The slice for the keycloak.
 */
export const keycloakSlice = createSlice(
    {
        /** The name of the slice. */
        name: "keycloak",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the lesson video. */
            setAccessToken: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.accessToken = action.payload
            },
            /** The action to set the authenticated state. */
            setAuthenticated: (
                state, 
                action: PayloadAction<boolean>
            ) => {
                state.authenticated = action.payload
            },
            /** The action to set the initialized state. */
            setInitialized: (
                state, 
                action: PayloadAction<boolean>
            ) => {
                state.initialized = action.payload
            },
        },
    }
)

/**
 * The reducer for the keycloak slice.
 */
export const keycloakReducer = keycloakSlice.reducer
export const { 
    setAccessToken,
    setAuthenticated,
    setInitialized,
} = keycloakSlice.actions