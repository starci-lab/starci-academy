import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArchitectureScene } from "./ArchitectureScene"
import type { ArchitectureSceneData } from "./types"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ArchitectureScene> = {
    title: "Design/Marketing/ArchitectureScene",
    component: ArchitectureScene,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ArchitectureScene>

const ANATOMY = {
    primitives: [
        { name: "Typography", role: "caption bài học dưới scene 3D" },
    ],
    reason:
        "Hero kiến trúc dạng 3D thật (WebGL, flat-isometric tiles-on-a-grid), driven hoàn toàn bằng JSON `data` + 3 tone token (normal/success/danger). Đổi `data` là render bất kỳ sơ đồ/sự cố nào — mặc định là backend StarCi (CQRS/CDC).",
}

/** A small custom diagram: client → load balancer → 2 services → database, with one node reporting an error. */
const SMALL_DATA: ArchitectureSceneData = {
    board: { cols: [0, 2], rows: [0, 1], cell: 2 },
    camera: { position: [8, 8, 8], zoom: 34 },
    nodes: [
        { id: "client", name: "Browser", sub: "web client", cell: [0, 0], kind: "client" },
        { id: "lb", name: "Load Balancer", cell: [1, 0], kind: "loadBalancer" },
        { id: "api", name: "API Service", sub: "nestjs", cell: [2, 0], kind: "container", tone: "danger", status: { tone: "danger", text: "overloaded" } },
        { id: "db", name: "PostgreSQL", sub: "primary", cell: [2, 1], kind: "database", tone: "success" },
    ],
    edges: [
        { from: "client", to: "lb", flow: true },
        { from: "lb", to: "api", congested: true },
        { from: "api", to: "db", tone: "success" },
    ],
}

export const DefaultScene: Story = {
    render: () =>
        blockShell(
            <div className="w-[720px] max-w-full">
                <ArchitectureScene caption="Write and read paths decoupled through CDC — the failure it teaches: CDC lag → reading stale data." />
            </div>,
            ANATOMY,
        ),
}

export const CustomData: Story = {
    render: () =>
        blockShell(
            <div className="w-[720px] max-w-full">
                <ArchitectureScene data={SMALL_DATA} caption="The load balancer is funneling traffic and overloading the API service." />
            </div>,
            ANATOMY,
        ),
}

/** `selectedId` + `onSelectNode`: nodes become clickable and the selected node's
 *  label gets an accent ring — a master-detail atlas syncing the map with a
 *  sidebar/URL (`onSelectNode` no-op here since selection is driven by the story). */
export const SelectedNode: Story = {
    render: () =>
        blockShell(
            <div className="w-[720px] max-w-full">
                <ArchitectureScene
                    data={SMALL_DATA}
                    caption="Node được chọn (selectedId) nổi viền accent quanh nhãn."
                    selectedId="api"
                    onSelectNode={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** `caption` omitted — the scene renders alone, no caption line underneath. */
export const NoCaption: Story = {
    render: () =>
        blockShell(
            <div className="w-[720px] max-w-full">
                <ArchitectureScene data={SMALL_DATA} />
            </div>,
            ANATOMY,
        ),
}

/** The remaining `NodeKind`s not shown by the other stories (`pod`, `user`) plus an
 *  `eventual` (faint, async-read) edge and the `warning`/`info` status tones. */
const POD_USER_DATA: ArchitectureSceneData = {
    board: { cols: [0, 2], rows: [0, 0], cell: 2 },
    camera: { position: [8, 8, 8], zoom: 34 },
    nodes: [
        { id: "user", name: "End user", sub: "learner", cell: [0, 0], kind: "user" },
        {
            id: "pod",
            name: "Payment Pod",
            sub: "hex nhóm",
            cell: [1, 0],
            kind: "pod",
            status: { tone: "warning", text: "chậm p95" },
        },
        {
            id: "gateway",
            name: "Gateway",
            sub: "edge",
            cell: [2, 0],
            kind: "loadBalancer",
            status: { tone: "info", text: "canary 5%" },
        },
    ],
    edges: [
        { from: "user", to: "pod", eventual: true },
        { from: "pod", to: "gateway", flow: true },
    ],
}

export const PodAndUserKinds: Story = {
    render: () =>
        blockShell(
            <div className="w-[720px] max-w-full">
                <ArchitectureScene
                    data={POD_USER_DATA}
                    caption="Kind `pod` (nhóm chức năng, drill-down) + `user` (đầu người dùng) — cạnh `eventual` mờ hơn; status `warning`/`info`."
                />
            </div>,
            ANATOMY,
        ),
}
