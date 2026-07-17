import { Graph, layout } from "@dagrejs/dagre"
import type {
    CourseMindMapEdge,
    CourseMindMapNode,
} from "@/modules/api/graphql/queries/types"

/** Rendered box of a concept node — dagre needs real sizes to avoid overlap. */
const CONCEPT_WIDTH = 216
const CONCEPT_HEIGHT = 68
/** The root (course) node is a touch wider/taller. */
const ROOT_WIDTH = 200
const ROOT_HEIGHT = 76

/**
 * Lays the mind-map out left→right with dagre.
 *
 * The server sends its own coarse coordinates, but it cannot know the CLIENT's real node boxes
 * (label length, chips, fonts) — so we re-rank here with true sizes. That is exactly what the
 * hand-rolled canvas got wrong: fixed pixel maths that broke the moment the container or the
 * content changed. dagre reflows for any N and any box size.
 *
 * @param nodes - Graph nodes from the server (their `position` is ignored).
 * @param edges - Graph edges from the server.
 * @returns The same nodes with dagre-computed top-left positions.
 */
export const layoutConceptGraph = (
    nodes: Array<CourseMindMapNode>,
    edges: Array<CourseMindMapEdge>,
): Array<CourseMindMapNode> => {
    const graph = new Graph()
    graph.setDefaultEdgeLabel(() => ({}))
    graph.setGraph({
        rankdir: "LR",
        // generous rank gap so the edges read as branches, tight within a rank
        ranksep: 96,
        nodesep: 18,
        marginx: 48,
        marginy: 48,
    })

    for (const node of nodes) {
        const isRoot = node.type === "course"
        graph.setNode(node.id, {
            width: isRoot ? ROOT_WIDTH : CONCEPT_WIDTH,
            height: isRoot ? ROOT_HEIGHT : CONCEPT_HEIGHT,
        })
    }
    for (const edge of edges) {
        graph.setEdge(edge.source, edge.target)
    }

    layout(graph)

    return nodes.map((node) => {
        const positioned = graph.node(node.id)
        // dagre returns the node CENTRE; React Flow wants the top-left corner
        return {
            ...node,
            position: positioned
                ? {
                    x: positioned.x - positioned.width / 2,
                    y: positioned.y - positioned.height / 2,
                }
                : node.position,
        }
    })
}
