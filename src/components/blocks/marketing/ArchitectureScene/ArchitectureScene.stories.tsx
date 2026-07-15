import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { ArchitectureScene } from "./index"
import type { ArchitectureSceneData } from "./types"

const meta: Meta<typeof ArchitectureScene> = {
    title: "Core/Rendering/3D",
    component: ArchitectureScene,
}

export default meta

type Story = StoryObj<typeof ArchitectureScene>

/** Sơ đồ mặc định của StarCi (CQRS/CDC) — dùng data JSON đóng gói sẵn trong component. */
export const Default: Story = {
    parameters: { usage: "Sơ đồ kiến trúc 3D mặc định (backend StarCi) — dùng cho hero trang landing." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Sơ đồ mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Sơ đồ kiến trúc 3D mặc định của backend StarCi (CQRS/CDC) — dùng cho hero trang landing, data JSON đóng gói sẵn.
                </Typography>
            </div>
            <ArchitectureScene caption="Luồng ghi/đọc tách rời qua CDC — thất bại dạy: CDC trễ → đọc dữ liệu cũ." />
        </div>
    ),
}

/** Sơ đồ nhỏ tự soạn: client → load balancer → 2 service → database, kèm 1 node báo lỗi. */
const SMALL_DATA: ArchitectureSceneData = {
    board: { cols: [0, 2], rows: [0, 1], cell: 2 },
    camera: { position: [8, 8, 8], zoom: 34 },
    nodes: [
        { id: "client", name: "Trình duyệt", sub: "web client", cell: [0, 0], kind: "client" },
        { id: "lb", name: "Load Balancer", cell: [1, 0], kind: "loadBalancer" },
        { id: "api", name: "API Service", sub: "nestjs", cell: [2, 0], kind: "container", tone: "danger", status: { tone: "danger", text: "quá tải" } },
        { id: "db", name: "PostgreSQL", sub: "primary", cell: [2, 1], kind: "database", tone: "success" },
    ],
    edges: [
        { from: "client", to: "lb", flow: true },
        { from: "lb", to: "api", congested: true },
        { from: "api", to: "db", tone: "success" },
    ],
}

/** Sơ đồ tuỳ biến qua prop `data` — minh hoạ 1 node đang gặp sự cố (tone `danger` + status). */
export const CustomScene: Story = {
    parameters: { usage: "Truyền prop `data` tuỳ biến — dùng khi cần minh hoạ một kiến trúc/sự cố khác ngoài sơ đồ mặc định." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Sơ đồ tuỳ biến</Label>
                <Typography type="body-sm" color="muted">
                    Truyền prop data để minh hoạ một kiến trúc/sự cố khác — ví dụ một node tone danger kèm status báo lỗi.
                </Typography>
            </div>
            <ArchitectureScene data={SMALL_DATA} caption="Load Balancer đang dồn traffic khiến API Service quá tải." />
        </div>
    ),
}
