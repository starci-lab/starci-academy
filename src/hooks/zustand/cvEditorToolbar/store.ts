"use client"

import { create } from "zustand"
import type { CvExportFormat } from "@/modules/types/enums/cv-export-format"

/**
 * Live data + callbacks for the CV editor's toolbar, which renders as the global
 * Navbar's bottom layer (so it sits integrated under the navbar row, no divider).
 *
 * The bottom-layer node renders inside the Navbar subtree and cannot read the CV
 * editor's local React state directly — so `CvEditor` pushes its current state
 * (label / export flags) + stable callbacks into this store, and the registered
 * `CvEditorToolbarBar` reads them here. Keeping the registered node STABLE (it
 * only re-renders internally off this store) preserves the name input's focus
 * across keystrokes.
 */
interface CvEditorToolbarStoreState {
    /** Current CV name (mirrors the editor draft's label). */
    label: string
    /** Whether export is possible (a draft is loaded). */
    canExport: boolean
    /** Which format's export is in flight (drives the button disabled state), or null. */
    exportingFormat: CvExportFormat | null
    /** Navigate back to the CV gallery. */
    onBack: () => void
    /** Rename the CV. */
    onLabelChange: (label: string) => void
    /** Export the CV to the given format. */
    onExport: (format: CvExportFormat) => void
    /** Patch the toolbar state (called by `CvEditor` as its state changes). */
    setToolbar: (partial: Partial<Omit<CvEditorToolbarStoreState, "setToolbar">>) => void
}

/** Shared store for the CV editor toolbar (Navbar bottom layer). */
export const useCvEditorToolbarStore = create<CvEditorToolbarStoreState>((set) => ({
    label: "",
    canExport: false,
    exportingFormat: null,
    onBack: () => {},
    onLabelChange: () => {},
    onExport: () => {},
    setToolbar: (partial) => set(partial),
}))
