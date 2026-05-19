import type { AbstractEntity } from "./abstract"

/**
 * Tag attached to a foundation item.
 */
export interface FoundationTagEntity extends AbstractEntity {
    /** Display value (locale-resolved). */
    value: string
    /** Display order within the foundation. */
    orderIndex: number
    /** Parent foundation id. */
    foundationId: string
}
