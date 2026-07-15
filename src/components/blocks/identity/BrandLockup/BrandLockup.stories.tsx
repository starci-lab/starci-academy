import type { Meta, StoryObj } from "@storybook/nextjs"
import { BrandLockup } from "./index"

const meta: Meta<typeof BrandLockup> = {
    title: "Blocks/BrandLockup",
    component: BrandLockup,
}
export default meta
type Story = StoryObj<typeof BrandLockup>

/** Dùng làm mặc định ở navbar/footer khi hiển thị đủ icon và wordmark "StarCi Academy". */
export const Default: Story = {
    parameters: { usage: "Dùng làm mặc định ở navbar/footer khi hiển thị đủ icon và wordmark \"StarCi Academy\"." },
    render: () => <BrandLockup />,
}

/** Dùng trong header trên màn hình di động, nơi bề ngang chật nên wordmark tự ẩn, chỉ còn icon. */
export const IconOnlyTrenDiDong: Story = {
    parameters: { usage: "Dùng trong header trên màn hình di động, nơi bề ngang chật nên wordmark tự ẩn, chỉ còn icon." },
    render: () => (
        <div className="w-16 border border-dashed border-muted p-2">
            <BrandLockup />
        </div>
    ),
}

/** Dùng khi cần neo mark vào một cạnh cụ thể (ví dụ `self-start`) bên trong flex-col cha đang stretch. */
export const CanChinhViTri: Story = {
    parameters: { usage: "Dùng khi cần neo mark vào một cạnh cụ thể (ví dụ `self-start`) bên trong flex-col cha đang stretch." },
    render: () => (
        <div className="flex w-64 flex-col items-stretch gap-2 border border-dashed border-muted p-4">
            <BrandLockup className="self-start" />
        </div>
    ),
}

/** Dùng ở footer trên nền tối, nơi mark cần nổi rõ trên background sẫm màu. */
export const TrenNenToi: Story = {
    parameters: { usage: "Dùng ở footer trên nền tối, nơi mark cần nổi rõ trên background sẫm màu." },
    render: () => (
        <div className="bg-background-inverse rounded-md p-6 dark">
            <BrandLockup />
        </div>
    ),
}
