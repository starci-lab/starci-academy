/**
 * CODING difficulty chip meta (easy/medium/hard ONLY — coding problems, NOT the
 * challenge beginner/intermediate/advanced/insane taxonomy): label key + soft-chip
 * tone (easy green / medium yellow / hard red). Shared between the solve-history
 * list ({@link import("./ProfileCoding").ProfileCoding}) and the problem detail
 * ({@link import("./ProfileCodingProblemDetail").ProfileCodingProblemDetail}) so
 * both surfaces read the same tone scale.
 */
export const CODING_DIFFICULTY_CHIP: Record<string, { labelKey: string; tone: "success" | "warning" | "danger" }> = {
    easy: { labelKey: "publicProfile.skillsSnapshot.diffEasy", tone: "success" },
    medium: { labelKey: "publicProfile.skillsSnapshot.diffMedium", tone: "warning" },
    hard: { labelKey: "publicProfile.skillsSnapshot.diffHard", tone: "danger" },
}

/**
 * Title-case a domain key for display, splitting camelCase into words
 * (e.g. `binarySearch` → "Binary Search").
 * @param key - the raw domain value (camelCase).
 */
export const domainLabel = (key: string): string => {
    const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
