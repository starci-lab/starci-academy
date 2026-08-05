import type { Difficulty } from "@/components/blocks/chips/DifficultyChip"

/**
 * Back-end difficulty string → the `DifficultyChip` scale. The API speaks
 * `easy|medium|hard|insane|expert` while the chip names four TIERS, so this is the
 * one place the two vocabularies meet; unknown or absent values read as `beginner`.
 *
 * @param raw - The backend difficulty string, possibly null.
 * @returns The matching {@link Difficulty}.
 */
export const toDifficulty = (raw: string | null): Difficulty => {
    switch (raw) {
    case "intermediate":
    case "medium":
        return "intermediate"
    case "advanced":
    case "hard":
        return "advanced"
    case "insane":
    case "expert":
        return "insane"
    case "beginner":
    case "easy":
    default:
        return "beginner"
    }
}
