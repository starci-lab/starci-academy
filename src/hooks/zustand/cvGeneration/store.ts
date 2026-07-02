"use client"

import { create } from "zustand"

/**
 * Zustand store for the CV generation currently being produced/previewed. Shared so the
 * generate/revise controls (which start a job and set the id) and the preview area (which
 * polls that id) see the same active generation across the CV page tree.
 */
interface CvGenerationStoreState {
    /** `cv_generations.id` of the active generation being polled/previewed; null when none. */
    activeCvGenerationId: string | null
    /** Set or clear the active generation id. */
    setActiveCvGenerationId: (id: string | null) => void
}

/** Shared store for the active CV generation. */
export const useCvGenerationStore = create<CvGenerationStoreState>((set) => ({
    activeCvGenerationId: null,
    setActiveCvGenerationId: (id) => set({ activeCvGenerationId: id }),
}))
