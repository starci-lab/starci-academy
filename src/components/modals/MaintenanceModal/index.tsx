"use client"

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useMaintenanceOverlayState,
} from "@/hooks/zustand/overlay/hooks"
import {
    queryPlatformStats,
} from "@/modules/api/graphql/queries/query-platform-stats"
import { _MaintenanceModal } from "./component"

/** How often to re-probe the backend while the dialog is open (ms). */
const POLL_INTERVAL_MS = 9_000

/**
 * `MaintenanceModal` — the CONNECTED half: owns the maintenance overlay store, the
 * poll loop, the probe fetch, and resolves every string, then hands them to the
 * presentational {@link _MaintenanceModal}. See that file's header for the full
 * behavioural contract (non-dismissable, polls while open, "Retry" re-probes
 * immediately). Mounted prop-less by `ModalContainer`. See `tiers/split.md`.
 *
 * A plain network error (offline/timeout/CORS) carries no HTTP status and never
 * reaches this dialog — that path is unchanged (still just logged).
 */
export const MaintenanceModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen, close } = useMaintenanceOverlayState()
    const [isChecking, setChecking] = useState(false)
    const inFlightRef = useRef(false)

    /** Re-probe the backend once; closes the dialog on success, stays open on failure. */
    const probe = useCallback(async () => {
        if (inFlightRef.current) return
        inFlightRef.current = true
        setChecking(true)
        try {
            await queryPlatformStats({})
            close()
        } catch {
            // still down — leave the dialog open for the next poll tick / manual retry
        } finally {
            inFlightRef.current = false
            setChecking(false)
        }
    }, [close])

    useEffect(() => {
        if (!isOpen) return
        const interval = setInterval(probe, POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [isOpen, probe])

    return (
        <_MaintenanceModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            isChecking={isChecking}
            onRetry={probe}
            labels={{
                title: t("maintenance.title"),
                description: t("maintenance.description"),
                pollStatus: t("maintenance.pollStatus"),
                retry: t("maintenance.retry"),
            }}
        />
    )
}
