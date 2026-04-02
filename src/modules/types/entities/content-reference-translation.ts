import type { AbstractEntity } from "./abstract"

/**
 * Localized row for a {@link ContentReferenceEntity} (`field`: `alias` for link label). URL is not translated.
 */
export interface ContentReferenceTranslationEntity extends AbstractEntity {
    /** Owning reference id. */
    contentReferenceId: string
    /** Locale code (e.g. `vi`, `en`). */
    locale: string
    /** Field name being translated (typically `alias`). */
    field: string
    /** Translated value. */
    value: string
}
