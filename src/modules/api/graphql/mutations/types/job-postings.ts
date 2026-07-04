import type { GraphQLResponse } from "../../types"
import type { JobApplyMethod } from "@/modules/types/enums/job-apply-method"
import type { JobEmploymentType } from "@/modules/types/enums/job-employment-type"
import type { WorkMode } from "@/modules/types/enums/work-mode"

/** GraphQL `SubmitJobPostingNewCompanyRequest` — brand-new company (no `companyId` match). */
export interface SubmitJobPostingNewCompanyRequest {
    /** New company display name. */
    title: string
    /** Optional logo image URL. */
    logoUrl?: string
    /** Optional public website URL. */
    websiteUrl?: string
}

/**
 * GraphQL `SubmitJobPostingRequest` body — exactly one of `companyId` /
 * `newCompany` is required; `applyUrl` required iff `applyMethod` is
 * `ExternalUrl`, `applyEmail` required iff `applyMethod` is `Email`.
 */
export interface SubmitJobPostingRequest {
    /** Job title. */
    title: string
    /** Markdown job description. */
    description: string
    /** Optional markdown requirements. */
    requirements?: string
    /** Optional free-text location. */
    location?: string
    /** Optional preferred work arrangement. */
    workMode?: WorkMode
    /** Optional employment arrangement. */
    employmentType?: JobEmploymentType
    /** Optional minimum salary — both null/omitted means "negotiable". */
    salaryMin?: number
    /** Optional maximum salary — both null/omitted means "negotiable". */
    salaryMax?: number
    /** How a candidate should apply. */
    applyMethod: JobApplyMethod
    /** External application URL — required iff `applyMethod === ExternalUrl`. */
    applyUrl?: string
    /** Application email — required iff `applyMethod === Email`. */
    applyEmail?: string
    /** An existing company's id (mutually exclusive with `newCompany`). */
    companyId?: string
    /** A brand-new company to create (mutually exclusive with `companyId`). */
    newCompany?: SubmitJobPostingNewCompanyRequest
}

/** Apollo response shape for `submitJobPosting` (returns the new posting id). */
export interface MutateSubmitJobPostingResponse {
    /** Top-level `submitJobPosting` field wrapping the standard API response. */
    submitJobPosting: GraphQLResponse<string>
}
