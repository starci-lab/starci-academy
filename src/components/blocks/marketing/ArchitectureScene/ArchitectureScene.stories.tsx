import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { ArchitectureScene } from "./index"
import type { ArchitectureSceneData } from "./types"

const meta: Meta<typeof ArchitectureScene> = {
    title: "Blocks/Marketing/ArchitectureScene",
    component: ArchitectureScene,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ArchitectureScene>

/** Sơ đồ kiến trúc gọn: client → load balancer → 2 service, minh hoạ một luồng đơn giản
 *  (không dùng scene mặc định StarCi backend) cho các trang cần một kiến trúc khác/tuỳ biến. */
const SIMPLE_FLOW_DATA: ArchitectureSceneData = {
    board: { cols: [0, 2], rows: [0, 1], cell: 3 },
    camera: { position: [10, 10, 10], zoom: 34 },
    nodes: [
        { id: "user", name: "Người dùng", cell: [0, 0], kind: "user" },
        { id: "lb", name: "Load Balancer", cell: [1, 0], kind: "loadBalancer" },
        { id: "api", name: "API Service", sub: "node.js", cell: [2, 0], kind: "container" },
        { id: "db", name: "PostgreSQL", cell: [2, 1], kind: "database" },
    ],
    edges: [
        { from: "user", to: "lb", flow: true },
        { from: "lb", to: "api", flow: true },
        { from: "api", to: "db" },
    ],
}

/** Sơ đồ có một node đang gặp sự cố (tone danger + status cảnh báo) và một cạnh nghẽn traffic,
 *  minh hoạ ca "lỗi hệ thống" mà landing hero muốn dạy (VD CDC lag → stale read). */
const INCIDENT_DATA: ArchitectureSceneData = {
    board: { cols: [0, 2], rows: [0, 1], cell: 3 },
    camera: { position: [10, 10, 10], zoom: 34 },
    nodes: [
        { id: "write", name: "Write Service", sub: "cqrs", cell: [0, 0], kind: "container", tone: "success" },
        { id: "queue", name: "Kafka", cell: [1, 0], kind: "broker" },
        {
            id: "read",
            name: "Read Service",
            sub: "stale",
            cell: [2, 0],
            kind: "container",
            tone: "danger",
            status: { tone: "danger", text: "CDC lag 8s" },
        },
        { id: "db", name: "PostgreSQL", cell: [1, 1], kind: "database" },
    ],
    edges: [
        { from: "write", to: "db" },
        { from: "db", to: "queue", eventual: true },
        { from: "queue", to: "read", congested: true },
    ],
}

/** Dùng scene mặc định (kiến trúc backend thật của StarCi — CQRS write→read split) cho hero
 *  landing khi cần minh hoạ tổng quan hệ thống mà không cần truyền `data` tuỳ biến. */
export const Default: Story = {
    parameters: { usage: "Dùng scene mặc định (kiến trúc backend thật của StarCi) cho hero landing khi cần minh hoạ tổng quan hệ thống mà không cần truyền data tuỳ biến." },
    render: () => <ArchitectureScene />,
}

/** Truyền `data` tuỳ biến kèm `caption` khi cần kể một câu chuyện kiến trúc khác (không phải
 *  sơ đồ backend StarCi) và có một dòng chú thích ngắn bên dưới scene. */
export const CustomTopologyWithCaption: Story = {
    parameters: { usage: "Truyền data tuỳ biến kèm caption khi cần kể một câu chuyện kiến trúc khác (không phải sơ đồ backend StarCi) và có một dòng chú thích ngắn bên dưới scene." },
    render: () => (
        <ArchitectureScene
            data={SIMPLE_FLOW_DATA}
            caption="Luồng request đi từ người dùng qua load balancer đến service và database."
        />
    ),
}

/** Node tone `danger` kèm `status` cảnh báo và cạnh `congested`, dùng khi minh hoạ một sự cố
 *  thật (VD CDC lag gây stale read) mà bài học muốn nhấn mạnh điểm nghẽn trong hệ thống. */
export const IncidentHighlight: Story = {
    parameters: { usage: "Node tone danger kèm status cảnh báo và cạnh congested, dùng khi minh hoạ một sự cố thật (VD CDC lag gây stale read) mà bài học muốn nhấn mạnh điểm nghẽn." },
    render: () => <ArchitectureScene data={INCIDENT_DATA} caption="CDC lag khiến Read Service trả dữ liệu cũ." />,
}

/** Bật `selectedId` + `onSelectNode` để đồng bộ lựa chọn giữa scene và một sidebar/rail bên
 *  cạnh (click vào node nào, rail hiện chi tiết node đó) — dùng cho trang atlas kiến trúc. */
export const Selectable: Story = {
    parameters: { usage: "Bật selectedId + onSelectNode để đồng bộ lựa chọn giữa scene và một sidebar/rail bên cạnh (click vào node nào, rail hiện chi tiết node đó) — dùng cho trang atlas kiến trúc." },
    render: () => {
        const [selectedId, setSelectedId] = useState<string>("api")
        return (
            <ArchitectureScene
                data={SIMPLE_FLOW_DATA}
                selectedId={selectedId}
                onSelectNode={setSelectedId}
                caption="Click vào một node để chọn — dùng để đồng bộ với sidebar chi tiết."
            />
        )
    },
}
