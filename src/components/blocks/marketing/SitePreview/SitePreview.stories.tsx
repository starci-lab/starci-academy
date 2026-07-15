import type { Meta, StoryObj } from "@storybook/nextjs"
import { SitePreview } from "./index"

const meta: Meta<typeof SitePreview> = {
    title: "Blocks/Marketing/SitePreview",
    component: SitePreview,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof SitePreview>

/** Dùng làm ảnh minh hoạ trong khối marketing dạng `ShowcaseMockup aspect="video"`, lấp đầy toàn bộ khung. */
export const Default: Story = {
    parameters: { usage: "Dùng làm ảnh minh hoạ trong khối marketing dạng `ShowcaseMockup aspect=\"video\"`, lấp đầy toàn bộ khung." },
    render: () => (
        <div className="h-[360px] w-[560px] overflow-hidden rounded-2xl border border-default shadow-lg">
            <SitePreview />
        </div>
    ),
}

/** Thu nhỏ xuống bề rộng mobile để xác nhận sidebar bộ lọc tự ẩn (breakpoint `sm`) và list khoá vẫn đọc được. */
export const MobileCollapsed: Story = {
    parameters: { usage: "Thu nhỏ xuống bề rộng mobile để xác nhận sidebar bộ lọc tự ẩn (breakpoint `sm`) và list khoá vẫn đọc được." },
    render: () => (
        <div className="h-[420px] w-[320px] overflow-hidden rounded-2xl border border-default shadow-lg">
            <SitePreview />
        </div>
    ),
}
