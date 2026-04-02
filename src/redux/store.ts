import { configureStore } from "@reduxjs/toolkit"
import { 
    tabsReducer,
    courseReducer,
    userReducer,
    modalReducer,
    moduleReducer,
    contentReducer,
    challengeReducer,
    lessonVideoReducer,
} from "./slices"

export const store = configureStore({
    reducer: {
        tabs: tabsReducer,
        course: courseReducer,
        user: userReducer,
        modal: modalReducer,
        module: moduleReducer,
        content: contentReducer,
        challenge: challengeReducer,
        lessonVideo: lessonVideoReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
