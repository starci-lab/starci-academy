import { configureStore } from "@reduxjs/toolkit"
import { 
    tabsReducer,
    stateReducer,
    courseReducer,
    userReducer,
    modalReducer,
    moduleReducer,
    contentReducer,
    challengeReducer,
    lessonVideoReducer,
    livestreamSessionReducer,
    submissionAttemptReducer,
    submissionFeedbackReducer,
    sidebarReducer,
    socketIoReducer,
    systemReducer,
    jobReducer,
    keycloakReducer,
    searchReducer,
} from "./slices"

export const store = configureStore({
    reducer: {
        tabs: tabsReducer,
        state: stateReducer,
        course: courseReducer,
        user: userReducer,
        modal: modalReducer,
        module: moduleReducer,
        content: contentReducer,
        challenge: challengeReducer,
        lessonVideo: lessonVideoReducer,
        livestreamSession: livestreamSessionReducer,
        submissionAttempt: submissionAttemptReducer,
        submissionFeedback: submissionFeedbackReducer,
        sidebar: sidebarReducer,
        socketIo: socketIoReducer,
        system: systemReducer,
        job: jobReducer,
        keycloak: keycloakReducer,
        search: searchReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
