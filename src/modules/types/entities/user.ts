import type { AbstractEntity } from "./abstract"
import type { EnrollmentEntity } from "./enrollment"
import type { SubmissionEntity } from "./submission"
import type { WorkMode, AuthenticationType, BackgroundEffect } from "../enums"

/**
 * Per-section visibility flags for the public profile (all default true). Each key
 * gates ONE section tab (projects / challenges / skills / activity) for visitors;
 * Overview + CV are never gated by these flags.
 */
export interface SectionVisibility {
    /** Show the "Projects" tab to visitors. */
    projects: boolean
    /** Show the "Challenges" tab to visitors. */
    challenges: boolean
    /** Show the "Skills" tab to visitors. */
    skills: boolean
    /** Show the "Activity" tab to visitors. */
    activity: boolean
}

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
    /** How the user signs in (provider = login method): google / github / credentials. */
    authenticationType?: AuthenticationType | null
    /** The user's unified global points balance (course activities + coding practice). */
    points?: number
    /** Number of users who follow this user (resolved field). */
    followerCount?: number
    /** Number of users this user follows (resolved field). */
    followingCount?: number
    /** True when the requesting viewer already follows this user (resolved field). */
    isFollowedByMe?: boolean
    /** When true the profile is locked — only the owner sees the full content (FB-style). */
    profileLocked?: boolean
    /** When true the user is open to work (shows a hiring badge). */
    openToWork?: boolean
    /**
     * Per-section profile visibility (all default true). When a flag is false the
     * matching profile tab is hidden from VISITORS and its data query is guarded by
     * the backend; the owner always sees every section. Overview + CV are unaffected
     * (CV keeps its own `is_public` gate). Absent = treat every section as visible.
     */
    sectionVisibility?: SectionVisibility
    /** Slug of the achievement pinned as the profile mascot (frames the avatar); null = none. */
    featuredAchievementSlug?: string | null
    /** Professional headline / role title shown under the user's name. */
    roleTitle?: string | null
    /** Free-text location shown on the profile. */
    location?: string | null
    /** Preferred work arrangement (remote / hybrid / onsite). */
    workMode?: WorkMode | null
    /** Public LinkedIn profile URL. */
    linkedinUrl?: string | null
    /** Personal website / portfolio URL. */
    websiteUrl?: string | null
    /** User-chosen accent color (hex); null/undefined = default brand accent. */
    accentColor?: string | null
    /** Ambient background effect chosen for the app chrome. */
    backgroundEffect?: BackgroundEffect
    /** Whether two-factor authentication (TOTP) is enabled for the user. */
    twoFactorEnabled?: boolean
    /** The submissions of the user. */
    submissions?: Array<SubmissionEntity>
    /** The enrollments of the user. */
    enrollments?: Array<EnrollmentEntity>
}
