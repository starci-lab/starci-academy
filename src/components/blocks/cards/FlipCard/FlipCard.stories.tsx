import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Button, Chip } from "@heroui/react"
import { FlipCard } from "./index"

const Controlled = ({
    initialRevealed,
    front,
    back,
    belowFront,
}: {
    initialRevealed: boolean
    front: React.ReactNode
    back: React.ReactNode
    belowFront?: React.ReactNode
}) => {
    const [revealed, setRevealed] = useState(initialRevealed)
    return (
        <div className="flex w-[28rem] flex-col gap-4">
            <FlipCard
                revealed={revealed}
                questionLabel="Câu hỏi"
                answerLabel="Đáp án"
                front={front}
                belowFront={belowFront}
                back={back}
            />
            <Button size="sm" onPress={() => setRevealed((prev) => !prev)}>
                {revealed ? "Ẩn đáp án" : "Xem đáp án"}
            </Button>
        </div>
    )
}

const meta: Meta<typeof FlipCard> = {
    title: "Blocks/Card/FlipCard",
    component: FlipCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof FlipCard>

/** Dùng khi thẻ mới hiển thị, học viên chưa bấm "Xem đáp án" — chỉ câu hỏi hiện, đáp án còn ẩn để buộc học viên tự nhớ trước khi xem. */
export const Default: Story = {
    parameters: { usage: "Dùng khi thẻ mới hiển thị, học viên chưa bấm \"Xem đáp án\" — chỉ câu hỏi hiện, đáp án còn ẩn để buộc học viên tự nhớ trước khi xem." },
    render: () => (
        <Controlled
            initialRevealed={false}
            front="Sự khác nhau giữa `let` và `var` trong JavaScript là gì?"
            back="`let` có block scope và không bị hoisting theo kiểu khởi tạo `undefined`, trong khi `var` có function scope và bị hoisting."
        />
    ),
}

/** Dùng sau khi học viên bấm "Xem đáp án" — đáp án mở rộng bên dưới câu hỏi để đối chiếu trước khi tự chấm điểm nhớ lại. */
export const Revealed: Story = {
    parameters: { usage: "Dùng sau khi học viên bấm \"Xem đáp án\" — đáp án mở rộng bên dưới câu hỏi để đối chiếu trước khi tự chấm điểm nhớ lại." },
    render: () => (
        <Controlled
            initialRevealed
            front="Sự khác nhau giữa `let` và `var` trong JavaScript là gì?"
            back="`let` có block scope và không bị hoisting theo kiểu khởi tạo `undefined`, trong khi `var` có function scope và bị hoisting."
        />
    ),
}

/** Dùng khi thẻ có gắn mức độ/chủ đề — chip xếp ngay dưới câu hỏi (gap-3) để vẫn neo cạnh câu hỏi khi đáp án mở ra bên dưới. */
export const WithBelowFrontChips: Story = {
    parameters: { usage: "Dùng khi thẻ có gắn mức độ/chủ đề — chip xếp ngay dưới câu hỏi (gap-3) để vẫn neo cạnh câu hỏi khi đáp án mở ra bên dưới." },
    render: () => (
        <Controlled
            initialRevealed={false}
            front="Event loop trong Node.js hoạt động như thế nào?"
            belowFront={
                <div className="flex flex-wrap items-center gap-2">
                    <Chip size="sm" color="warning">Senior</Chip>
                    <span className="text-xs text-default-500">Node.js</span>
                </div>
            }
            back="Event loop xử lý các phase (timers, pending callbacks, poll, check, close callbacks) tuần tự, đẩy callback bất đồng bộ vào hàng đợi thay vì chặn main thread."
        />
    ),
}

/** Dùng khi đáp án dài hơn một màn hình — nội dung đáp án cuộn bên trong card (`max-h-[28rem]`) thay vì đẩy trang cuộn dài xuống. */
export const LongAnswerScrolls: Story = {
    parameters: { usage: "Dùng khi đáp án dài hơn một màn hình — nội dung đáp án cuộn bên trong card (`max-h-[28rem]`) thay vì đẩy trang cuộn dài xuống." },
    render: () => (
        <Controlled
            initialRevealed
            front="Liệt kê các chiến lược caching phổ biến trong hệ thống phân tán."
            back={
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <p key={index}>
                            {index + 1}. Cache-aside, write-through, write-behind, và các chiến lược invalidation tương ứng đều đánh đổi giữa độ tươi dữ liệu và độ trễ đọc/ghi.
                        </p>
                    ))}
                </div>
            }
        />
    ),
}
