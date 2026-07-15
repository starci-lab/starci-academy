import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ReactionBar } from "./index"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

const meta: Meta<typeof ReactionBar> = {
    title: "Blocks/Feed/ReactionBar",
    component: ReactionBar,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ReactionBar>

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
    parameters: { usage: "Dùng cho một bài đăng chưa có tương tác nào, viewer có thể mở picker để react lần đầu." },
    render: () => <Controlled initialCount={0} initialReaction={null} />,
}

/** Dùng khi viewer đã react bằng một cảm xúc cụ thể, trigger hiển thị đúng emoji đã chọn. */
export const MyReactionSelected: Story = {
    parameters: { usage: "Dùng khi viewer đã react bằng một cảm xúc cụ thể, trigger hiển thị đúng emoji đã chọn." },
    render: () => <Controlled initialCount={12} initialReaction={ReactionType.Love} />,
}

/** Dùng khi viewer không được phép react (ví dụ hoạt động của chính mình), bar chỉ hiển thị số đếm và emoji của viewer, không có picker. */
export const ReadOnly: Story = {
    parameters: { usage: "Dùng khi viewer không được phép react (ví dụ hoạt động của chính mình), bar chỉ hiển thị số đếm và emoji của viewer, không có picker." },
    render: () => <ReactionBar count={7} myReaction={ReactionType.Like} />,
}

/** Dùng khi bài đăng chưa có react nào và viewer cũng không được phép react, bar sẽ không hiển thị gì cả. */
export const ReadOnlyEmpty: Story = {
    parameters: { usage: "Dùng khi bài đăng chưa có react nào và viewer cũng không được phép react, bar sẽ không hiển thị gì cả." },
    render: () => (
        <div className="text-xs text-muted">
            (Không render gì — ReactionBar trả về null khi count = 0 và không có onReact)
            <ReactionBar count={0} myReaction={null} />
        </div>
    ),
}
