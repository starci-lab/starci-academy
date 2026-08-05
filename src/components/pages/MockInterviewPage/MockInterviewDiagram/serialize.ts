/** Plain node snapshot consumed by {@link serializeMockInterviewDiagram}. */
export interface MockInterviewDiagramSerializeNode {
    /** Node id (matches the `source`/`target` ids on edges). */
    id: string
    /** Node's current label text. */
    label: string
}

/** Plain edge snapshot consumed by {@link serializeMockInterviewDiagram}. */
export interface MockInterviewDiagramSerializeEdge {
    /** Id of the node this edge starts from. */
    source: string
    /** Id of the node this edge points to. */
    target: string
}

/**
 * Renders a diagram snapshot (plain nodes/edges — no `@xyflow/react` dependency)
 * into a short, human-readable plain-text block suitable for appending to a
 * chat/grading transcript: one `- {label}` line per box, followed by one
 * `{sourceLabel} -> {targetLabel}` line per arrow, with edge endpoints resolved
 * back to their node labels. Edges referencing an unknown node id fall back to
 * the raw id so nothing silently disappears. Returns `""` when there are no nodes.
 *
 * @param nodes - Boxes on the diagram.
 * @param edges - Arrows connecting boxes, by node id.
 * @returns A short plain-text description of the diagram, or `""` when empty.
 */
export const serializeMockInterviewDiagram = (
    nodes: Array<MockInterviewDiagramSerializeNode>,
    edges: Array<MockInterviewDiagramSerializeEdge>,
): string => {
    if (nodes.length === 0) {
        return ""
    }

    const labelById = new Map(nodes.map((node) => [node.id, node.label]))
    const resolveLabel = (id: string) => labelById.get(id) ?? id

    const nodeLines = nodes.map((node) => `- ${node.label}`)
    const edgeLines = edges.map((edge) => `${resolveLabel(edge.source)} -> ${resolveLabel(edge.target)}`)

    return [...nodeLines, ...edgeLines].join("\n")
}
