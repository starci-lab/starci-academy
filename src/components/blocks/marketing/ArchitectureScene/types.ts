/**
 * JSON schema for {@link ArchitectureScene}. A scene is pure DATA — topology + layout +
 * camera — so it can be authored / generated as a `.json` file and swapped freely. Colours
 * are NOT in the data: nodes/edges reference a `tone` by NAME and the component owns the
 * palette (design tokens), keeping the JSON small and the styling in one place.
 */

/**
 * The only three tones, mapped to theme tokens:
 *  - `normal`  → `--foreground` (the default node/wire)
 *  - `success` → `--success` (healthy / solid)
 *  - `danger`  → `--danger` (a hot, about-to-burn aura on nodes)
 */
export type SceneTone = "normal" | "success" | "danger"

/** Status badge tone (coloured text line inside a node's label frame). */
export type StatusTone = "danger" | "warning" | "success" | "info"

/** A status note attached to a node (e.g. a failure / info call-out). */
export interface ArchitectureStatus {
    tone: StatusTone
    text: string
}

/** A node, placed on an integer grid cell `[cx, cz]` (world centre = cell × board.cell). */
export interface ArchitectureNode {
    /** Unique id (referenced by edges). */
    id: string
    /** Primary label. */
    name: string
    /** Optional mono sub-label. */
    sub?: string
    /** Grid cell `[col, row]`. */
    cell: [number, number]
    /** Tone (default `"normal"`). */
    tone?: SceneTone
    /** Optional status line shown inside this node's label frame. */
    status?: ArchitectureStatus
}

/** A directed wire between two nodes (by id). */
export interface ArchitectureEdge {
    from: string
    to: string
    /** Colour tone (default `"normal"`). */
    tone?: SceneTone
    /** Animate a glowing packet travelling along the wire. */
    flow?: boolean
    /** Render fainter — the "eventual / async read" style. */
    eventual?: boolean
}

/** Square iso floor board: inclusive `[min, max]` cell range + world units per cell. */
export interface ArchitectureBoard {
    cols: [number, number]
    rows: [number, number]
    cell: number
}

/** Orthographic (isometric) camera. */
export interface ArchitectureCamera {
    position: [number, number, number]
    zoom: number
}

/** A full scene — everything the component needs to render, as plain data. */
export interface ArchitectureSceneData {
    board: ArchitectureBoard
    camera: ArchitectureCamera
    nodes: ArchitectureNode[]
    edges: ArchitectureEdge[]
}
