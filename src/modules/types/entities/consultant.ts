import type { AbstractEntity } from "./abstract"
import type { HeadhuntingCompanyEntity } from "./headhunting-company"

/** IT recruitment consultant profile linked to a headhunting company. */
export interface ConsultantEntity extends AbstractEntity {
    /** Human-facing stable identifier. */
    displayId: string
    /** Consultant's full name. */
    fullName: string
    /** Job title or role (e.g. "Senior Recruiter"). */
    jobTitle?: string | null
    /** Optional consultant bio or description. */
    description?: string | null
    /** LinkedIn profile URL. */
    linkedinUrl?: string | null
    /** Contact email address. */
    email?: string | null
    /** Contact phone number. */
    phoneNumber?: string | null
    /** Zalo contact number. */
    zaloNumber?: string | null
    /** Avatar / profile picture URL. */
    avatarUrl?: string | null
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Parent company id. */
    companyId: string
    /** Parent headhunting company when loaded. */
    company?: HeadhuntingCompanyEntity
    /**
     * Whether the viewer's CV score meets {@link cvScoreUnlockThreshold} — when
     * `false`, `email` / `phoneNumber` / `zaloNumber` / `linkedinUrl` are `null`
     * server-side (never sent). Anonymous viewers always get `false`.
     */
    contactUnlocked: boolean
    /** The CV score (0-100) required to unlock contact info; always `70`. */
    cvScoreUnlockThreshold: number
}
