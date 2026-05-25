import type { AbstractEntity } from "./abstract"
import type { ChallengeEntity } from "./challenge"
import type { CodeExplainingEntity } from "./code-explaining"
import type { CodeImplementationEntity } from "./code-implementation"
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
    /** Critical code snippets with explanations. */
    codeExplainings?: Array<CodeExplainingEntity>
    /** Multi-language implementation guides. */
    codeImplementations?: Array<CodeImplementationEntity>
    /** Whether this content requires enrollment (premium). */
    isPremium: boolean
}

/** Code explaining rows from `content` payload. */
export function getContentCodeExplainings(
    content: Pick<ContentEntity, "codeExplainings"> | undefined,
): Array<CodeExplainingEntity> {
    return content?.codeExplainings ?? []
}

/** Normalized implementation rows from `content` payload. */
export function getContentCodeImplementations(
    content: Pick<ContentEntity, "codeImplementations"> | undefined,
): Array<CodeImplementationEntity> {
    return content?.codeImplementations ?? []
}

/** Challenge count from GraphQL `challenges` relation. */
export function getContentChallengeCount(
    content: Pick<ContentEntity, "challenges">,
): number {
    return content.challenges?.length ?? 0
}
