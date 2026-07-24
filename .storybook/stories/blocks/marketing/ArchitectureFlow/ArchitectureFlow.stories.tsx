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

// Multi-node flow: bordered node-box spans (each WRAPPING a code Typography) joined
// by caret connectors that sit BETWEEN boxes (data + wrap share this composition).
// The span (node box) and CaretRightIcon (connector) are bare chrome — plain HTML /
// a decorative glyph, not registered components — so neither gets a node. The node
// LABEL is a Typography ArchitectureFlow renders directly → ONE node representing
// the repeated per-node label (mirrors how a repeated design/primitive is one node).
const FLOW_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "nhãn mỗi node (style \"code\"), lặp theo mảng nodes" },
]

// Single node: one bordered box wrapping its Typography, NO connector (caret only
// appears between nodes) — same composition as FLOW_PARTS minus the connector.
const SINGLE_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "nhãn node duy nhất (style \"code\")" },
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
                leaf="SingleNode"
                parts={SINGLE_PARTS}
                note="Chỉ một node → hộp Typography đứng một mình, KHÔNG có CaretRightIcon (connector chỉ hiện giữa các node)."
            >
                <ArchitectureFlow nodes={["Client"]} showAnatomy />
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
                leaf="TypicalFlow"
                parts={FLOW_PARTS}
                reason="Minh hoạ một luồng kiến trúc thật (Client → Gateway → Cache → DB) chỉ bằng CSS, không cần ảnh chụp. Gói các hộp node + caret vào một block để feature chỉ truyền mảng tên node — tự wrap khi khung hẹp, dùng lại ở mọi section 'hệ thống bạn xây'."
            >
                <ArchitectureFlow nodes={["Client", "API Gateway", "Cache", "PostgreSQL"]} showAnatomy />
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
                leaf="LongLabelsWrap"
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
                        showAnatomy
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
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="Mảng node rỗng → không hộp, không caret; block chỉ còn hàng flex trống (ở đây bọc trong khung dashed để thấy)."
            >
                <div className="rounded-md border border-dashed border-default px-4 py-3">
                    <ArchitectureFlow nodes={[]} showAnatomy />
                </div>
            </BlockAnatomy>,
        ),
}
