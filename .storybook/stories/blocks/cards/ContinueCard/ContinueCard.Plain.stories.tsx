import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "./ContinueCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the `plain` variant of ContinueCard: SAME content (eyebrow · title ·
 * subtitle/meta · ProgressMeter · cta) as `item`/`hero`, but with NO SectionCard/
 * HighlightCard chrome. Used as a page SPINE (e.g. top of a "continue learning"
 * surface) where the page shell already provides the frame — this replaces
 * hand-rolled one-off panels (e.g. `ContinuePanel`) that duplicated this shape.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ContinueCard> = {
    title: "Design/Cards/ContinueCard/Plain",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

/** Plain canvas — a rounded/bordered shell around the card ONLY to show story bounds; the card itself has no frame. */
const shell = (node: React.ReactNode) => <div className="rounded-2xl border p-8">{node}</div>

// scenario base = có tiến độ, CTA "Tiếp tục". No SectionCard/HighlightCard wrapper —
// DOM thật: bare div (root) ⊃ eyebrow · title · MetaRow(chip) · Button chip CTA · ProgressMeter.
const progressBase = {
    variant: "plain" as const,
    title: "Building a RESTful API with NestJS",
    meta: ["Module 3", "Lesson 5"],
    ctaLabel: "Tiếp tục",
    onPress: () => {},
    showAnatomy: true,
}

const CONTENT_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Title", tier: "primitive", role: "tên mục đang tiếp tục (title, weight medium, truncate)" },
    {
        name: "MetaRow",
        tier: "primitive",
        role: "hàng meta muted nối bằng dấu chấm (module · bài học)",
    },
    { name: "Button", tier: "primitive", role: "CTA chip (onPress + icon ArrowRight) — cùng kiểu hero, không watermark icon, không vành accent" },
    { name: "ProgressMeter", tier: "primitive", role: "thanh tiến độ" },
]

const EYEBROW_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Eyebrow", tier: "primitive", role: "nhãn nhỏ muted phía trên tiêu đề ('Tiếp tục học')" },
    { name: "Typography.Title", tier: "primitive", role: "tên mục đang tiếp tục" },
    { name: "Typography.Subtitle", tier: "primitive", role: "phụ đề muted (không có meta/timeLeft)" },
    { name: "Button", tier: "primitive", role: "CTA chip" },
    { name: "ProgressMeter", tier: "primitive", role: "thanh tiến độ" },
]

const NO_CTA_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Title", tier: "primitive", role: "tên mục — đã hoàn thành" },
    { name: "MetaRow", tier: "primitive", role: "hàng meta muted" },
    { name: "ProgressMeter", tier: "primitive", role: "thanh tiến độ đầy 100% — KHÔNG có CTA vì hết bài để tiếp tục" },
]

/** STATE có tiến độ — spine "tiếp tục học" phẳng, không khung, CTA chip. */
export const Progress: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Progress"
                parts={CONTENT_PARTS}
                reason={"Biến thể 'plain' — cùng nội dung với item/hero nhưng KHÔNG SectionCard/HighlightCard, dùng làm spine phẳng đầu trang (thay ContinuePanel hand-roll). CTA vẫn là chip Button trên hàng riêng, không gộp vào tiêu đề."}
            >
                <div className="w-96">
                    <ContinueCard {...progressBase} value={3} max={8} />
                </div>
            </BlockAnatomy>,
        ),
}

/** STATE eyebrow — nhãn nhỏ muted phía trên tiêu đề, dùng subtitle thay meta. */
export const Eyebrow: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Eyebrow"
                parts={EYEBROW_PARTS}
                note={"Prop `eyebrow` render Typography muted body-xs NGAY TRÊN tiêu đề — dùng khi spine cần một nhãn ngữ cảnh (vd 'Tiếp tục học') trước tên mục."}
            >
                <div className="w-96">
                    <ContinueCard
                        variant="plain"
                        eyebrow="Tiếp tục học"
                        title="Rate limiter: Token bucket"
                        subtitle="System Design · Module 7"
                        ctaLabel="Tiếp tục"
                        onPress={() => {}}
                        value={5}
                        max={10}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** STATE no-cta — hết bài để tiếp tục: meter đầy 100%, KHÔNG CTA (không gì để "tiếp tục" nữa). */
export const NoCta: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="NoCta"
                parts={NO_CTA_PARTS}
                note="Không truyền `ctaLabel` → ctaNode = null, không render hàng CTA. Progress đầy 100% xác nhận đã hoàn thành, không phải lỗi thiếu dữ liệu."
            >
                <div className="w-96">
                    <ContinueCard
                        variant="plain"
                        title="Building a RESTful API with NestJS"
                        meta={["Module 3", "Hoàn thành"]}
                        value={8}
                        max={8}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>,
        ),
}
