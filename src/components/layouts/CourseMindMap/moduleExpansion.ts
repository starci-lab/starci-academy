/** React Flow node type id for placeholder cards under a module. */
export const COURSE_MODULE_SLOT_NODE_TYPE = "courseModuleSlot" as const

/** Width of a child “slot” card under a module (px). */
export const SLOT_NODE_WIDTH = 200

/** Approximate height of a slot card for layout (px). */
export const SLOT_NODE_HEIGHT = 52

/** Vertical distance between consecutive slot card **tops** (px). */
export const SLOT_VERTICAL_STEP = 110

/** Module card body height used when stacking slots below the module (`min-h` in `ModuleNode`). */
export const MODULE_CARD_BODY_HEIGHT = 100

/** Gap from module bottom to first slot top (px). */
export const SLOT_FIRST_OFFSET_Y = 28

/**
 * Stable React Flow node id for a placeholder slot under a module.
 * @param moduleId — Course module id (same as the parent `courseModule` node id).
 * @param index — Zero-based slot index in `0..4`.
 */
export const moduleSlotNodeId = (moduleId: string, index: number): string => `${moduleId}__slot__${index}`

/**
 * React Flow handle id on the module node for edges to slot children.
 */
export const MODULE_CHILD_SOURCE_HANDLE = "module-child-source" as const
