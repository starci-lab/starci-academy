import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArchitectureFlow } from "./ArchitectureFlow"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a compact coded mini-architecture diagram: labelled node boxes joined
 * by caret connectors, pure CSS (no image), wrapping on narrow widths.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ArchitectureFlow> = {
    title: "Design/Marketing/ArchitectureFlow",
    component: ArchitectureFlow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ArchitectureFlow>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Multi-node flow: node boxes joined by caret connectors (data + wrap share this).
const FLOW_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "nhãn node kiểu code (type=code)" },
    { name: "CaretRightIcon", tier: "primitive", role: "connector nối các node theo hướng luồng" },
]

// Single node: one box, NO connector (caret only appears between nodes).
const SINGLE_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "nhãn node kiểu code (type=code) — một hộp, chưa có caret" },
]

// Empty: no node labels → the block renders an empty flex row (no parts composed).
const EMPTY_PARTS: Array<AnatomyNode> = []

/** SINGLE — one node box, no connector (caret only sits between nodes). */
export const SingleNode: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ArchitectureFlow"
                tier="design"
                leaf="Một node"
                parts={SINGLE_PARTS}
                note="Chỉ một node → hộp Typography đứng một mình, KHÔNG có CaretRightIcon (connector chỉ hiện giữa các node)."
            >
                <ArchitectureFlow nodes={["Client"]} />
            </BlockAnatomy>,
        ),
}

/** FLOW — a representative system flow: node boxes joined by caret connectors. */
export const TypicalFlow: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ArchitectureFlow"
                tier="design"
                leaf="Luồng điển hình"
                parts={FLOW_PARTS}
                reason="Minh hoạ một luồng kiến trúc thật (Client → Gateway → Cache → DB) chỉ bằng CSS, không cần ảnh chụp. Gói các hộp node + caret vào một block để feature chỉ truyền mảng tên node — tự wrap khi khung hẹp, dùng lại ở mọi section 'hệ thống bạn xây'."
            >
                <ArchitectureFlow nodes={["Client", "API Gateway", "Cache", "PostgreSQL"]} />
            </BlockAnatomy>,
        ),
}

/** WRAP — long labels in a narrow frame; SAME composition as the typical flow. */
export const LongLabelsWrap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ArchitectureFlow"
                tier="design"
                leaf="Nhãn dài wrap"
                parts={FLOW_PARTS}
                note="Khung hẹp + nhãn dài → hàng tự xuống dòng nhưng CÙNG composition với leaf 'Luồng điển hình'."
            >
                <div className="max-w-[360px]">
                    <ArchitectureFlow
                        nodes={[
                            "Client Mobile App",
                            "API Gateway (Kong)",
                            "Redis Cache Cluster",
                            "Kafka Event Bus",
                            "PostgreSQL Primary + Replica",
                        ]}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** EMPTY — no node labels → the block renders an empty row (no parts composed). */
export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ArchitectureFlow"
                tier="design"
                leaf="Rỗng"
                parts={EMPTY_PARTS}
                note="Mảng node rỗng → không hộp, không caret; block chỉ còn hàng flex trống (ở đây bọc trong khung dashed để thấy)."
            >
                <div className="rounded-md border border-dashed border-default px-4 py-3">
                    <ArchitectureFlow nodes={[]} />
                </div>
            </BlockAnatomy>,
        ),
}
