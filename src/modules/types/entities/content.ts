import type { AbstractEntity } from "./abstract"
import type { ChallengeEntity } from "./challenge"
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
    /** Challenges linked to this content (id-only when loaded from list queries). */
    challenges?: Array<Pick<ChallengeEntity, "id">>
    /** The number of lessons for the content. */
    numLessons: number
    /** Whether this content requires enrollment (premium). */
    isPremium: boolean
}

/** Challenge count from GraphQL `challenges` relation. */
export function getContentChallengeCount(
    content: Pick<ContentEntity, "challenges">,
): number {
    return content.challenges?.length ?? 0
}
