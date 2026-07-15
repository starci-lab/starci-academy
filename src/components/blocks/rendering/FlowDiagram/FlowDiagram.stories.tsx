import type { Meta, StoryObj } from "@storybook/nextjs"
import type { Edge, Node } from "@xyflow/react"
import { Label, Typography } from "@heroui/react"
import { FlowDiagram, FLOW_DIAGRAM_CARD_NODE_TYPE } from "./index"

/**
 * `FlowDiagram` — canvas render đồ thị `@xyflow/react` dùng chung, tự có
 * `ReactFlowProvider` + nền chấm + fit-view sẵn. Không gắn với dữ liệu của
 * riêng feature nào (khác MindMap/KnowledgeGraph/MockInterviewDiagram) — chỉ
 * cần truyền `nodes`/`edges` chuẩn xyflow.
 */
const meta = {
    title: "Core/Rendering/XYFlow",
    component: FlowDiagram,
} satisfies Meta<typeof FlowDiagram>

export default meta

type Story = StoryObj<typeof meta>

/** 6 khái niệm kiến trúc web cơ bản, nối theo luồng request thật. */
const ARCHITECTURE_NODES: Array<Node> = [
    {
        id: "client",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 0, y: 80 },
        data: { label: "Trình duyệt", description: "Gửi request" },
    },
    {
        id: "cdn",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 220, y: 0 },
        data: { label: "CDN", description: "Cache tài nguyên tĩnh" },
    },
    {
        id: "gateway",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 220, y: 160 },
        data: { label: "API Gateway", description: "Định tuyến + auth" },
    },
    {
        id: "service",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 460, y: 160 },
        data: { label: "Service", description: "Xử lý nghiệp vụ" },
    },
    {
        id: "cache",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 700, y: 80 },
        data: { label: "Redis", description: "Cache kết quả" },
    },
    {
        id: "db",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 700, y: 240 },
        data: { label: "PostgreSQL", description: "Lưu trữ chính" },
    },
]

const ARCHITECTURE_EDGES: Array<Edge> = [
    { id: "client-cdn", source: "client", target: "cdn" },
    { id: "client-gateway", source: "client", target: "gateway" },
    { id: "gateway-service", source: "gateway", target: "service" },
    { id: "service-cache", source: "service", target: "cache" },
    { id: "service-db", source: "service", target: "db" },
]

/** Sơ đồ kiến trúc đơn giản dùng node card mặc định (khái niệm + mô tả ngắn). */
export const Default: Story = {
    args: {
        nodes: ARCHITECTURE_NODES,
        edges: ARCHITECTURE_EDGES,
    },
    parameters: {
        usage: "Dùng khi cần minh hoạ một sơ đồ luồng/kiến trúc chung (concept, kiến trúc hệ thống, quy trình) mà không cần logic tương tác riêng của MindMap/KnowledgeGraph/MockInterviewDiagram — chỉ truyền nodes/edges là có canvas render sẵn provider + nền chấm + fit-view.",
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Sơ đồ luồng chung</Label>
                <Typography type="body-sm" color="muted">
                    Truyền nodes/edges chuẩn xyflow là có canvas render sẵn provider + nền chấm + fit-view — cho sơ đồ concept/kiến trúc/quy trình.
                </Typography>
            </div>
            <div className="h-[420px] w-full">
                <FlowDiagram {...args} />
            </div>
        </div>
    ),
}

/** 4 bước quy trình học tập nối tuần tự, minh hoạ đồ thị tuyến tính. */
export const LinearFlow: Story = {
    args: {
        nodes: [
            {
                id: "enroll",
                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                position: { x: 0, y: 0 },
                data: { label: "Ghi danh khoá học" },
            },
            {
                id: "learn",
                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                position: { x: 220, y: 0 },
                data: { label: "Học bài" },
            },
            {
                id: "practice",
                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                position: { x: 440, y: 0 },
                data: { label: "Luyện tập" },
            },
            {
                id: "certificate",
                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                position: { x: 660, y: 0 },
                data: { label: "Nhận chứng chỉ" },
            },
        ],
        edges: [
            { id: "enroll-learn", source: "enroll", target: "learn" },
            { id: "learn-practice", source: "learn", target: "practice" },
            { id: "practice-certificate", source: "practice", target: "certificate" },
        ],
    },
    parameters: {
        usage: "Dùng cho một chuỗi bước tuyến tính đơn giản (quy trình, hành trình người dùng) — không cần nhánh rẽ hay node type riêng.",
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chuỗi tuyến tính</Label>
                <Typography type="body-sm" color="muted">
                    Một chuỗi bước tuyến tính đơn giản (quy trình, hành trình người dùng) — không nhánh rẽ, không node type riêng.
                </Typography>
            </div>
            <div className="h-[420px] w-full">
                <FlowDiagram {...args} />
            </div>
        </div>
    ),
}
