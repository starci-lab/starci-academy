import type { Meta, StoryObj } from "@storybook/nextjs"
import { MicroservicesScene } from "./MicroservicesScene"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a coded hero illustration: an isometric "mini infra" (pod cubes behind
 * a service, a single-node datastore = the bottleneck) drawn in pure SVG. The
 * topology is fixed inside the block; only `caption` is a prop.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis reflecting the parts THAT leaf composes — every leaf composes
 * the isometric `svg` scene (its iso primitives + connectors + labels). The
 * optional caption renders via its own badged `Typography` node (the block
 * directly composing it to show the `caption` prop still gets an anchor) — so a
 * captioned leaf has one more part than the bare leaf. There is no separate
 * consolidated "Anatomy" story.
 */
const meta: Meta<typeof MicroservicesScene> = {
    title: "Design/Marketing/MicroservicesScene",
    component: MicroservicesScene,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MicroservicesScene>

/** Plain canvas: each leaf's anatomy panel gets breathing room. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// The isometric `svg` scene — a fixed topology drawn in pure SVG: a Service·LB hex
// in front of a 3-pod deployment (one accent focal pod) all wiring into a single-node
// datastore (the danger bottleneck), with connectors + a flowing packet, SVG text
// labels, a failure flag and a legend. Shared by EVERY leaf (topology is fixed art;
// only `caption` is a prop), so it's the sole part of the caption-less leaf.
const SCENE_PARTS: Array<AnatomyNode> = [
    {
        name: "Svg.Scene",
        tier: "design",
        role: "canvas isometric 'mini infra' — topology cố định, thuần SVG (no image/WebGL)",
        children: [
            {
                name: "G.Connectors",
                tier: "primitive",
                role: "dây nối svc → 3 pods; dây pods → DB đơn tô đỏ (hot path nghẽn)",
                children: [
                    { name: "Circle.Packet", tier: "primitive", role: "gói chạy dọc dây vào service (animateMotion, CSS)" },
                ],
            },
            { name: "IsoSvc", tier: "primitive", role: "node Service·LB (hex iso) phía trước deployment" },
            { name: "IsoPod", tier: "primitive", role: "pod cube iso của deployment", state: "×3 · 1 accent focal" },
            { name: "IsoDb", tier: "primitive", role: "datastore trụ iso, single-node = điểm nghẽn", state: "danger" },
            { name: "Text.Label", tier: "primitive", role: "nhãn SVG: Service·LB / Deployment·3 pods / Postgres·1 node", state: "×3" },
            { name: "G.ErrorFlag", tier: "primitive", role: "cảnh báo ⚠ single DB → bottleneck (tone danger)" },
            { name: "Legend", tier: "primitive", role: "2 circle+text rời: focal pod (accent) · where it breaks (danger)" },
        ],
    },
]

// leaf WITH caption: same isometric svg scene, PLUS a root-level Typography —
// MicroservicesScene directly renders its own `caption` prop through it, so it's
// its own badged node/anchor (not folded into the block).
const CAPTION_PARTS: Array<AnatomyNode> = [
    ...SCENE_PARTS,
    { name: "Typography", tier: "primitive", role: "caption dưới scene — MicroservicesScene tự render prop `caption`" },
]

/** NO CAPTION — the bare scene: only the isometric SVG, no caption. */
export const NoCaption: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="MicroservicesScene"
                tier="design"
                leaf="NoCaption"
                parts={SCENE_PARTS}
                note="Chỉ minh hoạ SVG isometric, KHÔNG có caption — composition trần của scene."
                reason="Value-prop System Design/DevOps thành hình: một 'mini infra' isometric (pod cubes sau một service, một datastore single-node là điểm nghẽn) vẽ thuần SVG. Topology cố định trong block, chỉ `caption` là prop."
            >
                <div className="max-w-xl">
                    <MicroservicesScene showAnatomy />
                </div>
            </BlockAnatomy>,
        ),
}

/** SHORT CAPTION — scene + a one-line caption underneath. */
export const ShortCaption: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="MicroservicesScene"
                tier="design"
                leaf="ShortCaption"
                parts={CAPTION_PARTS}
                note="Thêm caption dưới minh hoạ (Typography riêng, có anchor) — thêm 1 node so với leaf trần."
            >
                <div className="max-w-xl">
                    <MicroservicesScene showAnatomy caption="Một node database duy nhất là điểm nghẽn của toàn hệ thống." />
                </div>
            </BlockAnatomy>,
        ),
}

/** LONG CAPTION (wrap) — same composition, caption wraps across lines in a narrow frame. */
export const LongCaptionWrap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="MicroservicesScene"
                tier="design"
                leaf="LongCaptionWrap"
                parts={CAPTION_PARTS}
                note="CÙNG composition với 'Caption ngắn' — chỉ khác độ dài caption + bề rộng khung nên chữ xuống dòng."
            >
                <div className="max-w-[420px]">
                    <MicroservicesScene showAnatomy caption="Ba pod chạy song song phía sau service, nhưng cả ba đều ghi vào cùng một Postgres một node — khi lưu lượng tăng, node này nghẽn trước, kéo sập cả cụm dù các pod vẫn khoẻ." />
                </div>
            </BlockAnatomy>,
        ),
}
