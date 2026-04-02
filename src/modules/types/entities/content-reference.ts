import type { AbstractEntity } from "./abstract"
import type { ContentEntity } from "./content"
import type { ContentReferenceTranslationEntity } from "./content-reference-translation"

/**
 * External URL reference attached to module content (docs, repos, etc.).
 *
 * One content has many references; `url` is the canonical link; translations override per locale.
 */
export interface ContentReferenceEntity extends AbstractEntity {
    /** Alias for this reference. */
    alias: string
    /** Target URL for this reference. */
    url: string
    /** Display order within the parent content. */
    orderIndex: number
    /** Default locale for this row (fallback when no translation matches). */
    defaultLocale: string
    /** Parent content when nested in a graph. */
    content?: ContentEntity
    /** Localized field values (e.g. locale-specific `url`). */
    translations?: Array<ContentReferenceTranslationEntity>
}
