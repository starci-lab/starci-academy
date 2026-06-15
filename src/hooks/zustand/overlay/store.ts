"use client"

import { create } from "zustand"
import type { MindMapDetailsSelection, PaymentContext } from "@/modules/types"
import type { QueryActiveAdvertisementData } from "@/modules/api"

/**
 * Identifier for each overlay (modal/drawer/popover) in the app. Each key holds an independent
 * open state in {@link useOverlayStore}.
 */
export type OverlayKey =
    | "accountMenu"
    | "adModal"
    | "aiProcessing"
    | "aiQuota"
    | "authentication"
    | "challenge"
    | "content"
    | "cvPreview"
    | "cvReviewLevelDetails"
    | "cvSubmissionAttemptAnalysis"
    | "cvSubmissionAttemptsDrawer"
    | "cvUpdate"
    | "feedbackDetails"
    | "foundation"
    | "headhunter"
    | "language"
    | "lessonVideo"
    | "linkGithub"
    | "livestreamCalendar"
    | "mindMapContentDetails"
    | "payment"
    | "personalProjectTaskAttemptsDrawer"
    | "premiumGate"
    | "search"
    | "share"
    | "submissionAttempts"
    | "userMilestoneTaskFeedbacksModal"

/** Every key — used to build the initial state (all overlays default to closed). */
const OVERLAY_KEYS: ReadonlyArray<OverlayKey> = [
    "accountMenu",
    "adModal",
    "aiProcessing",
    "aiQuota",
    "authentication",
    "challenge",
    "content",
    "cvPreview",
    "cvReviewLevelDetails",
    "cvSubmissionAttemptAnalysis",
    "cvSubmissionAttemptsDrawer",
    "cvUpdate",
    "feedbackDetails",
    "foundation",
    "headhunter",
    "language",
    "lessonVideo",
    "linkGithub",
    "livestreamCalendar",
    "mindMapContentDetails",
    "payment",
    "personalProjectTaskAttemptsDrawer",
    "premiumGate",
    "search",
    "share",
    "submissionAttempts",
    "userMilestoneTaskFeedbacksModal",
]

/** Overlay store shape: the open map plus per-key actions. */
interface OverlayStoreState {
    /** openMap[key] = whether that overlay is open. */
    openMap: Record<OverlayKey, boolean>
    /** Payment overlay payload (flow + tier) — the modal reads it to pick the mutation. */
    paymentContext: PaymentContext | null
    /** Mind-map content-details drawer payload (selected lesson) — the drawer reads it. */
    mindMapContentDetailsContext: MindMapDetailsSelection | null
    /** Interstitial ad modal payload (the active ad to render). */
    adModalContext: QueryActiveAdvertisementData | null
    /** Set the open state of an overlay (used by `onOpenChange`). */
    setOpenFor: (key: OverlayKey, isOpen: boolean) => void
    /** Open an overlay. */
    openOverlay: (key: OverlayKey) => void
    /** Close an overlay. */
    closeOverlay: (key: OverlayKey) => void
    /** Toggle an overlay. */
    toggleOverlay: (key: OverlayKey) => void
    /** Stash the payment overlay payload. */
    setPaymentContext: (context: PaymentContext | null) => void
    /** Stash the mind-map content-details drawer payload. */
    setMindMapContentDetailsContext: (context: MindMapDetailsSelection | null) => void
    /** Stash the interstitial ad modal payload. */
    setAdModalContext: (context: QueryActiveAdvertisementData | null) => void
}

/** Initial open map — every overlay closed. */
const buildInitialOpenMap = (): Record<OverlayKey, boolean> =>
    OVERLAY_KEYS.reduce(
        (acc, key) => {
            acc[key] = false
            return acc
        },
        {} as Record<OverlayKey, boolean>,
    )

/**
 * Single Zustand store for all overlay state (replaces the old `OverlayStateContext`).
 *
 * Each overlay is a boolean in `openMap`; a component subscribes via a selector to its own key
 * (see the `useXxxOverlayState` accessors), so opening one overlay does NOT re-render consumers of
 * other overlays — unlike the old mega-context (changing one re-rendered all 25). Actions are
 * stable references (never change), so selecting an action never triggers a re-render.
 */
export const useOverlayStore = create<OverlayStoreState>((set) => ({
    openMap: buildInitialOpenMap(),
    paymentContext: null,
    mindMapContentDetailsContext: null,
    adModalContext: null,
    setOpenFor: (key, isOpen) =>
        set((state) => ({ openMap: { ...state.openMap, [key]: isOpen } })),
    openOverlay: (key) =>
        set((state) => ({ openMap: { ...state.openMap, [key]: true } })),
    closeOverlay: (key) =>
        set((state) => ({ openMap: { ...state.openMap, [key]: false } })),
    toggleOverlay: (key) =>
        set((state) => ({ openMap: { ...state.openMap, [key]: !state.openMap[key] } })),
    setPaymentContext: (context) => set({ paymentContext: context }),
    setMindMapContentDetailsContext: (context) => set({ mindMapContentDetailsContext: context }),
    setAdModalContext: (context) => set({ adModalContext: context }),
}))
