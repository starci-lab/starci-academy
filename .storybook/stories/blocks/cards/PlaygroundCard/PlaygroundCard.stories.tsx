import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundCard } from "./PlaygroundCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — one exercise cell in the Playground hub grid: icon tile + title +
 * step-count chip + a single CTA.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. Every leaf here shares the same
 * composition (only title/stepCount vary), so they reuse one PARTS constant.
 */
const meta: Meta<typeof PlaygroundCard> = {
    title: "Design/Cards/PlaygroundCard",
    component: PlaygroundCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PlaygroundCard>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// The single composition every leaf renders (only title/stepCount differ). The raw
// HeroUI Card/Card.Content/Card.Footer frame is intentionally not modeled (same
// house convention as CourseCard). TerminalWindowIcon / ListChecksIcon / ArrowRightIcon
// stay CUT — each is just the value passed into its wrapping component's `icon` prop
// (IconTile's icon, StatusChip's icon, Button's icon). The title Typography is NOT
// cut: PlaygroundCard writes `<Typography>{title}</Typography>` itself (not a value
// folded into another primitive's slot), so it badges like any other directly-composed part.
const CARD_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "avatar terminal tô nền accent (size lg)" },
    { name: "Typography", tier: "primitive", role: "tiêu đề bài thực hành (h6, bold, truncate)" },
    { name: "StatusChip", tier: "primitive", role: "chip số bước \"N bước\" (neutral) — meta chìm" },
    { name: "Button", tier: "primitive", role: "CTA \"Vào playground\" — hành động duy nhất (primary, w-full)" },
]

export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PlaygroundCard"
                tier="design"
                leaf="Có dữ liệu"
                parts={CARD_PARTS}
                reason="Một ô bài thực hành trong lưới hub Playground cần MỘT nhận diện hình ảnh nhất quán (IconTile terminal) + tiêu đề + chip số bước + một CTA vào phòng lab. Gói vào một block để mọi ô trong lưới (Docker/Kubernetes) cùng một khuôn — feature chỉ truyền title/stepCount/onOpen, không dựng lại icon-tile và CTA ở mỗi ô."
            >
                <div className="w-64">
                    <PlaygroundCard
                        title="Triển khai container Nginx đầu tiên"
                        stepCount={5}
                        onOpen={() => {}}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const SingleStep: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PlaygroundCard"
                tier="design"
                leaf="Một bước"
                parts={CARD_PARTS}
                note="stepCount = 1 → chip chỉ hiện '1 bước', CÙNG composition với leaf 'Có dữ liệu'."
            >
                <div className="w-64">
                    <PlaygroundCard
                        title="Kiểm tra phiên bản Docker"
                        stepCount={1}
                        onOpen={() => {}}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const ManySteps: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PlaygroundCard"
                tier="design"
                leaf="Nhiều bước"
                parts={CARD_PARTS}
                note="stepCount lớn → chip '12 bước', composition không đổi."
            >
                <div className="w-64">
                    <PlaygroundCard
                        title="Dựng cluster Kubernetes nhiều node"
                        stepCount={12}
                        onOpen={() => {}}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const LongTitleTruncate: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PlaygroundCard"
                tier="design"
                leaf="Tiêu đề dài"
                parts={CARD_PARTS}
                note="Tiêu đề dài → Typography truncate giữ một dòng; composition vẫn y hệt."
            >
                <div className="w-64">
                    <PlaygroundCard
                        title="Triển khai hệ thống microservices với Docker Compose và Kubernetes trên nhiều môi trường"
                        stepCount={8}
                        onOpen={() => {}}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>,
        ),
}
