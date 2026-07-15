import type { Meta, StoryObj } from "@storybook/nextjs"

import { UserAvatar } from "./index"

const meta: Meta<typeof UserAvatar> = {
    title: "Core/Identity/UserAvatar",
    component: UserAvatar,
}

export default meta

type Story = StoryObj<typeof UserAvatar>

/** Chuỗi fallback bền: ảnh upload → avatar sinh tự động (DiceBear, seed theo danh tính) → 2 chữ cái đầu. Không có `avatar` → hiện avatar sinh theo `seed`/username. */
export const Default: Story = {
    parameters: { usage: "Fallback bền: ảnh upload → avatar sinh (DiceBear, seed theo danh tính) → chữ cái đầu. Cùng seed → cùng mặt ở mọi nơi." },
    args: { username: "Trần Bình", seed: "tranbinh@example.com" },
}

/** 3 preset kích thước — chọn theo bối cảnh: `sm` hàng list dày, `md` mặc định, `lg` header hồ sơ. */
export const Sizes: Story = {
    parameters: { usage: "3 preset size: sm (list dày) · md (mặc định) · lg (header hồ sơ)." },
    render: () => (
        <div className="flex items-center gap-4">
            <UserAvatar username="An" seed="an@example.com" size="sm" />
            <UserAvatar username="Bình" seed="binh@example.com" size="md" />
            <UserAvatar username="Cường" seed="cuong@example.com" size="lg" />
        </div>
    ),
}
