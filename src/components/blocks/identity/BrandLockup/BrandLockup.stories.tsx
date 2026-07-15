import type { Meta, StoryObj } from "@storybook/nextjs"
import { BrandLockup } from "./index"

const meta: Meta<typeof BrandLockup> = {
    title: "Blocks/Identity/BrandLockup",
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
