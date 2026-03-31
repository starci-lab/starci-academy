import type { AbstractEntity } from "./abstract"
import type { ModuleEntity } from "./module"

/**
 * Content attached to a module (title + body).
 */
export interface ContentEntity extends AbstractEntity {
    /** Content title. */
    title: string
    /** Markdown / HTML body. */
    body: string
    /** The order index of the content. */
    orderIndex: number
    /** The module that the content belongs to. */
    module?: ModuleEntity
}
