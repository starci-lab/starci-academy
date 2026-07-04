"use client"

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react"
import {
    AlertDialog,
    Button,
    Spinner,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useMaintenanceOverlayState,
} from "@/hooks/zustand/overlay/hooks"
import {
    queryPlatformStats,
} from "@/modules/api/graphql/queries/query-platform-stats"

/** How often to re-probe the backend while the dialog is open (ms). */
const POLL_INTERVAL_MS = 9_000

/**
 * MaintenanceModal — the app-wide blocking dialog opened by the Apollo
 * `ErrorLink` when the backend keeps returning a 5xx status (persistent, not a
 * one-off — `RetryLink` already exhausted its retries before `ErrorLink` sees
 * it). Uses HeroUI `AlertDialog`, whose defaults (`isDismissable={false}`,
 * `isKeyboardDismissDisabled`) make it the app's first non-dismissable overlay
 * — no close button, no backdrop-click, no Escape. It clears itself the moment
 * a lightweight probe query succeeds; "Thử lại" re-probes immediately without
 * waiting for the next poll tick.
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
        <AlertDialog
            isOpen={isOpen}
            onOpenChange={setOpen}
        >
            <AlertDialog.Backdrop
                isDismissable={false}
                isKeyboardDismissDisabled
            >
                <AlertDialog.Container size="sm">
                    <AlertDialog.Dialog>
                        <AlertDialog.Header>
                            <AlertDialog.Icon status="warning" />
                            <AlertDialog.Heading>
                                {t("maintenance.title")}
                            </AlertDialog.Heading>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                            <p>{t("maintenance.description")}</p>
                        </AlertDialog.Body>
                        <AlertDialog.Footer className="w-full items-center justify-between">
                            <Typography
                                type="body-xs"
                                color="muted"
                                className="flex items-center gap-2"
                            >
                                {isChecking ? <Spinner color="current" size="sm" /> : null}
                                {t("maintenance.pollStatus")}
                            </Typography>
                            <Button
                                variant="primary"
                                isDisabled={isChecking}
                                onPress={probe}
                            >
                                {t("maintenance.retry")}
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    )
}
