import { toast as heroToast } from "@heroui/react"
import type { ReactNode } from "react"
import {
    CheckCircleIcon,
    InfoIcon,
    WarningIcon,
    XCircleIcon,
} from "@phosphor-icons/react"

/** Options a status toast accepts — HeroUI's, minus the `variant` it already implies. */
type StatusToastOptions = Parameters<typeof heroToast.success>[1]

/**
 * Per-status Phosphor indicator (size-6) — the SAME icon family as Callout/Alert,
 * never HeroUI toast's own internal icon fallback. Injected by default so every app
 * toast reads consistently; a caller can still override via `options.indicator`.
 */
const INDICATOR: Record<"success" | "danger" | "warning" | "info", ReactNode> = {
    success: <CheckCircleIcon className="size-6 text-success-soft-foreground" />,
    danger: <XCircleIcon className="size-6 text-danger-soft-foreground" />,
    warning: <WarningIcon className="size-6 text-warning-soft-foreground" />,
    info: <InfoIcon className="size-6 text-accent-soft-foreground" />,
}

/**
 * App toast — a thin wrapper over HeroUI's imperative `toast` that injects the
 * canonical Phosphor status indicator (size-6). Import THIS (`@/modules/toast/toast`)
 * instead of `@heroui/react`'s `toast` so every toast matches the Storybook reference
 * (`Overlays/Toast`). Non-status pass-throughs (`promise`, `close`, `clear`, …) are
 * kept from the base `toast`.
 */
export const toast = {
    ...heroToast,
    success: (message: ReactNode, options?: StatusToastOptions) =>
        heroToast.success(message, { indicator: INDICATOR.success, ...options }),
    danger: (message: ReactNode, options?: StatusToastOptions) =>
        heroToast.danger(message, { indicator: INDICATOR.danger, ...options }),
    warning: (message: ReactNode, options?: StatusToastOptions) =>
        heroToast.warning(message, { indicator: INDICATOR.warning, ...options }),
    info: (message: ReactNode, options?: StatusToastOptions) =>
        heroToast.info(message, { indicator: INDICATOR.info, ...options }),
}
