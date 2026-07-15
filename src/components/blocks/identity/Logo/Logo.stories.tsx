import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { Logo } from "./index"

const meta: Meta<typeof Logo> = {
    title: "Blocks/Identity/Logo",
    component: Logo,
}
export default meta
type Story = StoryObj<typeof Logo>

/** Dùng `Logo` khi cần đúng dấu hiệu thương hiệu trần và tự quyết chiều cao — thay vì `BrandLogo` (điểm vào dùng chung, đã chốt sẵn `h-9`) hoặc `BrandLockup` (dấu hiệu kèm chữ "StarCi Academy", dành cho navbar và footer). Trong app hiện chỉ `BrandLogo` gọi thẳng `Logo`; bề mặt sản phẩm nên đi qua hai block kia để cả app đọc một mark từ một nguồn. */
export const Sizes: Story = {
    parameters: { usage: "Dùng `Logo` khi cần đúng dấu hiệu thương hiệu trần và tự quyết chiều cao — thay vì `BrandLogo` (điểm vào dùng chung, đã chốt sẵn `h-9`) hoặc `BrandLockup` (dấu hiệu kèm chữ \"StarCi Academy\", dành cho navbar và footer). Trong app hiện chỉ `BrandLogo` gọi thẳng `Logo`; bề mặt sản phẩm nên đi qua hai block kia để cả app đọc một mark từ một nguồn. Không có prop `size`: truyền chiều cao qua className, chiều rộng tự theo." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>h-9 — mặc định của BrandLogo</Label>
                    <Typography type="body-sm" color="muted">
                        Cỡ nhận được khi gọi BrandLogo mà không truyền gì. Cần một mark đứng riêng ở mật độ
                        thường thì lấy cỡ này, đừng tự chọn số khác.
                    </Typography>
                </div>
                <Logo className="h-9" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>h-10 — trong BrandLockup</Label>
                    <Typography type="body-sm" color="muted">
                        Cỡ lockup dùng để mark cân với chữ StarCi Academy đứng cạnh. Chỉ đúng khi có chữ đi
                        kèm; mark đứng một mình ở cỡ này sẽ nhỉnh hơn nhịp của navbar.
                    </Typography>
                </div>
                <Logo className="h-10" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>h-14 — màn splash</Label>
                    <Typography type="body-sm" color="muted">
                        Cỡ cho bề mặt mà mark là thứ duy nhất trên màn: splash lúc mở app. Đừng mang cỡ này
                        vào trang có nội dung, nó sẽ tranh vai với tiêu đề.
                    </Typography>
                </div>
                <Logo className="h-14" />
            </div>
        </div>
    ),
}

/** Đặt trên nền tối để kiểm chứng mark vẫn nổi rõ vì màu hồng thương hiệu là màu cố định, không đổi theo theme. */
export const OnDarkSurface: Story = {
    parameters: { usage: "Đặt trên nền tối để kiểm chứng mark vẫn nổi rõ vì màu hồng thương hiệu là màu cố định, không đổi theo theme." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Trên nền tối</Label>
                <Typography type="body-sm" color="muted">
                    Tra story này trước khi đặt mark lên nền tự chọn. Màu hồng là hằng số trong SVG, không
                    đọc token nên không đảo theo theme — nền nào cũng phải tự kiểm tương phản, kể cả nền sáng
                    có tông hồng.
                </Typography>
            </div>
            <div className="flex w-fit items-center rounded-lg bg-neutral-950 p-8">
                <Logo className="h-10" />
            </div>
        </div>
    ),
}
