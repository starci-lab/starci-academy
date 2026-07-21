import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { ArrowRightIcon, CubeIcon, RocketLaunchIcon } from "@phosphor-icons/react"

import { HeroBanner } from "@/components/blocks/marketing/HeroBanner"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof HeroBanner> = {
    title: "Legacy/Blocks/Marketing/HeroBanner",
    component: HeroBanner,
}

export default meta

type Story = StoryObj<typeof HeroBanner>

const languageKeywords = [
    { label: "TypeScript", className: "bg-[#3178C6]/10 text-[#3178C6]" },
    { label: "Java", className: "bg-[#E76F00]/10 text-[#E76F00]" },
    { label: "C#", className: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
    { label: "Go", className: "bg-[#00ADD8]/10 text-[#00ADD8]" },
]

/** Ô placeholder cho prop `visual` — đứng thay cho một hình minh hoạ thật (sơ đồ, ảnh, 3D scene) trong story. */
const VisualPlaceholder = ({ caption }: { caption: string }) => (
    <div className="flex aspect-square w-full max-w-md flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-default bg-accent-soft/40 p-8">
        <RocketLaunchIcon aria-hidden focusable="false" className="size-10 text-accent-soft-foreground" />
        <Typography type="body-sm" color="muted" align="center">
            {caption}
        </Typography>
    </div>
)

/**
 * Toàn bộ ma trận trạng thái của `HeroBanner` trong một Gallery: layout căn giữa
 * (không có visual) làm mặc định, layout chia đôi khi có visual, chỉ một CTA
 * chính, dải từ khóa không có nhãn dẫn, chip eyebrow không icon, và headline dài
 * để soi hành vi `max-w-4xl` khi bọc dòng.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Xem tất cả trạng thái prop của HeroBanner cạnh nhau trước khi ghép vào trang landing — chọn đúng tổ hợp visual/secondary/keywords cho từng banner mở đầu.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Căn giữa — không có visual"
                hint="Bỏ prop visual khi banner không có hình minh hoạ thật để dùng — hero giữ layout một cột căn giữa, tránh bịa ảnh không có thật."
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
            </Variant>
            <Variant
                label="Chia đôi — có visual"
                hint="Truyền prop visual (sơ đồ, ảnh, 3D scene) để hero chuyển sang layout chia đôi: cột chữ căn trái bên trái, visual bên phải — xếp chồng trên mobile."
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
            </Variant>
            <Variant
                label="Chỉ một CTA chính"
                hint="Bỏ prop secondary khi banner chỉ cần một hành động duy nhất — ví dụ trang chờ ra mắt chỉ có một lối đi tiếp."
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
            </Variant>
            <Variant
                label="Từ khóa không có nhãn dẫn"
                hint="Bỏ keywordsLabel khi dải từ khóa đã đủ tự giải thích — chip màu thương hiệu vẫn hiện, chỉ thiếu dòng chữ mờ phía trước."
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
            </Variant>
            <Variant
                label="Headline dài"
                hint="Headline dài để soi max-w-4xl bọc dòng đúng cách, không tràn hay bể layout ở cột chữ."
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
            </Variant>
        </Gallery>
    ),
}
