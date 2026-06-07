"use client"

import { useCallback } from "react"
import type { PaymentContext } from "@/modules/types"
import { useOverlayStore, type OverlayKey } from "./store"

/**
 * Return shape of an overlay accessor — matches HeroUI's `UseOverlayStateReturn`
 * (`useOverlayState`) exactly so existing consumers need no changes.
 */
export interface OverlayStateHandle {
    /** Whether the overlay is open. */
    readonly isOpen: boolean
    /** Set the open state (used by `onOpenChange`). */
    setOpen: (isOpen: boolean) => void
    /** Open the overlay. */
    open: () => void
    /** Close the overlay. */
    close: () => void
    /** Toggle the open state. */
    toggle: () => void
}

/**
 * Factory: builds an overlay handle for one key, subscribing via selector to `openMap[key]` so it
 * only re-renders when that overlay changes. Actions come from the store (stable refs) and are
 * wrapped in `useCallback` to keep a fixed identity across renders.
 * @param key - the overlay identifier.
 * @returns a handle matching the HeroUI shape.
 */
const useOverlayHandle = (key: OverlayKey): OverlayStateHandle => {
    const isOpen = useOverlayStore((state) => state.openMap[key])
    const setOpenFor = useOverlayStore((state) => state.setOpenFor)
    const openOverlay = useOverlayStore((state) => state.openOverlay)
    const closeOverlay = useOverlayStore((state) => state.closeOverlay)
    const toggleOverlay = useOverlayStore((state) => state.toggleOverlay)
    const setOpen = useCallback((next: boolean) => setOpenFor(key, next), [setOpenFor, key])
    const open = useCallback(() => openOverlay(key), [openOverlay, key])
    const close = useCallback(() => closeOverlay(key), [closeOverlay, key])
    const toggle = useCallback(() => toggleOverlay(key), [toggleOverlay, key])
    return { isOpen, setOpen, open, close, toggle }
}

/** Account menu overlay state. */
export const useAccountMenuOverlayState = () => useOverlayHandle("accountMenu")
/** AI processing overlay state. */
export const useAIProcessingOverlayState = () => useOverlayHandle("aiProcessing")
/** AI quota overlay state. */
export const useAiQuotaOverlayState = () => useOverlayHandle("aiQuota")
/** Authentication overlay state. */
export const useAuthenticationOverlayState = () => useOverlayHandle("authentication")
/** Challenge overlay state. */
export const useChallengeOverlayState = () => useOverlayHandle("challenge")
/** Content overlay state. */
export const useContentOverlayState = () => useOverlayHandle("content")
/** CV preview overlay state. */
export const useCvPreviewOverlayState = () => useOverlayHandle("cvPreview")
/** CV review level details overlay state. */
export const useCvReviewLevelDetailsOverlayState = () => useOverlayHandle("cvReviewLevelDetails")
/** CV submission attempt analysis overlay state. */
export const useCvSubmissionAttemptAnalysisOverlayState = () => useOverlayHandle("cvSubmissionAttemptAnalysis")
/** CV submission attempts drawer overlay state. */
export const useCvSubmissionAttemptsDrawerOverlayState = () => useOverlayHandle("cvSubmissionAttemptsDrawer")
/** CV update overlay state. */
export const useCvUpdateOverlayState = () => useOverlayHandle("cvUpdate")
/** Feedback details overlay state. */
export const useFeedbackDetailsOverlayState = () => useOverlayHandle("feedbackDetails")
/** Foundation overlay state. */
export const useFoundationOverlayState = () => useOverlayHandle("foundation")
/** Headhunter overlay state. */
export const useHeadhunterOverlayState = () => useOverlayHandle("headhunter")
/** Language overlay state. */
export const useLanguageOverlayState = () => useOverlayHandle("language")
/** Lesson video overlay state. */
export const useLessonVideoOverlayState = () => useOverlayHandle("lessonVideo")
/** Link GitHub overlay state. */
export const useLinkGithubOverlayState = () => useOverlayHandle("linkGithub")
/** Livestream calendar overlay state. */
export const useLivestreamCalendarOverlayState = () => useOverlayHandle("livestreamCalendar")
/**
 * Payment overlay state — UNLIKE the other overlays: it carries a {@link PaymentContext} payload.
 * `open(context)` stashes the payload then opens (one modal serves multiple flows: course enroll /
 * AI subscription); the modal reads `context` to pick the mutation. Overrides the base handle's
 * `open` to accept the payload.
 * @returns the overlay handle (`isOpen`, `setOpen`, `close`, `toggle`) plus `context` and `open(context)`.
 */
export const usePaymentOverlayState = () => {
    const base = useOverlayHandle("payment")
    const context = useOverlayStore((state) => state.paymentContext)
    const setPaymentContext = useOverlayStore((state) => state.setPaymentContext)
    const openOverlay = useOverlayStore((state) => state.openOverlay)
    const open = useCallback(
        (next: PaymentContext) => {
            setPaymentContext(next)
            openOverlay("payment")
        },
        [setPaymentContext, openOverlay],
    )
    return { ...base, open, context }
}
/** Personal project task attempts drawer overlay state. */
export const usePersonalProjectTaskAttemptsDrawerOverlayState = () => useOverlayHandle("personalProjectTaskAttemptsDrawer")
/** Premium gate overlay state. */
export const usePremiumGateOverlayState = () => useOverlayHandle("premiumGate")
/** Search overlay state. */
export const useSearchOverlayState = () => useOverlayHandle("search")
/** Share overlay state. */
export const useShareOverlayState = () => useOverlayHandle("share")
/** Submission attempts overlay state. */
export const useSubmissionAttemptsOverlayState = () => useOverlayHandle("submissionAttempts")
/** User milestone task feedbacks modal overlay state. */
export const useUserMilestoneTaskFeedbacksModalOverlayState = () => useOverlayHandle("userMilestoneTaskFeedbacksModal")
