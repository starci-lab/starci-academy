import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArchitectureScene } from "./ArchitectureScene"
import type { ArchitectureSceneData } from "./types"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a data-driven 3D architecture hero (real WebGL via react-three-fiber):
 * a flat-isometric board where JSON `data` places node meshes on a grid and wires
 * them into a DAG, with an optional `Typography` caption underneath.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. The scene emits no anchors (it does
 * not import AnatomyOverlay / take `showAnatomy`), so `Sơ đồ` is a clean render +
 * numbered legend.
 */
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

/** Plain canvas wrapping each leaf's BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

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

// The captioned scene composition: a WebGL board (grid + wires + node meshes) with
// a Typography caption below. Shared by every captioned leaf — the node KINDS differ
// per leaf (that lives in each leaf's `note`), but the composition is the same.
const SCENE_PARTS: Array<AnatomyNode> = [
    {
        name: "Canvas · WebGL",
        tier: "design",
        role: "board 3D flat-isometric (react-three-fiber), tự fit camera theo bounding-box node",
        children: [
            { name: "Line · grid", tier: "primitive", role: "sàn iso, lưới trên biên ô cell" },
            { name: "Edge · wire", tier: "primitive", role: "dây nối có hướng + gói chạy (flow / congested / eventual)", state: "×N" },
            {
                name: "Bar · node",
                tier: "design",
                role: "một node đặt trên ô cell (lặp ×N)",
                children: [
                    { name: "KindMesh", tier: "primitive", role: "khối 3D theo `kind` (container · database · broker · loadBalancer · client · user · pod)" },
                    { name: "Html · nhãn nổi", tier: "primitive", role: "chip surface: tên · sub · icon kind · dòng status theo tone" },
                ],
            },
        ],
    },
    { name: "Typography", tier: "primitive", role: "caption bài học dưới scene", state: "body-sm · muted" },
]

// SelectedNode leaf: same scene, but `onSelectNode` makes nodes clickable and
// `selectedId` adds an accent ring under the chosen node's label.
const SELECTED_PARTS: Array<AnatomyNode> = [
    {
        name: "Canvas · WebGL",
        tier: "design",
        role: "board 3D flat-isometric, nodes tương tác được",
        children: [
            { name: "Line · grid", tier: "primitive", role: "sàn iso, lưới trên biên ô cell" },
            { name: "Edge · wire", tier: "primitive", role: "dây nối có hướng + gói chạy", state: "×N" },
            {
                name: "Bar · node",
                tier: "design",
                role: "node bấm được (onSelectNode); node đang chọn thêm ring accent",
                state: "selected · clickable",
                children: [
                    { name: "KindMesh", tier: "primitive", role: "khối 3D theo `kind`" },
                    { name: "Html · nhãn nổi", tier: "primitive", role: "chip surface + ring accent khi selectedId khớp" },
                ],
            },
        ],
    },
    { name: "Typography", tier: "primitive", role: "caption bài học dưới scene", state: "body-sm · muted" },
]

// NoCaption leaf: same board, but `caption` omitted → the Typography line drops.
const NO_CAPTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Canvas · WebGL",
        tier: "design",
        role: "board 3D flat-isometric (react-three-fiber), tự fit camera theo bounding-box node",
        children: [
            { name: "Line · grid", tier: "primitive", role: "sàn iso, lưới trên biên ô cell" },
            { name: "Edge · wire", tier: "primitive", role: "dây nối có hướng + gói chạy", state: "×N" },
            {
                name: "Bar · node",
                tier: "design",
                role: "một node đặt trên ô cell (lặp ×N)",
                children: [
                    { name: "KindMesh", tier: "primitive", role: "khối 3D theo `kind`" },
                    { name: "Html · nhãn nổi", tier: "primitive", role: "chip surface: tên · sub · icon kind · status" },
                ],
            },
        ],
    },
]

export const DefaultScene: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ArchitectureScene"
                tier="design"
                leaf="Mặc định · backend StarCi"
                parts={SCENE_PARTS}
                reason="Hero kiến trúc dạng 3D thật (WebGL, flat-isometric tiles-on-a-grid), driven hoàn toàn bằng JSON `data` + 3 tone token (normal/success/danger). Đổi `data` là render bất kỳ sơ đồ/sự cố nào — mặc định là backend StarCi (CQRS/CDC)."
            >
                <div className="w-[720px] max-w-full">
                    <ArchitectureScene caption="Write and read paths decoupled through CDC — the failure it teaches: CDC lag → reading stale data." />
                </div>
            </BlockAnatomy>,
        ),
}

export const CustomData: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ArchitectureScene"
                tier="design"
                leaf="Data tuỳ biến"
                parts={SCENE_PARTS}
                note="Cùng composition với leaf mặc định; `data` nhỏ hơn (client → LB → API → PostgreSQL), node `api` tone danger + status 'overloaded'."
            >
                <div className="w-[720px] max-w-full">
                    <ArchitectureScene data={SMALL_DATA} caption="The load balancer is funneling traffic and overloading the API service." />
                </div>
            </BlockAnatomy>,
        ),
}

/** `selectedId` + `onSelectNode`: nodes become clickable and the selected node's
 *  label gets an accent ring — a master-detail atlas syncing the map with a
 *  sidebar/URL (`onSelectNode` no-op here since selection is driven by the story). */
export const SelectedNode: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ArchitectureScene"
                tier="design"
                leaf="Node được chọn"
                parts={SELECTED_PARTS}
                note="onSelectNode bật → node bấm được; selectedId='api' thêm ring accent quanh nhãn (khác leaf data ở tính tương tác)."
            >
                <div className="w-[720px] max-w-full">
                    <ArchitectureScene
                        data={SMALL_DATA}
                        caption="Node được chọn (selectedId) nổi viền accent quanh nhãn."
                        selectedId="api"
                        onSelectNode={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** `caption` omitted — the scene renders alone, no caption line underneath. */
export const NoCaption: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ArchitectureScene"
                tier="design"
                leaf="Không caption"
                parts={NO_CAPTION_PARTS}
                note="Bỏ `caption` → KHÔNG render Typography, chỉ còn Canvas (khác các leaf khác đúng một part)."
            >
                <div className="w-[720px] max-w-full">
                    <ArchitectureScene data={SMALL_DATA} />
                </div>
            </BlockAnatomy>,
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
        shell(
            <BlockAnatomy
                name="ArchitectureScene"
                tier="design"
                leaf="Kind pod + user"
                parts={SCENE_PARTS}
                note="Cùng composition; KindMesh lần này là `pod` + `user` + `loadBalancer`, cạnh `eventual` mờ hơn, status warning/info."
            >
                <div className="w-[720px] max-w-full">
                    <ArchitectureScene
                        data={POD_USER_DATA}
                        caption="Kind `pod` (nhóm chức năng, drill-down) + `user` (đầu người dùng) — cạnh `eventual` mờ hơn; status `warning`/`info`."
                    />
                </div>
            </BlockAnatomy>,
        ),
}
