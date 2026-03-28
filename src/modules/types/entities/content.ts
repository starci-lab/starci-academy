import type { AbstractEntity } from "./abstract"
import type { ModuleEntity } from "./module"

/**
 * Lesson or topic block inside a module.
 */
export interface ContentEntity extends AbstractEntity {
    /** The title of the content. */
    title: string
    /** The description of the content. */
    description: string | null
    /** The order index of the content. */
    orderIndex: number
    /** The module that the content belongs to. */
    module?: ModuleEntity
}
