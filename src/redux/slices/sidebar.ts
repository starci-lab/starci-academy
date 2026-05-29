import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * The tabs of the sidebar.
 */
export enum SidebarTab {
    MindMap = "mindMap",
    Modules = "modules",
    Cv = "cv",
    PersonalProject = "personalProject",
    Leaderboard = "leaderboard",
    StarciAi = "starciAi",
    Foundations = "foundations",
    Headhuntings = "headhuntings",
    Quizlet = "quizlet",
}

/**
 * The shape of the active sidebar selection stored in Redux.
 */
export interface SidebarSlice {
    /** The currently active sidebar tab and optional sub-item id. */
    sidebar: SidebarItem
}

/**
 * Payload for a sidebar selection action.
 */
export interface SidebarItem {
    /** The tab of the sidebar item. */
    tab: SidebarTab
    /** Optional sub-item id (e.g. module id for accordion child highlight). */
    extraId?: string
}

/** Initial state for the sidebar slice (defaults to MindMap tab, no sub-item). */
export const initialState: SidebarSlice = {
    sidebar: {
        tab: SidebarTab.MindMap,
        extraId: undefined,
    },
}

/**
 * Slice managing which sidebar tab (and optional sub-item) is active.
 */
export const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        /** Set the active sidebar tab and optional sub-item id. */
        setSidebar: (state, action: PayloadAction<SidebarItem>) => {
            state.sidebar = action.payload
        },
    },
})

/** Actions exported from the sidebar slice. */
export const { setSidebar } = sidebarSlice.actions
/** Root reducer for the sidebar slice. */
export const sidebarReducer = sidebarSlice.reducer
