import type { AbstractEntity } from "./abstract"
import type { ModuleEntity } from "./module"

/**
 * One preview content line item in a module.
 */
export interface PreviewContentEntity extends AbstractEntity {
    /** The text of the preview line item (HTML or plain text). */
    text: string
    /** Display order within the module preview list. */
    orderIndex: number
    /** Parent module. */
    module?: ModuleEntity
}

