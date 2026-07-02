import type { AbstractEntity } from "./abstract"
import type { HeadhuntingCompanyEntity } from "./headhunting-company"
import type { UserEntity } from "./user"
import { JobApplyMethod } from "../enums/job-apply-method"
import { JobEmploymentType } from "../enums/job-employment-type"
import { JobPostingSource } from "../enums/job-posting-source"
import { WorkMode } from "../enums/work-mode"

/** A single, structured IT job opening — either curated (seeded) or self-submitted. */
export interface JobPostingEntity extends AbstractEntity {
    /** Job title (e.g. "Senior Backend Engineer"). */
    title: string
    /** Human-facing stable identifier. */
    displayId: string
    /** Markdown job description. */
    description: string
    /** Optional markdown requirements / qualifications. */
    requirements?: string | null
    /** Free-text location (e.g. "Ho Chi Minh City"). */
    location?: string | null
    /** Preferred work arrangement. */
    workMode?: WorkMode | null
    /** Employment arrangement. */
    employmentType?: JobEmploymentType | null
    /** Minimum salary (nullable — null + `salaryMax` null means "negotiable"). */
    salaryMin?: number | null
    /** Maximum salary (nullable — null + `salaryMin` null means "negotiable"). */
    salaryMax?: number | null
    /** How a candidate should apply. */
    applyMethod: JobApplyMethod
    /** External application URL (set iff `applyMethod === ExternalUrl`). */
    applyUrl?: string | null
    /** Application email address (set iff `applyMethod === Email`). */
    applyEmail?: string | null
    /** Provenance — curated seed vs public self-submission (not a moderation state). */
    source: JobPostingSource
    /** Optional expiry timestamp after which the posting should be treated as closed. */
    expiresAt?: Date | null
    /** The posting company. */
    company: HeadhuntingCompanyEntity
    /** The posting company's id. */
    companyId: string
    /** The user who submitted the posting (absent for seeded postings). */
    postedByUser?: UserEntity | null
    /** The submitting user's id. */
    postedByUserId?: string | null
    /** Pure ordering index used to sort/reorder. */
    orderIndex: number
    /** Secondary sort index. */
    sortIndex: number
}
