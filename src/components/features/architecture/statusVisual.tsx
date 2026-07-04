import React from "react"
import type { ReactNode } from "react"
import { CheckCircleIcon, CircleDashedIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react"
import type { HealthByName } from "./hooks/useSystemHealthPoll"

/** The 4 states a node can render as — `checking` is the HONEST default
 *  before any probe has resolved (never a fake green). */
export type ArchitectureStatusState = "checking" | "up" | "degraded" | "down" | "unknown"

/** Visual tokens for one status: the dot fill class, the `bg/10 text/…` chip
 *  className, and a leading icon — all built from semantic tokens only (see
 *  `elements/color.md` §2: `bg-<Color>/10` tint + `text-<Color>` icon/label). */
export interface ArchitectureStatusVisual {
    dotClassName: string
    chipClassName: string
    icon: ReactNode
    pulse?: boolean
}

const VISUAL: Record<ArchitectureStatusState, ArchitectureStatusVisual> = {
    checking: {
        dotClassName: "bg-muted",
        chipClassName: "bg-default text-muted",
        icon: <CircleDashedIcon aria-hidden focusable="false" className="size-3" />,
        pulse: true,
    },
    up: {
        dotClassName: "bg-success",
        chipClassName: "bg-success/10 text-success",
        icon: <CheckCircleIcon aria-hidden focusable="false" className="size-3" />,
    },
    degraded: {
        dotClassName: "bg-warning",
        chipClassName: "bg-warning/10 text-warning",
        icon: <WarningIcon aria-hidden focusable="false" className="size-3" />,
    },
    down: {
        dotClassName: "bg-danger",
        chipClassName: "bg-danger/10 text-danger",
        icon: <XCircleIcon aria-hidden focusable="false" className="size-3" />,
    },
    unknown: {
        dotClassName: "bg-muted",
        chipClassName: "bg-default text-muted",
        icon: <CircleDashedIcon aria-hidden focusable="false" className="size-3" />,
    },
}

/**
 * Resolves a component's honest display state from the live poll:
 * - `healthByName === null` (no probe has resolved yet) → `"checking"` for EVERY node.
 * - a probed status not in the catalog (shouldn't happen, but never fake it) → `"unknown"`.
 * - otherwise the real `up` / `degraded` / `down` from the backend.
 *
 * @param name - Component name (must match a `systemHealthStatus` entry).
 * @param healthByName - Latest poll result, or `null` before the first resolve.
 */
export const resolveArchitectureStatus = (
    name: string,
    healthByName: HealthByName | null,
): ArchitectureStatusState => {
    if (healthByName === null) return "checking"
    const health = healthByName[name]
    if (!health) return "unknown"
    if (health.status === "up" || health.status === "degraded" || health.status === "down") {
        return health.status
    }
    return "unknown"
}

/** Looks up the {@link ArchitectureStatusVisual} for a resolved state. */
export const getArchitectureStatusVisual = (state: ArchitectureStatusState): ArchitectureStatusVisual => VISUAL[state]
