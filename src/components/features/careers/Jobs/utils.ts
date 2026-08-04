import type { JobPostingEntity } from "@/modules/types/entities/job-posting"

/**
 * Whether a job posting is past its `expiresAt` and should be treated as closed.
 *
 * The BE serves postings with no expiry filter, so the FE decides liveness:
 * a posting with an `expiresAt` in the past is expired (list rows badge it,
 * the detail page replaces the Apply CTA). A null/absent `expiresAt` never
 * expires.
 *
 * @param job - The posting to check (only `expiresAt` is read).
 * @returns `true` when `expiresAt` is set and already in the past.
 */
export const isJobPostingExpired = (job: Pick<JobPostingEntity, "expiresAt">): boolean => {
    if (!job.expiresAt) {
        return false
    }
    const expiresAt = new Date(job.expiresAt).getTime()
    return Number.isFinite(expiresAt) && expiresAt < Date.now()
}
