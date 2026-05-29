import type {
    Edge,
    Node,
} from "@xyflow/react"

/** A React Flow graph: nodes + edges for the course/module mind map. */
export interface MindGraph {
    /** All nodes (course root + module leaves). */
    nodes: Array<Node>
    /** Edges connecting the root to each module leaf. */
    edges: Array<Edge>
}
