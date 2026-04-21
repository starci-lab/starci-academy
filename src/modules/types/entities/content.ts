import type { AbstractEntity } from "./abstract"
import type { ContentReferenceEntity } from "./content-reference"
import type { ModuleEntity } from "./module"

/**
 * Content attached to a module (title + body).
 */
export interface ContentEntity extends AbstractEntity {
    /** The display id. */
    displayId?: string
    /** The thumbnail URL. */
    thumbnailUrl?: string
    /** Content title. */
    title: string
    /** The description of the content. */
    description: string
    /** Markdown / HTML body. */
    body: string
    /** The order index of the content. */
    orderIndex: number
    /** The module that the content belongs to. */
    module?: ModuleEntity
    /** The minutes read of the content. */
    minutesRead: number
    /** External URL references for this content. */
    references?: Array<ContentReferenceEntity>
    /** The number of challenges for the content. */
    numChallenges: number
    /** The number of lessons for the content. */
    numLessons: number
}
