"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowsClockwiseIcon } from "@phosphor-icons/react"
import { useAnySocketDown } from "@/hooks/socketio/connectionStore"
import { toast } from "@/modules/toast/toast"

/** Grace period before a drop is surfaced — a sub-2s blip never flashes a toast. */
const DOWN_DELAY_MS = 2000
/** How long the "reconnected" confirmation lingers before the toast hides. */
const RECOVERED_MS = 1500

/** Debounced display phase of the status toast. */
type Phase = "hidden" | "down" | "recovered"

/**
 * SocketConnectionStatus — a global, non-blocking "connection lost / reconnecting"
 * toast (same timing as the old Google Docs-style pill). Appears only when a
 * realtime socket drops for longer than {@link DOWN_DELAY_MS}, stays open while
 * down (`timeout: 0`), then auto-confirms "reconnected" and dismisses on recovery.
 *
 * The app keeps working over HTTP, so this is purely informational. Mounted once
 * in {@link import("@/app/InnerLayout").InnerLayout}; renders nothing itself —
 * status is pushed through the shared {@link toast} queue (`ToastProvider`).
 * @see Story: .storybook/stories/blocks/layout/SocketConnectionStatus/SocketConnectionStatus.stories
 */
export const SocketConnectionStatus = () => {
    const t = useTranslations()
    const anyDown = useAnySocketDown()
    const [phase, setPhase] = useState<Phase>("hidden")

    const downTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const recoveredTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    /** Latest phase, read inside async timers without re-subscribing them. */
    const phaseRef = useRef<Phase>("hidden")
    phaseRef.current = phase
    /** Key of the persistent "down" toast — closed when we leave that phase. */
    const downToastKey = useRef<string | null>(null)

    // React to the socket up/down signal: arm a grace timer on drop, confirm on recovery.
    useEffect(() => {
        if (anyDown) {
            if (recoveredTimer.current) {
                clearTimeout(recoveredTimer.current)
                recoveredTimer.current = null
            }
            // wait out the grace period — a brief blip should never show the toast
            if (!downTimer.current) {
                downTimer.current = setTimeout(() => {
                    downTimer.current = null
                    setPhase("down")
                }, DOWN_DELAY_MS)
            }
            return
        }
        // back up — cancel a pending grace timer
        if (downTimer.current) {
            clearTimeout(downTimer.current)
            downTimer.current = null
        }
        // only celebrate "reconnected" if the drop was actually surfaced
        if (phaseRef.current === "down") {
            setPhase("recovered")
        } else {
            setPhase("hidden")
        }
    }, [anyDown])

    // After the "reconnected" confirmation lingers, hide.
    useEffect(() => {
        if (phase !== "recovered") {
            return
        }
        recoveredTimer.current = setTimeout(() => {
            recoveredTimer.current = null
            setPhase("hidden")
        }, RECOVERED_MS)
        return () => {
            if (recoveredTimer.current) {
                clearTimeout(recoveredTimer.current)
                recoveredTimer.current = null
            }
        }
    }, [phase])

    // Drive the toast queue from phase — down is persistent; recovered auto-dismisses.
    useEffect(() => {
        if (phase === "down") {
            const key = toast.warning(t("socketStatus.reconnecting"), {
                timeout: 0,
                indicator: (
                    <ArrowsClockwiseIcon
                        aria-hidden
                        focusable="false"
                        className="size-6 animate-spin text-warning-soft-foreground"
                    />
                ),
            })
            downToastKey.current = typeof key === "string" ? key : null
            return () => {
                if (downToastKey.current) {
                    toast.close(downToastKey.current)
                    downToastKey.current = null
                }
            }
        }

        if (phase === "recovered") {
            toast.success(t("socketStatus.reconnected"), {
                timeout: RECOVERED_MS,
            })
        }

        return undefined
    }, [phase, t])

    // Tidy timers on unmount.
    useEffect(
        () => () => {
            if (downTimer.current) {
                clearTimeout(downTimer.current)
            }
            if (recoveredTimer.current) {
                clearTimeout(recoveredTimer.current)
            }
            if (downToastKey.current) {
                toast.close(downToastKey.current)
                downToastKey.current = null
            }
        },
        [],
    )

    return null
}
