import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { ArrowRightIcon, CubeIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { HeroBanner } from "./HeroBanner"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the landing-page opening hero: eyebrow + headline + subline + CTA
 * slot(s) + optional brand keyword strip + optional split visual. One composition
 * with variable slots (secondary CTA · keywords · visual).
 *
 * ANATOMY IS PER-LEAF: each scenario below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof HeroBanner> = {
    title: "Design/Marketing/HeroBanner",
    component: HeroBanner,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HeroBanner>

/** Frame each leaf's anatomy panel with breathing room (hero is fullscreen). */
const frame = (node: React.ReactNode) => <div className="p-8">{node}</div>

const languageKeywords = [
    { label: "TypeScript", className: "bg-[#3178C6]/10 text-[#3178C6]" },
    { label: "Java", className: "bg-[#E76F00]/10 text-[#E76F00]" },
    { label: "C#", className: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
    { label: "Go", className: "bg-[#00ADD8]/10 text-[#00ADD8]" },
]

/** Placeholder standing in for a real `visual` (diagram / image / 3D scene). */
const VisualPlaceholder = ({ caption }: { caption: string }) => (
    <div className="flex aspect-square w-full max-w-md flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-default bg-accent-soft/40 p-8">
        <RocketLaunchIcon aria-hidden focusable="false" className="size-10 text-accent-soft-foreground" />
        <Typography type="body-sm" color="muted" align="center">
            {caption}
        </Typography>
    </div>
)

// Centered leaf: eyebrow + headline + subline + ONE primary CTA (no secondary, no keywords, no visual).
const CENTERED_PARTS: Array<AnatomyNode> = [
    { name: "StatusChip", tier: "design", role: "eyebrow gate (tone accent)" },
    { name: "Typography.Heading", tier: "primitive", role: "headline level-1 (max-w-4xl)" },
    { name: "Typography", tier: "primitive", role: "subline định vị (muted)" },
    { name: "Button", tier: "primitive", role: "CTA chính (truyền qua slot)" },
]

// Split leaf: adds a secondary CTA + a `visual` slot → two-column layout.
const SPLIT_PARTS: Array<AnatomyNode> = [
    { name: "StatusChip", tier: "design", role: "eyebrow gate (tone accent)" },
    { name: "Typography.Heading", tier: "primitive", role: "headline level-1, căn trái" },
    { name: "Typography", tier: "primitive", role: "subline định vị (muted)" },
    { name: "Button", tier: "primitive", role: "CTA chính + phụ (2 nút qua slot)" },
    { name: "VisualPlaceholder", tier: "primitive", role: "cột visual (slot) → bật layout chia đôi", state: "split" },
]

// Keywords leaf: centered + a brand-tinted keyword strip under the CTA (no label, no secondary).
const KEYWORDS_PARTS: Array<AnatomyNode> = [
    { name: "StatusChip", tier: "design", role: "eyebrow gate (tone accent)" },
    { name: "Typography.Heading", tier: "primitive", role: "headline level-1 (max-w-4xl)" },
    { name: "Typography", tier: "primitive", role: "subline định vị (muted)" },
    { name: "Button", tier: "primitive", role: "CTA chính (truyền qua slot)" },
    { name: "Chip", tier: "primitive", role: "dải keyword màu thương hiệu (bg/10 + text)" },
]

// Full leaf: secondary CTA + keyword strip WITH a muted label (every slot occupied).
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "StatusChip", tier: "design", role: "eyebrow gate (tone accent)" },
    { name: "Typography.Heading", tier: "primitive", role: "headline level-1 dài (max-w-4xl)" },
    { name: "Typography", tier: "primitive", role: "subline định vị (muted)" },
    { name: "Button", tier: "primitive", role: "CTA chính + phụ (2 nút qua slot)" },
    { name: "Chip", tier: "primitive", role: "dải keyword màu thương hiệu + label muted đứng trước" },
]

export const CenteredNoVisual: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="HeroBanner"
                tier="design"
                leaf="Căn giữa, không ảnh"
                parts={CENTERED_PARTS}
                reason="Màn mở đầu landing gói eyebrow + headline + subline + CTA + dải ngôn ngữ vào một block. `visual` bật layout chia đôi; không có visual thì giữ một cột căn giữa (không bịa ảnh). Feature chỉ truyền chữ và Button đã cấu hình."
            >
                <HeroBanner
                    eyebrow="Học lập trình thực chiến"
                    eyebrowIcon={<CubeIcon aria-hidden focusable="false" className="size-3" />}
                    headline="Trở thành kỹ sư phần mềm sẵn sàng đi làm"
                    subline="Từ nền tảng đến dự án thực tế, mỗi khóa học gắn với một sản phẩm bạn cầm được trên tay."
                    primary={
                        <Button variant="primary" size="lg">
                            Xem các khóa học
                            <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                        </Button>
                    }
                />
            </BlockAnatomy>,
        ),
}

