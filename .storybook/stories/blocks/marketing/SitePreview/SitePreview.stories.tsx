import type { Meta, StoryObj } from "@storybook/nextjs"
import { SitePreview } from "./SitePreview"
import { ShowcaseMockup } from "../ShowcaseMockup/ShowcaseMockup"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof SitePreview> = {
    title: "Block/Marketing/SitePreview",
    component: SitePreview,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SitePreview>

const ANATOMY = {
    primitives: [
        { name: "ShowcaseMockup", role: "khung cửa sổ trình duyệt bọc preview (bối cảnh thật)" },
    ],
    reason:
        "Nội dung minh hoạ cố định (nav + sidebar lọc + list khoá) để nhét vào ShowcaseMockup — cho thấy sản phẩm trông thế nào mà không cần ảnh chụp thật. Tự lấp đầy chiều cao cha nên phải bọc trong khung có chiều cao xác định.",
}

export const Standalone: Story = {
    render: () =>
        blockShell(
            <div className="h-[360px] w-full max-w-3xl overflow-hidden rounded-3xl border border-default">
                <SitePreview />
            </div>,
            ANATOMY,
        ),
}

export const InShowcaseMockup: Story = {
    render: () =>
        blockShell(
            <ShowcaseMockup url="starci.vn/khoa-hoc" aspect="video" className="max-w-3xl">
                <SitePreview />
            </ShowcaseMockup>,
            ANATOMY,
        ),
}
