import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { ArrowRightIcon, CubeIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { HeroBanner } from "./HeroBanner"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof HeroBanner> = {
    title: "Block/Marketing/HeroBanner",
    component: HeroBanner,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HeroBanner>

const ANATOMY = {
    primitives: [
        { name: "Chip", role: "eyebrow gate + dải keyword màu thương hiệu" },
        { name: "Typography.Heading", role: "headline level-1 (max-w-4xl)" },
        { name: "Button", role: "CTA chính + phụ (truyền qua slot)" },
    ],
    reason:
        "Màn mở đầu landing gói eyebrow + headline + subline + CTA + dải ngôn ngữ vào một block. `visual` bật layout chia đôi; không có visual thì giữ một cột căn giữa (không bịa ảnh). Feature chỉ truyền chữ và Button đã cấu hình.",
}

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

export const CenteredNoVisual: Story = {
    render: () =>
        blockShell(
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
            />,
            ANATOMY,
        ),
}

export const SplitWithVisual: Story = {
    render: () =>
        blockShell(
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
            />,
            ANATOMY,
        ),
}

export const PrimaryCtaOnly: Story = {
    render: () =>
        blockShell(
            <HeroBanner
                eyebrow="Sắp ra mắt"
                headline="Khóa AI Engineering đang được hoàn thiện"
                subline="Đăng ký để nhận thông báo ngay khi khóa học mở đăng ký sớm."
                primary={
                    <Button variant="primary" size="lg">
                        Đăng ký nhận tin
                    </Button>
                }
            />,
            ANATOMY,
        ),
}

export const KeywordsNoLabel: Story = {
    render: () =>
        blockShell(
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
            />,
            ANATOMY,
        ),
}

export const LongHeadline: Story = {
    render: () =>
        blockShell(
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
            />,
            ANATOMY,
        ),
}
