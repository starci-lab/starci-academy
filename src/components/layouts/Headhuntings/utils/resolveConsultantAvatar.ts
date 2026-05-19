/** Fallback avatar when `avatarUrl` is missing or fails to load. */
export const DEFAULT_CONSULTANT_AVATAR_URL =
    "https://starci.org/headhunters/default-avatar.jpg"

/**
 * Resolves consultant avatar URL with default fallback.
 */
export const resolveConsultantAvatarUrl = (
    avatarUrl?: string | null,
): string => {
    const trimmed = avatarUrl?.trim()
    return trimmed || DEFAULT_CONSULTANT_AVATAR_URL
}
