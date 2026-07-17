import type { GraphQLResponse } from "../../types"

/**
 * What a mind-map node / link points at. `custom` = an AUTHORED concept keyword — it owns no
 * entity itself, it points at the surfaces that teach it via {@link CourseMindMapNodeData.links}.
 */
export type MindMapNodeKind =
    | "course"
    | "module"
    | "lesson"
    | "challenge"
    | "milestone"
    | "flashcard"
    | "interview"
    | "custom"

/** One cross-link from a concept to a surface that teaches / drills / tests it. */
export interface CourseMindMapLink {
    /** Surface kind this link opens. */
    kind: MindMapNodeKind
    /** Resolved target id (null when the authored slug did not resolve, or the kind is section-level). */
    entityId: string | null
    /** Owning module id — set for lesson/challenge links (their route is module-scoped). */
    moduleId: string | null
    /** Authored mount slug of the target. */
    displayId: string | null
}

/** Payload on a mind-map node (`@xyflow/react` node `data`). */
export interface CourseMindMapNodeData {
    /** Label shown on the node (concept keyword, or course/module/lesson title). */
    label: string
    /** What this node represents. */
    kind: MindMapNodeKind
    /** Id of the represented entity — null on concept nodes. */
    entityId: string | null
    /** Owning module id (set on derived lesson nodes). */
    moduleId: string | null
    /** Stable slug of the represented entity / concept id. */
    displayId: string | null
    /** Surfaces this concept links to (empty on the derived module graph). */
    links: Array<CourseMindMapLink>
    /** Optional one-line gloss (authored concepts). */
    desc: string | null
}

/** A mind-map node in `@xyflow/react` shape. */
export interface CourseMindMapNode {
    id: string
    /** Client node-type key (`course` | `concept` | `module` | `lesson`). */
    type: string | null
    /** Server-computed coordinate — the client re-lays out with dagre, so this is a fallback. */
    position: {
        x: number
        y: number
    }
    data: CourseMindMapNodeData
}

/** A mind-map edge in `@xyflow/react` shape. */
export interface CourseMindMapEdge {
    id: string
    source: string
    target: string
    type: string | null
    animated: boolean | null
}

/** The computed course mind-map graph. */
export interface CourseMindMapData {
    nodes: Array<CourseMindMapNode>
    edges: Array<CourseMindMapEdge>
}

/** Apollo variables for `courseMindMap(request: CourseMindMapRequest!)`. */
export interface QueryCourseMindMapRequest {
    /** Course primary-key id OR mount slug (displayId). */
    courseId: string
}

/** Apollo response shape for the `courseMindMap` query. */
export interface QueryCourseMindMapResponse {
    courseMindMap: GraphQLResponse<CourseMindMapData>
}
