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

// Decorative glow backdrop (aria-hidden) — the only "backdrop"; sits BEHIND the topology.
const GLOW_PART: AnatomyNode = {
    name: "div · glow",
    tier: "primitive",
    role: "nền glow triad StarCi (accent/warning/success) blur — backdrop khí quyển duy nhất, nằm sau topology",
    state: "aria-hidden",
}

// The dot-grid CANVAS is the real container: node cards, the vertical wires, AND the
// floating failure chips all mount INSIDE it (the chips are NOT siblings of the caption).
// Identical composition across every leaf → shared. Order mirrors DOM: node → wire → chip.
const CANVAS_PART: AnatomyNode = {
    name: "motion.div · canvas",
    tier: "primitive",
    role: "canvas dot-grid blueprint — chứa toàn bộ topology, wire nối tier & chip điểm hỏng",
    children: [
        {
            name: "motion.div · node",
            tier: "primitive",
            role: "thẻ node topology (glass) — tone accent = node focal, danger = điểm hỏng, còn lại neutral; lặp theo từng tier",
            children: [
                { name: "span · tên", tier: "primitive", role: "tên node (Open Sans, text-xs)" },
                { name: "span · sub", tier: "primitive", role: "tech tag phụ (text-muted, 10px)" },
            ],
        },
        {
            name: "span · wire",
            tier: "primitive",
            role: "dây nối dọc giữa 2 tier (chỉ hiện từ tier thứ 2 trở đi); entry wire (Client → LB) đỏ = traffic spike",
            state: "aria-hidden",
            children: [
                { name: "span · packet", tier: "primitive", role: "packet dữ liệu chạy dọc dây (đỏ ở entry wire, accent ở các dây còn lại)" },
            ],
        },
        {
            name: "StatusChip",
            tier: "primitive",
            role: "chip điểm hỏng trôi cạnh tier nó đe doạ (overload / cascade / bottleneck)",
            state: "danger",
            children: [
                { name: "WarningIcon", tier: "primitive", role: "glyph cảnh báo ở slot icon của chip (chip ép về size-3, §4)" },
                {
                    name: "span · nhãn",
                    tier: "primitive",
                    role: "nhãn 'from → to' truyền vào children của chip",
                    children: [
                        { name: "CaretRightIcon", tier: "primitive", role: "mũi tên nối from → to trong nhãn" },
                    ],
                },
            ],
        },
    ],
}

// The caption line under the diagram — a ROOT-level sibling of the canvas (only when `caption` is passed).
const CAPTION_PART: AnatomyNode = {
    name: "Typography",
    tier: "primitive",
    role: "caption bài học dưới sơ đồ (body-sm · muted · center)",
    state: "body-sm · muted",
}

// leaf WITH caption: glow backdrop + the dot-grid canvas (topology + wires + failure chips) + the caption line.
const WITH_CAPTION_PARTS: Array<AnatomyNode> = [GLOW_PART, CANVAS_PART, CAPTION_PART]

// leaf WITHOUT caption: same glow + canvas, but the caption Typography is absent.
const NO_CAPTION_PARTS: Array<AnatomyNode> = [GLOW_PART, CANVAS_PART]

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
