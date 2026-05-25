import type { AbstractEntity } from "./abstract"

/**
 * Per-language implementation guide (mount `# codeImplementations`).
 */
export interface CodeImplementationEntity extends AbstractEntity {
    /** Display order within the lesson. */
    orderIndex: number
    /** Language key (typescript, go, csharp, …). */
    lang: string
    /** Mapping guide markdown. */
    guide: string
    /** Example code markdown. */
    example: string
}
