import type { Meta, StoryObj } from "@storybook/nextjs"
import { MicroservicesDiagram } from "./MicroservicesDiagram"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a coded hero illustration: a curated microservices topology framed over
 * a blueprint dot-grid, with the failure points floated beside the area they
 * threaten. Topology + failures are fixed data inside the block; only `caption` is
 * a prop.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof MicroservicesDiagram> = {
    title: "Design/Marketing/MicroservicesDiagram",
    component: MicroservicesDiagram,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MicroservicesDiagram>

/** Frame each leaf's anatomy panel with breathing room. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// leaf WITH caption: failure chips + the caption line under the diagram.
const WITH_CAPTION_PARTS: Array<AnatomyNode> = [
    { name: "StatusChip", tier: "primitive", role: "nhãn điểm hỏng (overload/cascade/bottleneck) trôi cạnh tier", state: "danger" },
    { name: "Typography", tier: "primitive", role: "caption bài học dưới sơ đồ" },
]

// leaf WITHOUT caption: only the failure chips — the caption Typography is absent.
const NO_CAPTION_PARTS: Array<AnatomyNode> = [
    { name: "StatusChip", tier: "primitive", role: "nhãn điểm hỏng (overload/cascade/bottleneck) trôi cạnh tier", state: "danger" },
]

export const WithCaption: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="MicroservicesDiagram"
                tier="design"
                leaf="Có caption"
                parts={WITH_CAPTION_PARTS}
                reason="Minh hoạ hero bằng code: topology microservices trên nền dot-grid blueprint, node focal accent + các điểm hỏng trôi cạnh vùng chúng đe doạ. Topology + failures là dữ liệu cố định trong block (chỉ `caption` là prop) — kể một câu chuyện 'v2 ngây thơ này sập ở đâu'."
            >
                <div className="max-w-xl">
                    <MicroservicesDiagram caption="Một node Postgres, một luồng đồng bộ tới Payment — đây là công thức cho một sự cố dây chuyền." />
                </div>
            </BlockAnatomy>,
        ),
}

export const NoCaption: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="MicroservicesDiagram"
                tier="design"
                leaf="Không caption"
                parts={NO_CAPTION_PARTS}
                note="Không truyền `caption` → dòng Typography dưới sơ đồ biến mất, chỉ còn topology + chip điểm hỏng."
            >
                <div className="max-w-xl">
                    <MicroservicesDiagram />
                </div>
            </BlockAnatomy>,
        ),
}

export const NarrowWrap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="MicroservicesDiagram"
                tier="design"
                leaf="Màn hẹp"
                parts={WITH_CAPTION_PARTS}
                note="Trên màn hẹp các node xuống dòng nhưng CÙNG composition với leaf 'Có caption'."
            >
                <div className="max-w-[320px]">
                    <MicroservicesDiagram caption="Trên màn hẹp, các node vẫn giữ đúng thứ tự tier dù phải xuống dòng." />
                </div>
            </BlockAnatomy>,
        ),
}
