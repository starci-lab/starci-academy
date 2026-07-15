import type { Meta, StoryObj } from "@storybook/nextjs"
import { ShowcaseMockup, SHOWCASE_THEMES } from "./index"

const meta: Meta<typeof ShowcaseMockup> = {
    title: "Blocks/Marketing/ShowcaseMockup",
    component: ShowcaseMockup,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ShowcaseMockup>

const DemoContent = () => (
    <div className="flex h-64 w-full max-w-md flex-col gap-3 bg-surface p-6">
        <div className="h-4 w-1/2 rounded bg-default/40" />
        <div className="h-3 w-full rounded bg-default/20" />
        <div className="h-3 w-5/6 rounded bg-default/20" />
        <div className="mt-4 h-24 w-full rounded-xl bg-default/10" />
    </div>
)

/** Dùng làm khung mặc định cho khu vực hero khi cần giới thiệu sản phẩm bằng một cửa sổ trình duyệt cách điệu. */
export const Default: Story = {
    parameters: { usage: "Dùng làm khung mặc định cho khu vực hero khi cần giới thiệu sản phẩm bằng một cửa sổ trình duyệt cách điệu." },
    render: () => (
        <ShowcaseMockup url="app.starci.vn/khoa-hoc" className="w-[480px]">
            <DemoContent />
        </ShowcaseMockup>
    ),
}

/** So sánh cạnh nhau các lớp nền trang trí (bộ màu thương hiệu StarCi và nền lưới kỹ thuật) khi cần chọn phong cách bối cảnh phù hợp cho mockup hero. */
export const Backdrops: Story = {
    parameters: { usage: "So sánh cạnh nhau các lớp nền trang trí (bộ màu thương hiệu StarCi và nền lưới kỹ thuật) để chọn phong cách bối cảnh phù hợp cho mockup hero." },
    render: () => (
        <div className="flex flex-wrap items-start gap-12">
            <div className="flex flex-col gap-3">
                <span className="text-xs text-muted">Bộ màu StarCi (hồng · cam · xanh lá)</span>
                <ShowcaseMockup url="app.starci.vn/lo-trinh" theme={SHOWCASE_THEMES.starci} tilt="right" className="w-[360px]">
                    <DemoContent />
                </ShowcaseMockup>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-xs text-muted">Nền lưới kỹ thuật</span>
                <ShowcaseMockup url="app.starci.vn/tinh-nang" backdrop="grid" tilt="left" className="w-[360px]">
                    <DemoContent />
                </ShowcaseMockup>
            </div>
        </div>
    ),
}

/** Khoá tỉ lệ nội dung 16:9 khi mockup cần mô phỏng nguyên một trang web đầy đủ thay vì một mảng nội dung tự do. */
export const FullWebsitePreview: Story = {
    parameters: { usage: "Khoá tỉ lệ nội dung 16:9 khi mockup cần mô phỏng nguyên một trang web đầy đủ thay vì một mảng nội dung tự do." },
    render: () => (
        <ShowcaseMockup url="app.starci.vn/demo" theme={SHOWCASE_THEMES.aqua} aspect="video" tilt="none" className="w-[520px]">
            <div className="flex h-full w-full items-center justify-center bg-surface">
                <div className="h-8 w-40 rounded bg-default/30" />
            </div>
        </ShowcaseMockup>
    ),
}

/** Ẩn thanh địa chỉ (chỉ còn 3 chấm màu) và đổi lớp nền sang hiệu ứng sao khi mockup cần trông tối giản, ít giống trình duyệt thật hơn. */
export const WithoutAddressBar: Story = {
    parameters: { usage: "Ẩn thanh địa chỉ (chỉ còn 3 chấm màu) và đổi lớp nền sang hiệu ứng sao khi mockup cần trông tối giản, ít giống trình duyệt thật hơn." },
    render: () => (
        <ShowcaseMockup backdrop="stars" className="w-[480px]">
            <DemoContent />
        </ShowcaseMockup>
    ),
}
