import type { Meta, StoryObj } from "@storybook/nextjs"
import { MicroservicesScene } from "./MicroservicesScene"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a coded hero illustration: an isometric "mini infra" (pod cubes behind
 * a service, a single-node datastore = the bottleneck) drawn in pure SVG. The
 * topology is fixed inside the block; only `caption` is a prop.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis reflecting the parts THAT leaf composes — the caption-less
 * shape has no composed DS part (just the SVG art), the captioned shapes add a
 * `Typography` line. There is no separate consolidated "Anatomy" story.
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

// Caption-less leaf: pure SVG art, no composed DS part.
const NO_CAPTION_PARTS: Array<AnatomyNode> = []

// Captioned leaves (short + long-wrap share this): SVG art + a muted caption line.
const CAPTIONED_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "caption bài học dưới minh hoạ", state: "body-sm · muted" },
]

/** NO CAPTION — the bare scene: only the isometric SVG, no caption. */
export const NoCaption: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="MicroservicesScene"
                tier="design"
                leaf="Không caption"
                parts={NO_CAPTION_PARTS}
                note="Chỉ minh hoạ SVG isometric, KHÔNG có caption Typography — composition trần của scene."
                reason="Value-prop System Design/DevOps thành hình: một 'mini infra' isometric (pod cubes sau một service, một datastore single-node là điểm nghẽn) vẽ thuần SVG. Topology cố định trong block, chỉ `caption` là prop."
            >
                <div className="max-w-xl">
                    <MicroservicesScene />
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
                leaf="Caption ngắn"
                parts={CAPTIONED_PARTS}
                note="Thêm caption Typography (body-sm · muted) dưới minh hoạ — composition khác leaf trần."
            >
                <div className="max-w-xl">
                    <MicroservicesScene caption="Một node database duy nhất là điểm nghẽn của toàn hệ thống." />
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
                leaf="Caption dài (wrap)"
                parts={CAPTIONED_PARTS}
                note="CÙNG composition với 'Caption ngắn' — chỉ khác độ dài caption + bề rộng khung nên chữ xuống dòng."
            >
                <div className="max-w-[420px]">
                    <MicroservicesScene caption="Ba pod chạy song song phía sau service, nhưng cả ba đều ghi vào cùng một Postgres một node — khi lưu lượng tăng, node này nghẽn trước, kéo sập cả cụm dù các pod vẫn khoẻ." />
                </div>
            </BlockAnatomy>,
        ),
}
