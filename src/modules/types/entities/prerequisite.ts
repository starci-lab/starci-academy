import type { AbstractEntity } from "./abstract"
import type { CourseEntity } from "./course"

/**
 * One prerequisite line on a course landing page.
 */
export interface PrerequisiteEntity extends AbstractEntity {
    /** The text of the prerequisite. */
    text: string
    /** The order index of the prerequisite. */
    orderIndex: number
    /** The course that the prerequisite belongs to. */
    course?: CourseEntity
}
