"use client"

import {
    useCallback,
    useEffect,
    useRef,
} from "react"
import {
    useAppDispatch,
} from "@/redux"
import {
    setContentIsRead,
} from "@/redux/slices"
import {
    mutateMarkContentAsReaded,
} from "@/modules/api"

/**
 * Minimum time (ms) the learner must spend on a lesson before reaching the bottom
 * counts as a deliberate read worthy of XP + a feed event. Reaching the bottom flips
 * the read flag instantly (silent), but the reward waits out this window so a quick
 * fling-scroll to the bottom cannot farm XP. Measured from when the content opened —
 * a genuine reader has usually already spent longer than this by the time they reach
 * the end, so they earn the reward the moment the sentinel appears. Tunable.
 */
const XP_DWELL_MS = 15_000

/** Params for {@link useAutoMarkContentRead}. */
export interface UseAutoMarkContentReadParams {
    /** Active content id; the observer is disabled until this is set. */
    contentId?: string
    /** Current read state from the status query — once read, nothing fires (reward was handled on the first read). */
    isRead?: boolean
    /** Skip while the body is still loading (the sentinel does not exist yet). */
    isLoading?: boolean
}

/**
 * Auto mark-as-read driven by scrolling to the bottom of a lesson, split into two
 * phases (product decision "B'", dwell-gated):
 *
 *  1. **Reaching the bottom sentinel** → `markContentAsReaded({ silent: true })` →
 *     flips the read flag for instant progress feedback (the green "read" badge),
 *     granting NO XP and posting NO activity-feed event.
 *  2. **Staying on the lesson past {@link XP_DWELL_MS}** (counted from when it opened)
 *     → `markContentAsReaded({ silent: false })` → awards XP + posts the feed event.
 *     The grant is idempotent server-side on the user-content ref, so re-firing is safe.
 *
 * Both phases fire at most once per opened content; everything is skipped once the
 * lesson is already read (covers revisits).
 *
 * @param params - See {@link UseAutoMarkContentReadParams}.
 * @returns a ref to attach to the bottom sentinel element.
 */
export const useAutoMarkContentRead = ({
    contentId,
    isRead,
    isLoading,
}: UseAutoMarkContentReadParams) => {
    const dispatch = useAppDispatch()
    const sentinelRef = useRef<HTMLDivElement>(null)
    // per-content guards so each phase runs at most once
    const markedSilentRef = useRef(false)
    const grantedRef = useRef(false)
    // timestamp the content opened — the dwell window is measured from here
    const openedAtRef = useRef(0)
    // pending dwell timer, cleared on content change / unmount
    const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // phase 1: flip the read flag silently (progress only, no reward)
    const markReadSilently = useCallback(async () => {
        if (!contentId || markedSilentRef.current) {
            return
        }
        markedSilentRef.current = true
        try {
            await mutateMarkContentAsReaded({
                request: {
                    contentId,
                    readed: true,
                    silent: true,
                },
            })
            // reflect the read flag locally so the badge turns green immediately
            dispatch(setContentIsRead(true))
        } catch {
            markedSilentRef.current = false
        }
    }, [contentId, dispatch])

    // phase 2: the deliberate, dwell-gated XP + feed grant
    const grantReadReward = useCallback(async () => {
        if (!contentId || grantedRef.current) {
            return
        }
        grantedRef.current = true
        try {
            await mutateMarkContentAsReaded({
                request: {
                    contentId,
                    readed: true,
                    silent: false,
                },
            })
        } catch {
            grantedRef.current = false
        }
    }, [contentId])

    // reset both phases + stamp the open time when the active content changes;
    // cancel any pending dwell timer on content change / unmount
    useEffect(() => {
        markedSilentRef.current = false
        grantedRef.current = false
        openedAtRef.current = Date.now()
        return () => {
            if (dwellTimerRef.current) {
                clearTimeout(dwellTimerRef.current)
                dwellTimerRef.current = null
            }
        }
    }, [contentId])

    // observe the bottom sentinel; trigger the two phases when it scrolls into view
    useEffect(() => {
        // already read (revisit) or not ready yet → nothing to observe
        if (isLoading || isRead || !contentId || !sentinelRef.current) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) {
                    return
                }
                // phase 1 immediately
                void markReadSilently()
                // phase 2 once the dwell window has elapsed (now or after a timer)
                if (grantedRef.current || dwellTimerRef.current) {
                    return
                }
                const remaining = XP_DWELL_MS - (Date.now() - openedAtRef.current)
                if (remaining <= 0) {
                    void grantReadReward()
                    return
                }
                dwellTimerRef.current = setTimeout(
                    () => {
                        dwellTimerRef.current = null
                        void grantReadReward()
                    },
                    remaining,
                )
            },
            {
                threshold: 1.0,
            },
        )
        observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [
        isLoading,
        isRead,
        contentId,
        markReadSilently,
        grantReadReward,
    ])

    return sentinelRef
}
