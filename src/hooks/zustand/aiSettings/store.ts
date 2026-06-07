"use client"

import { create } from "zustand"
import { AiMode, ModelProvider } from "@/modules/api"

/** Inline status shown after saving AI settings. */
export interface AiSettingsSaveStatus {
    /** Whether the last save succeeded or failed. */
    kind: "success" | "error"
    /** Already-translated message to display. */
    text: string
}

/**
 * Zustand store for AI settings — SHARED between index (submit), LaneCard (set mode),
 * ByokForm (set byok + status) and StatusLine (read status). Previously a formik singleton.
 */
interface AiSettingsStoreState {
    /** Preferred lane (Auto / Premium / Byok). */
    mode: AiMode
    /** Selected BYOK provider. */
    byokProvider: ModelProvider
    /** BYOK API key the user just typed (never the stored one). */
    byokApiKey: string
    /** Status shown after an action; null when none. */
    status: AiSettingsSaveStatus | null
    /** Set the lane. */
    setMode: (mode: AiMode) => void
    /** Set the BYOK provider. */
    setByokProvider: (provider: ModelProvider) => void
    /** Set the BYOK API key being typed. */
    setByokApiKey: (apiKey: string) => void
    /** Set or clear the status. */
    setStatus: (status: AiSettingsSaveStatus | null) => void
}

/** Shared store for AI settings. */
export const useAiSettingsStore = create<AiSettingsStoreState>((set) => ({
    mode: AiMode.Auto,
    byokProvider: ModelProvider.OpenAI,
    byokApiKey: "",
    status: null,
    setMode: (mode) => set({ mode }),
    setByokProvider: (byokProvider) => set({ byokProvider }),
    setByokApiKey: (byokApiKey) => set({ byokApiKey }),
    setStatus: (status) => set({ status }),
}))
