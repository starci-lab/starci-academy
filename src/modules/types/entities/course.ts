import type { AbstractEntity } from "./abstract"
import type { ModuleEntity } from "./module"
import type { EnrollmentEntity } from "./enrollment"
import type { PrerequisiteEntity } from "./prerequisite"
import type { QnaEntity } from "./qna"

/**
 * Course with ordered modules and landing-page metadata.
 */
export interface CourseEntity extends AbstractEntity {
    /** The title of the course. */
    title: string
    /** The slug of the course. */
    slug: string | null
    /** The description of the course. */
    description: string | null
    /** The CDN URL of the course. */
    cdnUrl: string | null
    /** The prerequisites of the course. */
    prerequisites?: Array<PrerequisiteEntity>
    /** The Q&A entries of the course. */
    qnas?: Array<QnaEntity>
    /** The modules of the course. */
    modules?: Array<ModuleEntity>
    /** The enrollments of the course. */
    enrollments?: Array<EnrollmentEntity>
}
