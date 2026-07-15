import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ReactionBar } from "./index"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

const meta: Meta<typeof ReactionBar> = {
    title: "Blocks/Feed/ReactionBar",
    component: ReactionBar,
}
export default meta
type Story = StoryObj<typeof ReactionBar>

/**
 * Vai của block, giống nhau ở mọi story — quyền react do caller quyết bằng việc truyền hay
 * bỏ `onReact`; từng story mô tả riêng state của mình qua Label + description.
 */
const usage = "Thanh cảm xúc gắn dưới một nội dung cộng đồng (bài đăng, bình luận, hoạt động trong feed): hiện tổng số react và cho viewer thả hoặc gỡ cảm xúc của mình. Quyền react do caller quyết bằng cách truyền hay bỏ onReact, không có prop readOnly riêng."

/** Wrapper sở hữu state cục bộ, mô phỏng việc chọn/gỡ cảm xúc như trong luồng thực tế. */
const Controlled = ({
    initialCount,
    initialReaction,
}: {
    initialCount: number
    initialReaction: ReactionType | null
}) => {
    const [count, setCount] = useState(initialCount)
    const [myReaction, setMyReaction] = useState<ReactionType | null>(initialReaction)

    return (
        <ReactionBar
            count={count}
            myReaction={myReaction}
            onReact={(type) => {
                setCount((previous) => previous + (type ? (myReaction ? 0 : 1) : -1))
                setMyReaction(type)
            }}
        />
    )
}

/** Dùng cho một bài đăng chưa có tương tác nào, viewer có thể mở picker để react lần đầu. */
export const Default: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Chưa ai react và viewer được phép react: chỉ còn nút mở picker, không có số đếm.
                </Typography>
            </div>
            <Controlled initialCount={0} initialReaction={null} />
        </div>
    ),
}

/** Dùng khi viewer đã react bằng một cảm xúc cụ thể, trigger hiển thị đúng emoji đã chọn. */
export const MyReactionSelected: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Viewer đã react</Label>
                <Typography type="body-sm" color="muted">
                    Truyền myReaction khi viewer đã thả cảm xúc: trigger đổi sang đúng emoji đó, bấm lại để gỡ.
                </Typography>
            </div>
            <Controlled initialCount={12} initialReaction={ReactionType.Love} />
        </div>
    ),
}

/** Dùng khi viewer không được phép react (ví dụ hoạt động của chính mình), bar chỉ hiển thị số đếm và emoji của viewer, không có picker. */
export const ReadOnly: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chỉ đọc</Label>
                <Typography type="body-sm" color="muted">
                    Bỏ onReact khi viewer không được react, ví dụ hoạt động của chính mình: mất picker, giữ số đếm.
                </Typography>
            </div>
            <ReactionBar count={7} myReaction={ReactionType.Like} />
        </div>
    ),
}

/** Dùng khi bài đăng chưa có react nào và viewer cũng không được phép react, bar sẽ không hiển thị gì cả. */
export const ReadOnlyEmpty: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chỉ đọc và rỗng</Label>
                <Typography type="body-sm" color="muted">
                    Vừa không có react vừa không được react thì bar trả về null. Bày ở đây để xác nhận nó biến mất hẳn chứ không chừa khoảng trống dưới nội dung.
                </Typography>
            </div>
            <ReactionBar count={0} myReaction={null} />
        </div>
    ),
}
