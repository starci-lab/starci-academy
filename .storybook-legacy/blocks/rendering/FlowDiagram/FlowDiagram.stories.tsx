import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlowDiagram, FLOW_DIAGRAM_CARD_NODE_TYPE } from "@/components/blocks/rendering/FlowDiagram"
import { Gallery, Variant } from "../../../../story-kit"
import { ARCHITECTURE_EDGES, ARCHITECTURE_NODES } from "./components"

const meta: Meta<typeof FlowDiagram> = {
    title: "Primitives/Rendering/FlowDiagram",
    component: FlowDiagram,
}

export default meta

type Story = StoryObj<typeof FlowDiagram>

/**
 * `FlowDiagram` là canvas render graph `@xyflow/react` dùng chung, tự chứa
 * `ReactFlowProvider` + nền dot + fit-view mặc định. Không gắn với dữ liệu của
 * một feature cụ thể nào (khác MindMap/KnowledgeGraph/MockInterviewDiagram) —
 * chỉ cần truyền `nodes`/`edges` xyflow chuẩn. Story này gộp hai cách dùng: một
 * sơ đồ kiến trúc dùng node card mặc định, và một chuỗi tuyến tính đơn giản.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Sơ đồ tổng quát"
                hint="Dùng khi cần minh hoạ một sơ đồ flow/kiến trúc chung (khái niệm, kiến trúc hệ thống, quy trình) mà không cần logic tương tác đặc thù của MindMap/KnowledgeGraph/MockInterviewDiagram — chỉ truyền nodes/edges là có canvas với provider + nền dot + fit-view sẵn."
            >
                <div className="h-[420px] w-full">
                    <FlowDiagram nodes={ARCHITECTURE_NODES} edges={ARCHITECTURE_EDGES} />
                </div>
            </Variant>
            <Variant
                label="Chuỗi tuyến tính"
                hint="Dùng cho một chuỗi bước tuyến tính đơn giản (một quy trình, một hành trình người dùng) — không cần nhánh, không cần custom node type."
            >
                <div className="h-[420px] w-full">
                    <FlowDiagram
                        nodes={[
                            {
                                id: "enroll",
                                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                                position: { x: 0, y: 0 },
                                data: { label: "Enroll in course" },
                            },
                            {
                                id: "learn",
                                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                                position: { x: 220, y: 0 },
                                data: { label: "Study the lesson" },
                            },
                            {
                                id: "practice",
                                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                                position: { x: 440, y: 0 },
                                data: { label: "Practice" },
                            },
                            {
                                id: "certificate",
                                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                                position: { x: 660, y: 0 },
                                data: { label: "Get certificate" },
                            },
                        ]}
                        edges={[
                            { id: "enroll-learn", source: "enroll", target: "learn" },
                            { id: "learn-practice", source: "learn", target: "practice" },
                            { id: "practice-certificate", source: "practice", target: "certificate" },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Hai cách dùng FlowDiagram: sơ đồ tổng quát dùng node card mặc định cho kiến trúc/quy trình chung, " +
            "và chuỗi tuyến tính đơn giản không cần nhánh hay custom node type. Dùng khi cần tra lúc nào chọn " +
            "node mặc định so với tự định nghĩa node/edge thủ công.",
    },
}
