import type { AbstractEntity } from "./abstract"
import type { EnrollmentEntity } from "./enrollment"
import type { SubmissionEntity } from "./submission"

/**
 * Application user; identity comes from Keycloak (keycloakId = JWT sub).
 */
export interface UserEntity extends AbstractEntity {
    /** The username of the user. */
    username: string
    /** The email of the user. */
    email?: string
    /** The Keycloak ID of the user. */
    keycloakId: string
    /** Whether the user is deleted. */
    isDeleted: boolean
    /** The avatar of the user. */
    avatar?: string
    /** Display name editable by the user; falls back to username when absent. */
    displayName?: string | null
    /** Short bio / tagline shown on the profile. */
    bio?: string | null
    /** Linked GitHub username (null/undefined when the user has not linked GitHub yet). */
    githubUsername?: string | null
    /** Number of users who follow this user (resolved field). */
    followerCount?: number
    /** Number of users this user follows (resolved field). */
    followingCount?: number
    /** True when the requesting viewer already follows this user (resolved field). */
    isFollowedByMe?: boolean
    /** When true the profile is locked — only the owner sees the full content (FB-style). */
    profileLocked?: boolean
    /** Whether two-factor authentication (TOTP) is enabled for the user. */
    twoFactorEnabled?: boolean
    /** The submissions of the user. */
    submissions?: Array<SubmissionEntity>
    /** The enrollments of the user. */
    enrollments?: Array<EnrollmentEntity>
}
