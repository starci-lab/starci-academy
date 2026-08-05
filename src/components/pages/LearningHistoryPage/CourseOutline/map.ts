import type { StatusChipTone } from "@/components/blocks/chips/StatusChip"


/**
 * Map a challenge lifecycle status to a {@link StatusChipTone}:
 * completed → success, failed → danger, inProgress → warning, otherwise neutral.
 *
 * @param status - The backend status string.
 * @returns The matching status-chip tone.
 */
export const toStatusTone = (status: string): StatusChipTone => {
    switch (status) {
    case "completed":
        return "success"
    case "failed":
        return "danger"
    case "inProgress":
        return "warning"
    default:
        return "neutral"
    }
}

/** Challenge statuses that count as "attempted" (score is meaningful). */
const ATTEMPTED_STATUSES: ReadonlyArray<string> = ["inProgress", "failed", "completed"]

/**
 * Whether a challenge status means the viewer has attempted it (so a score line
 * is worth showing).
 *
 * @param status - The backend status string.
 * @returns `true` when the challenge has been attempted.
 */
export const isAttempted = (status: string): boolean => ATTEMPTED_STATUSES.includes(status)
