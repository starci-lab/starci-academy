import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/**
 * The tabs of the sidebar.
 */
export enum SidebarTab {
    MindMap = "mindMap",
    Modules = "modules",
    Cv = "cv",
    FinalProject = "finalProject",
    Leaderboard = "leaderboard",
    StarciAi = "starciAi",
}

/**
 * @interface SidebarSlice
 * @property {SidebarItem} sidebar - The sidebar item
 */
export interface SidebarSlice {
    sidebar: {
        tab: SidebarTab
        extraId?: string
    }
}

/**
 * @interface SidebarItem
 * @property {SidebarTab} tab - The tab of the sidebar
 * @property {string} id - The id of the sidebar item
 */
export interface SidebarItem {
    /**
     * The tab of the sidebar item
     */
    tab: SidebarTab
    /**
     * The extra id of the sidebar item
     */
    extraId?: string
}

export const initialState: SidebarSlice = {
    sidebar: {
        tab: SidebarTab.MindMap,
        extraId: undefined,
    },
}

/**
 * The slice for the sidebar.
 */
export const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setSidebar: (state, action: PayloadAction<SidebarItem>) => {
            state.sidebar = action.payload
        },
    },
})

export const { setSidebar } = sidebarSlice.actions
export const sidebarReducer = sidebarSlice.reducer