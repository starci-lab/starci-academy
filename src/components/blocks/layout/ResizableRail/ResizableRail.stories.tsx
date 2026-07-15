import type { Meta, StoryObj } from "@storybook/nextjs"
import { ResizableRail } from "./index"

const meta: Meta<typeof ResizableRail> = {
    title: "Blocks/Layout/ResizableRail",
    component: ResizableRail,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ResizableRail>

const railBody = (
    <nav className="h-full overflow-y-auto p-4 text-sm">
        <p className="mb-2 font-semibold">Mục lục khoá học</p>
        <ul className="space-y-1 text-muted">
            <li>1. Giới thiệu</li>
            <li>2. Cài đặt môi trường</li>
            <li>3. Component cơ bản</li>
            <li>4. Quản lý trạng thái</li>
            <li>5. Kết nối API</li>
        </ul>
    </nav>
)

/** Dùng cho rail điều hướng bên cạnh (ví dụ mục lục khoá học) mà người đọc có thể kéo giãn theo ý muốn, chiều rộng được nhớ lại ở lần sau. */
export const Default: Story = {
    parameters: { usage: "Dùng cho rail điều hướng bên cạnh (ví dụ mục lục khoá học) mà người đọc có thể kéo giãn theo ý muốn, chiều rộng được nhớ lại ở lần sau." },
    render: () => (
        <div className="relative h-96 border border-separator">
            <ResizableRail storageKey="storybook-rail-default" ariaLabel="Kéo để đổi chiều rộng mục lục">
                {railBody}
            </ResizableRail>
        </div>
    ),
}

/** Dùng khi rail cần đặt trong một shell có chiều cao giới hạn, để kiểm tra nội dung dài cuộn được bên trong rail thay vì đẩy vỡ layout. */
export const ScrollableContent: Story = {
    parameters: { usage: "Dùng khi rail cần đặt trong một shell có chiều cao giới hạn, để kiểm tra nội dung dài cuộn được bên trong rail thay vì đẩy vỡ layout." },
    render: () => (
        <div className="relative h-64 border border-separator">
            <ResizableRail storageKey="storybook-rail-scroll" ariaLabel="Kéo để đổi chiều rộng mục lục">
                <nav className="h-full overflow-y-auto p-4 text-sm">
                    <p className="mb-2 font-semibold">Mục lục khoá học</p>
                    <ul className="space-y-1 text-muted">
                        {Array.from({ length: 20 }, (_, index) => (
                            <li key={index}>{`${index + 1}. Chương học số ${index + 1}`}</li>
                        ))}
                    </ul>
                </nav>
            </ResizableRail>
        </div>
    ),
}
