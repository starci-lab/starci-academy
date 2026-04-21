import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/**
 * The tabs for the authentication modal.
 */
export enum AuthenticationModalTab {
    SignIn = "signIn",
    SignUp = "signUp",
}

/**
 * The tabs for the learn page.
 */
export enum LearnTab {
    LessonVideos = "lessonVideos",
    Contents = "contents",
    Challenges = "challenges",
    TopAchievers = "topAchievers",
}

export enum ContentTab {
    Content = "content",
    LessonVideos = "lessonVideos",
    Challenges = "challenges",
}

/**
 * The slice for the authentication modal.
 */
export interface TabsSlice {
    authenticationModalTab: AuthenticationModalTab
    learnTab: LearnTab
    contentTab: ContentTab
}

/**
 * The initial state of the authentication modal slice.
 */
const initialState: TabsSlice = {
    authenticationModalTab: AuthenticationModalTab.SignIn,
    learnTab: LearnTab.LessonVideos,
    contentTab: ContentTab.Content,
}

/**
 * The slice for the tabs.
 */
export const tabsSlice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        setAuthenticationModalTab: (
            state,
            action: PayloadAction<AuthenticationModalTab>
        ) => {
            state.authenticationModalTab = action.payload
        },
        resetAuthenticationModalTab: (state) => {
            state.authenticationModalTab = AuthenticationModalTab.SignIn
        },
        setLearnTab: (
            state,
            action: PayloadAction<LearnTab>
        ) => {
            state.learnTab = action.payload
        },
        resetLearnTab: (state) => {
            state.learnTab = LearnTab.LessonVideos
        },
        setContentTab: (
            state,
            action: PayloadAction<ContentTab>
        ) => {
            state.contentTab = action.payload
        },
        resetContentTab: (state) => {
            state.contentTab = ContentTab.Content
        },
    },
})

/**
 * The reducer for the tabs.
 */
export const tabsReducer = tabsSlice.reducer

/**
 * The actions for the tabs.
 */
export const {
    setAuthenticationModalTab,
    resetAuthenticationModalTab,
    setLearnTab,
    resetLearnTab,
    setContentTab,
    resetContentTab,
} = tabsSlice.actions