export const SplitWithVisual: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="HeroBanner"
                tier="design"
                leaf="Chia đôi có ảnh"
                parts={SPLIT_PARTS}
                note="`visual` có mặt → layout chia đôi (chữ trái, ảnh phải) + thêm CTA phụ; composition khác leaf căn-giữa."
            >
                <HeroBanner
                    eyebrow="System Design Mastery"
                    eyebrowIcon={<CubeIcon aria-hidden focusable="false" className="size-3" />}
                    headline="Thiết kế hệ thống chịu được triệu người dùng"
                    subline="Học qua kiến trúc backend thật của StarCi — không phải sơ đồ vẽ trên giấy."
                    primary={
                        <Button variant="primary" size="lg">
                            Bắt đầu học
                            <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                        </Button>
                    }
                    secondary={
                        <Button variant="secondary" size="lg">
                            Xem chương trình học
                        </Button>
                    }
                    visual={<VisualPlaceholder caption="Sơ đồ kiến trúc backend StarCi (placeholder)" />}
                />
            </BlockAnatomy>,
        ),
}

export const PrimaryCtaOnly: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="HeroBanner"
                tier="design"
                leaf="Chỉ CTA chính"
                parts={CENTERED_PARTS}
                note="Không icon eyebrow, không CTA phụ — CÙNG composition với leaf căn-giữa (chỉ khác nội dung)."
            >
                <HeroBanner
                    eyebrow="Sắp ra mắt"
                    headline="Khóa AI Engineering đang được hoàn thiện"
                    subline="Đăng ký để nhận thông báo ngay khi khóa học mở đăng ký sớm."
                    primary={
                        <Button variant="primary" size="lg">
                            Đăng ký nhận tin
                        </Button>
                    }
                />
            </BlockAnatomy>,
        ),
}

export const KeywordsNoLabel: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="HeroBanner"
                tier="design"
                leaf="Dải keyword"
                parts={KEYWORDS_PARTS}
                note="Thêm dải Chip màu thương hiệu dưới CTA (không label) → composition có thêm phần keyword."
            >
                <HeroBanner
                    eyebrow="Fullstack Mastery"
                    headline="Chấm bài bằng AI trên đúng ngôn ngữ bạn chọn"
                    subline="Nộp bài bằng bất kỳ ngôn ngữ nào trong danh sách, AI chấm điểm và phản hồi ngay."
                    primary={
                        <Button variant="primary" size="lg">
                            Xem lộ trình
                        </Button>
                    }
                    keywords={languageKeywords}
                />
            </BlockAnatomy>,
        ),
}

export const LongHeadline: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="HeroBanner"
                tier="design"
                leaf="Headline dài + đủ slot"
                parts={FULL_PARTS}
                note="Headline dài xuống dòng + CTA phụ + dải keyword CÓ label — mọi slot lấp đầy trong một cột căn giữa."
            >
                <HeroBanner
                    eyebrow="DevOps Mastery"
                    eyebrowIcon={<CubeIcon aria-hidden focusable="false" className="size-3" />}
                    headline="Tự tay dựng pipeline CI/CD, container hóa và vận hành hệ thống trên nhiều cloud thật"
                    subline="Không học lý thuyết suông — mọi bài lab đều triển khai trên hạ tầng thật, có log và metric thật để soi."
                    primary={
                        <Button variant="primary" size="lg">
                            Vào khóa DevOps
                            <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                        </Button>
                    }
                    secondary={
                        <Button variant="secondary" size="lg">
                            Xem lịch khai giảng
                        </Button>
                    }
                    keywordsLabel="Triển khai trên"
                    keywords={[
                        { label: "AWS", className: "bg-[#FF9900]/10 text-[#FF9900]" },
                        { label: "GCP", className: "bg-[#4285F4]/10 text-[#4285F4]" },
                        { label: "Azure", className: "bg-[#0078D4]/10 text-[#0078D4]" },
                    ]}
                />
            </BlockAnatomy>,
        ),
}
