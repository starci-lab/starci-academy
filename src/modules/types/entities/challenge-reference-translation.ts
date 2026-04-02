import type { AbstractEntity } from "./abstract"

/**
 * Localized row for a {@link ChallengeReferenceEntity} (`field`: typically `alias`).
 */
export interface ChallengeReferenceTranslationEntity extends AbstractEntity {
    challengeReferenceId: string
    locale: string
    field: string
    value: string
}
