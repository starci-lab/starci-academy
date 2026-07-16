import { toast } from "@heroui/react"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react"

// Phosphor status glyphs (size-6) passed as the `indicator` — the SAME icon family
// as Callout/Alert, never HeroUI toast's own internal icon fallback. This is the
// reference the app's toasts should follow (per-status Phosphor + status colour).
export const fire = {
    success: () =>
        toast.success("Progress saved", {
            description: "The lesson was synced automatically.",
            indicator: <CheckCircleIcon className="size-6 text-success-soft-foreground" />,
        }),
    danger: () =>
        toast.danger("Submission failed", {
            description: "Couldn't connect to GitHub. Try again.",
            indicator: <XCircleIcon className="size-6 text-danger-soft-foreground" />,
        }),
    warning: () =>
        toast.warning("Submission deadline approaching", {
            description: "The milestone closes in 2 days.",
            indicator: <WarningIcon className="size-6 text-warning-soft-foreground" />,
        }),
    info: () =>
        toast.info("Course update available", {
            description: "3 new lessons in the track.",
            indicator: <InfoIcon className="size-6 text-accent-soft-foreground" />,
        }),
}
