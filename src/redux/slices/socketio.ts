import type { 
    GlobalSearchSocketIoMessage 
} from "@/hooks"
import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the content.
 */
export interface SocketIOSlice {
    /** The global search results. */
    globalSearchResults?: GlobalSearchSocketIoMessage
}

/**
 * The initial state of the content slice.
 */
const initialState: SocketIOSlice = {
    /** The global search results. */
    globalSearchResults: undefined,
}

/**
 * The slice for the socketio.
 */
export const socketIoSlice = createSlice(
    {
        /** The name of the slice. */
        name: "socketio",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the global search results. */
            setGlobalSearchResults: (
                state, 
                action: PayloadAction<GlobalSearchSocketIoMessage | undefined>
            ) => {
                state.globalSearchResults = action.payload
            },
        },
    }
)

/**
 * The reducer for the socketio slice.
 */
export const socketIoReducer = socketIoSlice.reducer
export const { 
    setGlobalSearchResults,
} = socketIoSlice.actions