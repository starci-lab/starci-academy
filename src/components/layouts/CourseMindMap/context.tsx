"use client"

import { createContext, useContext } from "react"

/** A content selected from the mind-map for the details drawer. */
export interface MindMapDetailsSelection {
    /** Selected lesson (content) id. */
    contentId: string
    /** Owning module id — needed to build the lesson URL. */
    moduleId: string
}

/** Context value letting deep React Flow nodes open the details drawer. */
export interface MindMapDetailsContextValue {
    /** Opens the details drawer for the given content. */
    openDetails: (selection: MindMapDetailsSelection) => void
}

const MindMapDetailsContext = createContext<MindMapDetailsContextValue | null>(null)

/** Provider exposing {@link MindMapDetailsContextValue} to the mind-map subtree. */
export const MindMapDetailsProvider = MindMapDetailsContext.Provider

/**
 * Reads the mind-map details context. Throws when used outside {@link MindMapDetailsProvider}.
 */
export const useMindMapDetails = (): MindMapDetailsContextValue => {
    const context = useContext(MindMapDetailsContext)
    if (!context) {
        throw new Error("useMindMapDetails must be used within MindMapDetailsProvider")
    }
    return context
}
