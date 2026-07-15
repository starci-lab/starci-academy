import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { RocketLaunchIcon } from "@phosphor-icons/react"
import { HeroBanner } from "./index"

const meta: Meta<typeof HeroBanner> = {
    title: "Blocks/Marketing/HeroBanner",
    component: HeroBanner,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof HeroBanner>

/** Dùng làm hero mở đầu trang landing khi chưa có ảnh minh hoạ — bố cục một cột căn giữa, tập trung vào thông điệp. */
export const Default: Story = {
    parameters: { usage: "Dùng làm hero mở đầu trang landing khi chưa có ảnh minh hoạ — bố cục một cột căn giữa, tập trung vào thông điệp." },
    render: () => (
        <HeroBanner
            eyebrow="Dành cho lập trình viên Fullstack"
            eyebrowIcon={<RocketLaunchIcon size={16} weight="fill" />}
            headline="Luyện phỏng vấn thật, không lý thuyết suông"
            subline={"Học qua project thật, chấm bài bằng AI, phỏng vấn giả lập sát với thị trường tuyển dụng."}
            primary={<Button variant="primary">Bắt đầu học thử</Button>}
            secondary={<Button variant="tertiary">Xem lộ trình</Button>}
        />
    ),
}

/** Dùng khi trang có sẵn ảnh/minh hoạ trực quan (mascot, mockup) để bố cục chuyển sang hai cột — chữ bên trái, ảnh bên phải. */
export const WithVisual: Story = {
    parameters: { usage: "Dùng khi trang có sẵn ảnh/minh hoạ trực quan (mascot, mockup) để bố cục chuyển sang hai cột — chữ bên trái, ảnh bên phải." },
    render: () => (
        <HeroBanner
            eyebrow="Dành cho lập trình viên Fullstack"
            eyebrowIcon={<RocketLaunchIcon size={16} weight="fill" />}
            headline="Luyện phỏng vấn thật, không lý thuyết suông"
            subline={"Học qua project thật, chấm bài bằng AI, phỏng vấn giả lập sát với thị trường tuyển dụng."}
            primary={<Button variant="primary">Bắt đầu học thử</Button>}
            secondary={<Button variant="tertiary">Xem lộ trình</Button>}
            visual={
                <img
                    src="https://placehold.co/480x360/png"
                    alt="Minh hoạ lộ trình học Fullstack"
                    className="w-full max-w-md"
                />
            }
        />
    ),
}

/** Dùng khi muốn khoe nhanh các công nghệ/ngôn ngữ được hỗ trợ ngay dưới nút CTA, mỗi từ khoá mang màu thương hiệu riêng. */
export const WithKeywordStrip: Story = {
    parameters: { usage: "Dùng khi muốn khoe nhanh các công nghệ/ngôn ngữ được hỗ trợ ngay dưới nút CTA, mỗi từ khoá mang màu thương hiệu riêng." },
    render: () => (
        <HeroBanner
            eyebrow="Dành cho lập trình viên Fullstack"
            eyebrowIcon={<RocketLaunchIcon size={16} weight="fill" />}
            headline="Luyện phỏng vấn thật, không lý thuyết suông"
            subline={"Học qua project thật, chấm bài bằng AI, phỏng vấn giả lập sát với thị trường tuyển dụng."}
            primary={<Button variant="primary">Bắt đầu học thử</Button>}
            secondary={<Button variant="tertiary">Xem lộ trình</Button>}
            keywordsLabel="Giải bài bằng"
            keywords={[
                { label: "TypeScript", className: "bg-[#3178c6]/10 text-[#3178c6]" },
                { label: "Go", className: "bg-[#00add8]/10 text-[#00add8]" },
                { label: "Java", className: "bg-[#e76f00]/10 text-[#e76f00]" },
                { label: "C#", className: "bg-[#9b4f96]/10 text-[#9b4f96]" },
            ]}
        />
    ),
}
