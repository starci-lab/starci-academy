/** HeroUI Chip color tokens used by the StarCI AI badges. */
export type StarciAiChipColor =
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "default"

/** Display info for a recommended AI tier (label + badge color). */
export interface StarciAiTierInfo {
    /** Human-readable tier label shown in the badge. */
    label: string
    /** Chip color token for the tier badge. */
    color: StarciAiChipColor
}
